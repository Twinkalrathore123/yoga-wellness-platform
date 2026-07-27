import json
from fastapi import APIRouter
from groq import Groq

from app.config import settings
from app.database import poses_collection, videos_collection
from app.schemas.schemas import ChatRequest, ChatResponse
from app.utils import serialize_docs

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

client = Groq(api_key=settings.groq_api_key)

# Free tier, strong quality, good instruction-following for JSON output.
# Other free-tier options on Groq if you want to compare: "llama-3.1-8b-instant" (faster/cheaper),
# "gemma2-9b-it". Check console.groq.com/docs/models for the current list.
GROQ_MODEL = "llama-3.3-70b-versatile"

# Maps each prediction model's name to the `condition` tag used in the
# yoga_poses.related_conditions / yoga_videos.condition fields. Update this
# whenever you add a new model, so the chatbot knows which poses/videos to pull.
MODEL_TO_CONDITION = {
    "heart_attack": "heart",
    "mental_health": "stress",
    "diabetes": "diabetes",
    "hypertension": "heart",  # reuses heart-related content; adjust as you add hypertension-specific poses
}


def build_context_lists(condition_hint: str | None = None):
    """Pulls a trimmed set of poses/videos to ground the LLM's answer so it
    only ever recommends things that actually exist in your database."""
    pose_query = {"related_conditions": condition_hint} if condition_hint else {}
    video_query = {"condition": condition_hint} if condition_hint else {}

    poses = serialize_docs(list(poses_collection.find(pose_query).limit(15)))
    videos = serialize_docs(list(videos_collection.find(video_query).limit(10)))

    pose_list = [
        {"id": p["_id"], "name_en": p["name_en"], "name_hi": p["name_hi"], "benefits_en": p.get("benefits_en")}
        for p in poses
    ]
    video_list = [
        {"id": v["_id"], "title_en": v["title_en"], "title_hi": v["title_hi"], "youtube_url": v["youtube_url"]}
        for v in videos
    ]
    return pose_list, video_list


def build_system_prompt(language: str, pose_list: list, video_list: list) -> str:
    lang_name = "Hindi" if language == "hi" else "English"
    return f"""You are a yoga and wellness assistant. Respond only in {lang_name}.

You must ONLY recommend yoga poses and videos from the lists below — never invent
poses, exercises, or YouTube links that are not in these lists. If nothing in the
lists fits, say so instead of making something up.

Available poses (JSON): {json.dumps(pose_list)}

Available videos (JSON): {json.dumps(video_list)}

Note: pose/video "id" values are MongoDB string ids — copy them exactly as given,
do not shorten or reformat them.

Always include a brief reminder that this is general wellness guidance, not a
medical diagnosis, and that a doctor should be consulted for medical concerns.

Respond with ONLY a JSON object (no markdown, no extra text) in this exact shape:
{{
  "advice_text": "string - your advice in {lang_name}",
  "recommended_pose_ids": [list of id strings from the poses list above],
  "recommended_video_ids": [list of id strings from the videos list above],
  "diet_tips": ["short diet tip strings in {lang_name}"]
}}"""


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    condition_hint = None
    if request.prediction_context:
        condition_hint = MODEL_TO_CONDITION.get(request.prediction_context.model)

    pose_list, video_list = build_context_lists(condition_hint)
    system_prompt = build_system_prompt(request.language, pose_list, video_list)

    user_message = request.message
    if request.prediction_context:
        pc = request.prediction_context
        user_message = (
            f"[Prediction result: model={pc.model}, risk_level={pc.risk_level}, "
            f"risk_score={pc.risk_score}, key_factors={pc.key_factors}]\n\n{request.message}"
        )

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=1000,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    )

    raw_text = response.choices[0].message.content

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        cleaned = raw_text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(cleaned)

    return ChatResponse(**parsed)
