from fastapi import APIRouter, HTTPException
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId

from app.database import poses_collection
from app.schemas.schemas import PoseOut
from app.utils import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/poses", tags=["poses"])


@router.get("/", response_model=list[PoseOut], response_model_by_alias=False)
def list_poses(condition: Optional[str] = None):
    query = {}
    if condition:
        # matches poses whose related_conditions array contains this condition
        query["related_conditions"] = condition
    docs = list(poses_collection.find(query))
    return serialize_docs(docs)


@router.get("/{pose_id}", response_model=PoseOut, response_model_by_alias=False)
def get_pose(pose_id: str):
    try:
        doc = poses_collection.find_one({"_id": ObjectId(pose_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid pose id format")
    if not doc:
        raise HTTPException(status_code=404, detail="Pose not found")
    return serialize_doc(doc)