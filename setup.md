# 🏏 IPL AI Telegram Bot — Setup Guide

## Prerequisites Checklist

- [x] n8n 2.21.7 installed globally
- [x] Node.js v22.19.0
- [x] Telegram Bot Token
- [x] Groq API Key (LLaMA 3.3 70B)
- [x] MongoDB Atlas with `matches` + `deliveries` collections

---

## Step 1 — Start n8n

Open a new terminal (CMD or PowerShell):

```cmd
n8n start
```

Wait for the message:
```
Editor is now accessible via:
http://localhost:5678
```

Open your browser at: **http://localhost:5678**

---

## Step 2 — Set Up Telegram Credential in n8n

1. In n8n, go to **Settings** (gear icon) → **Credentials**
2. Click **Add Credential**
3. Search for **"Telegram"**
4. Select **Telegram API**
5. Fill in:
   - **Name:** `IPL Telegram Bot`
   - **Access Token:** `YOUR_TELEGRAM_BOT_TOKEN` (from BotFather)
6. Click **Save**

---

## Step 3 — Set Up MongoDB Credential in n8n

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for **"MongoDB"**
4. Select **MongoDB**
5. Fill in:
   - **Name:** `IPL MongoDB`
   - **Connection String:** `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/test?appName=Cluster0`
   - **Database:** `ipl`
   
   > ⚠️ **Important:** Replace `ipl` with your actual database name if different. Check your MongoDB Atlas dashboard under **Browse Collections** to confirm the database name.

6. Click **Save & Test** to verify the connection

---

## Step 4 — Find Your MongoDB Database Name

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **Browse Collections**
3. Note the database name (left sidebar) — it contains your `matches` and `deliveries` collections
4. Use that name in Step 3

---

## Step 5 — Import the n8n Workflow

1. In n8n, click **Workflows** in the left sidebar
2. Click **Add Workflow** → **Import from File**
3. Select the file: `n8n/ipl-telegram-bot.json`
4. The workflow will open in the editor

---

## Step 6 — Fix Credential References

After importing, you'll see the **Telegram Trigger** node has a broken credential. Fix it:

1. Double-click the **"Telegram Trigger"** node
2. In **Credential to connect with**, select `IPL Telegram Bot`
3. Click outside to save

Then fix MongoDB:

1. Double-click the **"MongoDB Query"** node
2. In **Credential to connect with**, select `IPL MongoDB`
3. Click outside to save

---

## Step 7 — Activate the Workflow

1. Click the **Inactive** toggle in the top-right corner of the workflow
2. It should turn green and show **Active**
3. n8n will now start long-polling Telegram for messages

---

## Step 8 — Test the Bot

Open Telegram and send your bot a message:

```
/start
```

Or try these queries:

```
Best Dream11 team for MI vs CSK
```

```
Predict winner: RCB vs KKR
```

```
Kohli batting stats in IPL
```

```
CSK vs MI head to head record
```

```
Who has the most wickets in IPL?
```

---

## Workflow Architecture

```
Telegram Message
      ↓
Extract Message (Code)
      ↓
Build Intent Request (Code)
      ↓
Groq LLaMA 3.3 70B → Intent Detection
      ↓
Parse Intent (Code) → intent + MongoDB filter
      ↓
MongoDB Query → IPL historical data
      ↓
Build AI Request (Code) → format context
      ↓
Groq LLaMA 3.3 70B → Cricket AI Response
      ↓
Format Response (Code)
      ↓
Telegram API → Send Reply
```

---

## Intent Types the Bot Handles

| User Query Type | Intent | Data Source |
|---|---|---|
| "Best team for MI vs CSK" | fantasy | matches collection |
| "Who will win RCB vs KKR?" | predict | matches collection |
| "Kohli IPL stats" | stats | deliveries collection |
| "CSK vs MI head to head" | headtohead | matches collection |
| "Best IPL finisher ever?" | general | matches collection |

---

## Troubleshooting

### Bot not responding?
- Check n8n is running: `http://localhost:5678`
- Ensure the workflow is **Active** (green toggle)
- Check the **Executions** tab in n8n for errors

### MongoDB connection failing?
- Verify your Atlas URI is correct
- Check MongoDB Atlas → Network Access → ensure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)
- Confirm the database name matches what's in Atlas

### "Wrong database name" error?
- Open MongoDB Atlas → Browse Collections
- Check the exact database name on the left
- Update the credential in n8n with the correct name

### Groq API errors?
- Check your API key is valid: https://console.groq.com
- Verify `llama-3.3-70b-versatile` model is available in your region

### Telegram not receiving messages?
- Ensure you're talking to the right bot (@YourBotName)
- Try sending `/start` first
- Check n8n Executions tab to see if requests are coming in

---

## Next Phases

| Phase | What to Build |
|---|---|
| Phase 2 | Node.js Express backend with typed REST APIs |
| Phase 3 | Python FastAPI ML engine (XGBoost match predictions) |
| Phase 4 | Qdrant vector DB for semantic cricket search |
| Phase 5 | Kafka + Redis real-time streaming |
| Phase 6 | React dashboard with live analytics |
| Phase 7 | Docker Compose full stack deployment |
