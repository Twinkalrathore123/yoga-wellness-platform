from datetime import datetime, timezone
from typing import Optional

from app.database import predictions_collection
from app.schemas.schemas import PredictionOutput


def log_prediction(result: PredictionOutput, user_id: Optional[str] = None):
    """Every model calls this the same way after producing a PredictionOutput —
    keeps prediction history consistent regardless of which disease it's for."""
    predictions_collection.insert_one({
        "user_id": user_id,
        "model_name": result.model,
        "risk_level": result.risk_level,
        "risk_score": result.risk_score,
        "key_factors": result.key_factors,
        "created_at": datetime.now(timezone.utc),
    })
