# Yoga & Wellness Backend (FastAPI + MongoDB)

## Setup

1. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```
- `MONGODB_URI` — easiest is a **free MongoDB Atlas cluster** (cloud-hosted, no local install, no password-reset headaches):
  1. Go to mongodb.com/cloud/atlas, sign up free
  2. Create a free (M0) cluster
  3. Under "Database Access", create a user with a password
  4. Under "Network Access", allow access from your IP (or `0.0.0.0/0` for easy dev access)
  5. Click "Connect" → "Drivers" → copy the connection string, replace `<password>` with your real password
- `GROQ_API_KEY` — free, get one at console.groq.com
- `JWT_SECRET_KEY` — any long random string (used later for auth)

   Alternatively, if you'd rather run MongoDB locally, install it from mongodb.com/try/download/community
   and use `MONGODB_URI=mongodb://localhost:27017` instead.

3. Seed sample data to test against:
```bash
python seed.py
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

API will be live at `http://localhost:8000`. Interactive docs (Swagger UI) at
`http://localhost:8000/docs` — use this to test endpoints without a frontend.

## Endpoints included

- `GET  /api/health` — health check
- `GET  /api/poses` — list yoga poses, optional `?condition=heart` filter
- `GET  /api/poses/{id}` — single pose detail (id is a MongoDB ObjectId string)
- `GET  /api/videos` — list videos, optional `?condition=heart` filter
- `POST /api/predict/heart` — heart attack risk
- `POST /api/predict/mental-health` — mental health risk
- `POST /api/predict/diabetes` — diabetes risk
- `POST /api/predict/hypertension` — hypertension risk
- `POST /api/chat` — chatbot, grounded in the poses/videos DB, accepts optional prediction_context

Each `/api/predict/*` endpoint needs its matching `.pkl` file in `ml-models/`:
`heart_model.pkl`, `mental_health_model.pkl`, `diabetes_model.pkl`,
`hypertension_model.pkl`. Endpoints return a clear 503 error telling you which
file is missing until you train and drop it in.

## Why MongoDB here

- No schema migrations — collections and fields appear automatically when you insert data
- No local server setup/password headaches — MongoDB Atlas gives you a free cloud
  cluster in a few minutes, so your whole team/dev machine can point at the same DB
- Good fit for content like poses/videos where fields can evolve without needing
  `ALTER TABLE`-style changes

## How multi-model support works

Three shared pieces make adding models cheap instead of repeating logic:

1. **`app/ml/model_loader.py`** — `load_model(filename)` lazy-loads and caches
   any `.pkl` file, and `risk_level_from_score(score)` applies the same
   low/moderate/high thresholds to every model.
2. **`app/ml/prediction_logging.py`** — `log_prediction(result)` writes any
   model's result to the same `prediction_logs` collection.
3. **`app/schemas/schemas.py`** — every model returns the same `PredictionOutput`
   shape: `{model, risk_level, risk_score, key_factors}`. This is what lets the
   chatbot router treat all 4+ models identically.

## Adding your 5th, 6th... model

In `app/routers/predict.py`:
1. Add an `XInput` Pydantic schema in `app/schemas/schemas.py`.
2. Write a small `x_key_factors(data)` function with your own rule-based flags.
3. Write the endpoint — copy any existing block (e.g. `predict_diabetes_risk`),
   swap in your feature list and model filename.
4. Add the model's name → condition tag mapping in
   `app/routers/chatbot.py`'s `MODEL_TO_CONDITION` dict.

Train each model separately in `ml-training/` notebooks (keep training code out
of the backend — only the saved `.pkl` files belong here).
