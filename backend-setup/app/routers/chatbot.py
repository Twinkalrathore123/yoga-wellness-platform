import json

from fastapi import APIRouter
from groq import Groq

from app.config import settings
from app.database import poses_collection, videos_collection
from app.schemas.schemas import ChatRequest, ChatResponse
from app.utils import serialize_docs


router = APIRouter(
    prefix="/api/chat",
    tags=["chatbot"]
)


# Initialize Groq client
client = Groq(
    api_key=settings.groq_api_key
)


# Groq recommended replacement for the deprecated
# llama-3.3-70b-versatile model.
#
# GPT-OSS 120B supports JSON output and is suitable
# for instruction-following and chatbot applications.
GROQ_MODEL = "openai/gpt-oss-120b"


# Maps each prediction model's name to the `condition`
# tag used in:
#   - yoga_poses.related_conditions
#   - yoga_videos.condition
#
# Update this dictionary whenever you add a new
# prediction model.
MODEL_TO_CONDITION = {
    "heart_attack": "heart",
    "mental_health": "stress",
    "diabetes": "diabetes",
    "hypertension": "heart",
}


def build_context_lists(condition_hint: str | None = None):
    """
    Pull a limited set of yoga poses and videos from MongoDB.

    The LLM is only allowed to recommend items from
    these lists. This prevents it from inventing
    yoga poses or YouTube links.
    """

    # Build MongoDB queries
    pose_query = (
        {"related_conditions": condition_hint}
        if condition_hint
        else {}
    )

    video_query = (
        {"condition": condition_hint}
        if condition_hint
        else {}
    )

    # Fetch poses and videos
    poses = serialize_docs(
        list(
            poses_collection
            .find(pose_query)
            .limit(15)
        )
    )

    videos = serialize_docs(
        list(
            videos_collection
            .find(video_query)
            .limit(10)
        )
    )

    # Prepare pose data for the LLM
    pose_list = [
        {
            "id": p["_id"],
            "name_en": p["name_en"],
            "name_hi": p["name_hi"],
            "benefits_en": p.get("benefits_en"),
        }
        for p in poses
    ]

    # Prepare video data for the LLM
    video_list = [
        {
            "id": v["_id"],
            "title_en": v["title_en"],
            "title_hi": v["title_hi"],
            "youtube_url": v["youtube_url"],
        }
        for v in videos
    ]

    return pose_list, video_list


def build_system_prompt(
    language: str,
    pose_list: list,
    video_list: list
) -> str:
    """
    Build the system prompt used by the Groq model.
    """

    lang_name = "Hindi" if language == "hi" else "English"

    return f"""
You are a yoga and wellness assistant.

Respond ONLY in {lang_name}.

IMPORTANT RULES:

1. You must ONLY recommend yoga poses from the
   Available poses list below.

2. You must ONLY recommend videos from the
   Available videos list below.

3. NEVER invent a yoga pose.

4. NEVER invent a YouTube video or YouTube URL.

5. If nothing from the provided lists is suitable,
   say so instead of making something up.

6. The "id" values are MongoDB string IDs.
   Copy them EXACTLY as provided.
   Do not shorten, modify, or reformat them.

7. Always include a brief reminder that this is
   general wellness guidance and NOT a medical diagnosis.

8. For medical concerns, recommend consulting a
   qualified doctor.

Available poses (JSON):
{json.dumps(pose_list)}

Available videos (JSON):
{json.dumps(video_list)}

Return ONLY a valid JSON object.

Do NOT return:
- Markdown
- Code fences
- Explanations outside JSON
- Extra text

Use exactly this JSON structure:

{{
    "advice_text": "string - your advice in {lang_name}",
    "recommended_pose_ids": [
        "list of IDs from the available poses"
    ],
    "recommended_video_ids": [
        "list of IDs from the available videos"
    ],
    "diet_tips": [
        "short diet tips in {lang_name}"
    ]
}}
"""


@router.post(
    "/",
    response_model=ChatResponse
)
def chat(request: ChatRequest):
    """
    Chatbot API endpoint.

    Flow:
    1. Get prediction context.
    2. Map prediction model to a condition.
    3. Fetch relevant yoga poses/videos from MongoDB.
    4. Send the context to Groq.
    5. Get structured JSON response.
    6. Validate response using ChatResponse.
    """

    # --------------------------------------------------
    # 1. Determine condition from prediction context
    # --------------------------------------------------

    condition_hint = None

    if request.prediction_context:
        condition_hint = MODEL_TO_CONDITION.get(
            request.prediction_context.model
        )

    # --------------------------------------------------
    # 2. Get yoga poses and videos from MongoDB
    # --------------------------------------------------

    pose_list, video_list = build_context_lists(
        condition_hint
    )

    # --------------------------------------------------
    # 3. Build system prompt
    # --------------------------------------------------

    system_prompt = build_system_prompt(
        request.language,
        pose_list,
        video_list
    )

    # --------------------------------------------------
    # 4. Prepare user message
    # --------------------------------------------------

    user_message = request.message

    if request.prediction_context:
        pc = request.prediction_context

        user_message = (
            f"[Prediction result: "
            f"model={pc.model}, "
            f"risk_level={pc.risk_level}, "
            f"risk_score={pc.risk_score}, "
            f"key_factors={pc.key_factors}]\n\n"
            f"{request.message}"
        )

    # --------------------------------------------------
    # 5. Call Groq API
    # --------------------------------------------------

    response = client.chat.completions.create(
        model=GROQ_MODEL,

        # Maximum output tokens
        max_tokens=1000,

        # GPT-OSS reasoning level
        # Low is sufficient for this chatbot because
        # MongoDB already provides the relevant context.
        reasoning_effort="low",

        # Force JSON response
        response_format={
            "type": "json_object"
        },

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
    )

    # --------------------------------------------------
    # 6. Extract model response
    # --------------------------------------------------

    raw_text = response.choices[0].message.content

    # Safety check
    if not raw_text:
        raise ValueError(
            "Groq returned an empty response."
        )

    # --------------------------------------------------
    # 7. Parse JSON response
    # --------------------------------------------------

    try:
        parsed = json.loads(raw_text)

    except json.JSONDecodeError:
        # Sometimes models may still return
        # ```json ... ```
        # even when JSON mode is enabled.

        cleaned = (
            raw_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(cleaned)

    # --------------------------------------------------
    # 8. Validate response using Pydantic schema
    # --------------------------------------------------

    return ChatResponse(**parsed)