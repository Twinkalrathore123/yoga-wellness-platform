import os
import joblib
from fastapi import HTTPException

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "ml-models")

# Cache so each model file is only loaded from disk once per server run
_loaded_models: dict = {}


def load_model(filename: str):
    """Lazy-loads a .pkl model by filename, caches it in memory.
    Used the same way by every disease model — heart, mental health, diabetes, etc."""
    if filename not in _loaded_models:
        model_path = os.path.join(MODEL_DIR, filename)
        if not os.path.exists(model_path):
            raise HTTPException(
                status_code=503,
                detail=f"Model file '{filename}' not found in ml-models/. Train it first.",
            )
        _loaded_models[filename] = joblib.load(model_path)
    return _loaded_models[filename]


def risk_level_from_score(score: float) -> str:
    """Shared thresholds so every model reports risk the same way.
    Adjust these cutoffs per-model later if a disease needs different sensitivity."""
    if score < 0.33:
        return "low"
    elif score < 0.66:
        return "moderate"
    return "high"
