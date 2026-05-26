# IPL AI ECOSYSTEM — Project Guide

## Project Overview

Enterprise-grade AI-powered IPL analytics platform with:
- Telegram bot (primary user interface via n8n)
- n8n as workflow orchestrator
- Groq LLaMA 3.3 70B as the AI brain
- MongoDB (local + Atlas) for IPL historical data
- Python ML microservice for predictions
- Qdrant for semantic/vector search
- Kafka + Redis for real-time event streaming
- React frontend dashboard

## Immediate MVP Goal

**Phase 1 — n8n Telegram Bot**
- n8n handles Telegram webhook
- Routes user queries (fantasy, prediction, stats, commentary)
- Calls Groq API (LLaMA 3.3 70B) for AI responses
- Queries MongoDB for IPL match/player data
- Returns intelligent answers to Telegram users

## Stack

| Layer | Tech |
|---|---|
| Workflow Orchestration | n8n |
| AI Model | Groq — LLaMA 3.3 70B |
| Database | MongoDB Atlas + Local MongoDB |
| ML Engine | Python FastAPI + XGBoost/LightGBM/CatBoost |
| Vector DB | Qdrant |
| Real-time | Kafka + Redis + Socket.IO |
| Frontend | React + TypeScript + TailwindCSS |
| Bots | Telegram + Discord |
| Deployment | Docker Compose + Nginx |

## MongoDB Collections

Existing:
- `matches` — historical IPL match data
- `deliveries` — ball-by-ball delivery data

To be created:
- `players`, `teams`, `venues`
- `fantasy_predictions`, `player_form`
- `user_preferences`, `commentary`
- `embeddings`, `live_scores`

## Folder Structure

```
N8N IPL bot/
├── CLAUDE.md                    ← this file
├── docker-compose.yml           ← full stack orchestration
├── .env.example                 ← env variable template
├── backend/                     ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── agents/              ← multi-agent AI system
│   │   ├── workflows/
│   │   └── types/
│   └── package.json
├── ml-engine/                   ← Python FastAPI ML service
│   ├── main.py
│   ├── models/
│   ├── services/
│   └── requirements.txt
├── frontend/                    ← React + TypeScript + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   └── package.json
├── n8n/                         ← n8n workflow JSON exports
│   ├── telegram-bot.json
│   ├── discord-bot.json
│   ├── ai-orchestration.json
│   └── prediction-pipeline.json
├── scripts/                     ← setup, seeding, utility scripts
└── nginx/                       ← reverse proxy config
```

## n8n Telegram Bot — Workflow Design

```
Telegram Message Received
        ↓
  Detect Intent (Groq)
        ↓
  ┌─────────────────────────────────┐
  │  Fantasy?  → Fantasy Agent      │
  │  Predict?  → Prediction Agent   │
  │  Stats?    → Stats Agent        │
  │  Matchup?  → Analytics Agent    │
  │  General?  → Commentary Agent   │
  └─────────────────────────────────┘
        ↓
  Query MongoDB for context
        ↓
  Send to Groq LLaMA 3.3 70B
        ↓
  Format Response
        ↓
  Send to Telegram
```

## Required Credentials

- `TELEGRAM_BOT_TOKEN` — from BotFather
- `GROQ_API_KEY` — from console.groq.com
- `MONGODB_ATLAS_URI` — Atlas connection string
- `MONGODB_LOCAL_URI` — local MongoDB URI
- `N8N_ENCRYPTION_KEY` — random 32-char string for n8n

## API Endpoints (Backend)

```
GET  /api/matches
GET  /api/match/:id
GET  /api/player/:name
GET  /api/team/:name
GET  /api/headtohead
POST /api/predict
POST /api/fantasy
POST /api/commentary
POST /api/semantic-search
GET  /api/live-insights
```

## Phase Plan

| Phase | Deliverable | Status |
|---|---|---|
| 1 | n8n Telegram bot (Groq + MongoDB) | In Progress |
| 2 | Backend REST API (Node + TypeScript) | Pending |
| 3 | Python ML Engine (FastAPI) | Pending |
| 4 | Qdrant Semantic Search | Pending |
| 5 | Kafka + Redis real-time | Pending |
| 6 | React Frontend | Pending |
| 7 | Docker Compose full stack | Pending |

## Development Commands

```bash
# Start n8n locally
npx n8n

# Start n8n via Docker
docker-compose up n8n

# Start full stack
docker-compose up -d

# Start backend
cd backend && npm run dev

# Start ML engine
cd ml-engine && uvicorn main:app --reload

# Start frontend
cd frontend && npm run dev
```

## Notes

- n8n runs on port 5678 by default
- Backend on port 3001
- ML engine on port 8000
- Frontend on port 3000
- Qdrant on port 6333
