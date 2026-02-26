# AquaSynapse — Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.10+
- Git

---

## 1. Frontend

```bash
# Install dependencies (already done if you have node_modules)
npm install

# Start development server
npm run dev
# ➜ http://localhost:5173
```

---

## 2. Backend ML Engine (Run ONCE to train)

```bash
cd backend/ml_engine
python generate_dataset.py   # Creates flood_dataset.csv (10,000 rows)
python train.py              # Trains RandomForest, saves model.pkl
```

---

## 3. Backend API Server

```bash
cd backend
pip install -r requirements.txt

# Start FastAPI
uvicorn main:app --reload --port 8000
# ➜ http://localhost:8000
# ➜ API Docs: http://localhost:8000/docs
```

---

## 4. Environment Variables (optional)

```bash
cp .env.example .env
# Edit .env with your keys:
# OPENWEATHER_KEY=your_key   (optional — falls back to dataset)
# VITE_SUPABASE_URL=...      (optional — uses in-memory store)
```

---

## 5. Supabase (optional)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open SQL Editor → paste `supabase/schema.sql` → Run
3. Add your URL + anon key to `.env`

---

## Ports

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| WebSocket | ws://localhost:8000/ws/updates |

---

## Project Layout

```
src/
  animations/   Framer Motion variants
  components/   KpiCard, FeatureImportanceChart
  hooks/        useApiQueries (React Query), useRealtime (WS)
  i18n/         en.ts, hi.ts, ta.ts
  pages/        HomePage (premium), LoginPage
  services/     api.ts (Axios)
  store/        useStore.ts (Zustand)
  App.tsx       Main app with all dashboard logic

backend/
  main.py       FastAPI app + WebSocket
  routes/       7 isolated service modules
  ml_engine/    generate_dataset, train, predict
  models/       Pydantic schemas
```
