from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.mongodb_uri)
db = client[settings.mongodb_db_name]

# Collections — think of these like tables. No schema migration needed with Mongo,
# but we still validate shape at the API layer using Pydantic (see app/schemas).
poses_collection = db["yoga_poses"]
videos_collection = db["yoga_videos"]
predictions_collection = db["prediction_logs"]
users_collection = db["users"]


def get_db():
    """FastAPI dependency — kept for consistency with the rest of the app,
    though pymongo's client is thread-safe and doesn't need per-request sessions
    the way SQLAlchemy did."""
    return db
