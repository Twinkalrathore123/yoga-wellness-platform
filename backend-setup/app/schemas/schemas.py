from pydantic import BaseModel, Field
from typing import Optional


# ---------- Poses ----------
class PoseOut(BaseModel):
    id: str = Field(alias="_id")
    name_en: str
    name_hi: str
    image_url: str
    benefits_en: Optional[str] = None
    benefits_hi: Optional[str] = None
    steps_en: Optional[list[str]] = None
    steps_hi: Optional[list[str]] = None
    precautions_en: Optional[str] = None
    precautions_hi: Optional[str] = None
    related_conditions: Optional[list[str]] = None

    class Config:
        populate_by_name = True


# ---------- Videos ----------
class VideoOut(BaseModel):
    id: str = Field(alias="_id")
    condition: str
    title_en: str
    title_hi: str
    youtube_url: str
    difficulty_level: Optional[str] = None
    duration_min: Optional[int] = None

    class Config:
        populate_by_name = True


# ---------- Prediction inputs (one per model) ----------
class HeartPredictionInput(BaseModel):
    age: int
    sex: int  # 0 = female, 1 = male
    resting_bp: float
    cholesterol: float
    max_heart_rate: float
    fasting_blood_sugar: int  # 0 or 1
    exercise_angina: int  # 0 or 1
    st_depression: float


class MentalHealthInput(BaseModel):
    # Example: based on a short PHQ-9/GAD-9 style questionnaire, scored 0-3 each
    little_interest_pleasure: int  # 0=not at all ... 3=nearly every day
    feeling_down_depressed: int
    trouble_sleeping: int
    feeling_tired: int
    poor_appetite_overeating: int
    trouble_concentrating: int
    feeling_nervous_anxious: int
    not_control_worrying: int
    age: int


class DiabetesInput(BaseModel):
    # Based on PIMA Indians Diabetes dataset feature set
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int


class HypertensionInput(BaseModel):
    age: int
    sex: int
    bmi: float
    resting_bp: float
    salt_intake_level: int  # 0=low, 1=moderate, 2=high
    smoking: int  # 0 or 1
    physical_activity_level: int  # 0=low, 1=moderate, 2=high
    family_history: int  # 0 or 1


class PredictionOutput(BaseModel):
    """Standardized shape every prediction model returns —
    this is what makes plugging models into the chatbot uniform."""
    model: str
    risk_level: str  # "low" | "moderate" | "high"
    risk_score: float
    key_factors: list[str]


# ---------- Chatbot ----------
class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # "en" or "hi"
    prediction_context: Optional[PredictionOutput] = None


class ChatResponse(BaseModel):
    advice_text: str
    recommended_pose_ids: list[str] = []
    recommended_video_ids: list[str] = []
    diet_tips: list[str] = []
