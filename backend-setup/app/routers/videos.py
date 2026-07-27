from fastapi import APIRouter
from typing import Optional

from app.database import videos_collection
from app.schemas.schemas import VideoOut
from app.utils import serialize_docs

router = APIRouter(prefix="/api/videos", tags=["videos"])


@router.get("/", response_model=list[VideoOut], response_model_by_alias=False)
def list_videos(condition: Optional[str] = None):
    query = {}
    if condition:
        query["condition"] = condition
    docs = list(videos_collection.find(query))
    return serialize_docs(docs)