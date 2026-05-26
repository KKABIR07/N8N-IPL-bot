/**
 * IPL AI Telegram Bot — Polling Bridge
 * Polls Telegram getUpdates API and forwards messages to n8n webhook.
 * Run with: node bot.js
 */

const https = require('https');
const http = require('http');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const N8N_WEBHOOK = 'http://localhost:5678/webhook/ipl-bot';
const POLL_TIMEOUT = 30; // long-poll seconds

let offset = 0;

function telegramRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(params);
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function forwardToN8N(chatId, text, username) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chatId, text, username });
    const url = new URL(N8N_WEBHOOK);
    const options = {
      hostname: url.hostname,
      port: url.port || 5678,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function poll() {
  try {
    const result = await telegramRequest('getUpdates', {
      offset,
      timeout: POLL_TIMEOUT,
      allowed_updates: ['message']
    });

    if (!result.ok) {
      console.error('Telegram error:', result.description);
      return;
    }

    for (const update of result.result) {
      offset = update.update_id + 1;
      const msg = update.message;
      if (!msg || !msg.text) continue;

      const chatId = msg.chat.id;
      const text = msg.text.trim();
      const username = msg.from?.first_name || msg.from?.username || 'Cricket Fan';

      console.log(`[${new Date().toLocaleTimeString()}] ${username} (${chatId}): ${text}`);

      // Handle /start command
      if (text === '/start') {
        await telegramRequest('sendMessage', {
          chat_id: chatId,
          text: '🏏 *Welcome to IPL AI Bot!*\n\nPowered by LLaMA 3.3 70B + real IPL data.\n\nTry asking:\n• _Best Dream11 team for MI vs CSK_\n• _Rohit Sharma IPL stats_\n• _CSK vs MI head to head_\n• _Who will win RCB vs KKR?_',
          parse_mode: 'Markdown'
        });
        continue;
      }

      // Send "typing..." indicator
      await telegramRequest('sendChatAction', { chat_id: chatId, action: 'typing' });

      // Forward to n8n
      try {
        await forwardToN8N(chatId, text, username);
        console.log(`  → Forwarded to n8n`);
      } catch (err) {
        console.error(`  → n8n error: ${err.message}`);
        await telegramRequest('sendMessage', {
          chat_id: chatId,
          text: '⚠️ AI engine is warming up. Please try again in a moment.'
        });
      }
    }
  } catch (err) {
    console.error('Poll error:', err.message);
    await new Promise(r => setTimeout(r, 3000));
  }

  // Continue polling
  setImmediate(poll);
}

async function main() {
  // Delete any existing webhook so getUpdates works
  await telegramRequest('deleteWebhook', { drop_pending_updates: false });
  console.log('✅ Webhook cleared — using long polling mode');

  const me = await telegramRequest('getMe');
  console.log(`🤖 Bot: @${me.result.username} (${me.result.first_name})`);
  console.log(`🔗 n8n webhook: ${N8N_WEBHOOK}`);
  console.log('');
  console.log('📡 Listening for Telegram messages... (Ctrl+C to stop)');
  console.log('');

  poll();
}

main().catch(console.error);
