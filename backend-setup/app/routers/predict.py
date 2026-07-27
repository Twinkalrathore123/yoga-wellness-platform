import numpy as np
from fastapi import APIRouter

from app.schemas.schemas import (
    HeartPredictionInput,
    MentalHealthInput,
    DiabetesInput,
    HypertensionInput,
    PredictionOutput,
)
from app.ml.model_loader import load_model, risk_level_from_score
from app.ml.prediction_logging import log_prediction

router = APIRouter(prefix="/api/predict", tags=["predictions"])


# ============================================================
# HEART ATTACK RISK
# ============================================================
def heart_key_factors(data: HeartPredictionInput) -> list[str]:
    factors = []
    if data.cholesterol > 240:
        factors.append("high cholesterol")
    if data.resting_bp > 140:
        factors.append("high blood pressure")
    if data.fasting_blood_sugar == 1:
        factors.append("elevated blood sugar")
    if data.exercise_angina == 1:
        factors.append("exercise-induced angina")
    if data.age > 55:
        factors.append("age-related risk")
    return factors or ["no major risk factors flagged"]


@router.post("/heart", response_model=PredictionOutput)
def predict_heart_risk(data: HeartPredictionInput):
    model = load_model("heart_model.pkl")
    features = np.array([[
        data.age, data.sex, data.resting_bp, data.cholesterol,
        data.max_heart_rate, data.fasting_blood_sugar,
        data.exercise_angina, data.st_depression,
    ]])
    risk_score = float(model.predict_proba(features)[0][1])

    result = PredictionOutput(
        model="heart_attack",
        risk_level=risk_level_from_score(risk_score),
        risk_score=round(risk_score, 3),
        key_factors=heart_key_factors(data),
    )
    log_prediction(result)
    return result


# ============================================================
# MENTAL HEALTH RISK
# ============================================================
def mental_health_key_factors(data: MentalHealthInput) -> list[str]:
    factors = []
    if data.feeling_down_depressed >= 2:
        factors.append("persistent low mood")
    if data.little_interest_pleasure >= 2:
        factors.append("reduced interest/pleasure in activities")
    if data.trouble_sleeping >= 2:
        factors.append("sleep disturbance")
    if data.feeling_nervous_anxious >= 2:
        factors.append("frequent anxiety")
    if data.not_control_worrying >= 2:
        factors.append("difficulty controlling worry")
    if data.trouble_concentrating >= 2:
        factors.append("concentration difficulty")
    return factors or ["no major risk factors flagged"]


@router.post("/mental-health", response_model=PredictionOutput)
def predict_mental_health_risk(data: MentalHealthInput):
    model = load_model("mental_health_model.pkl")
    features = np.array([[
        data.little_interest_pleasure, data.feeling_down_depressed,
        data.trouble_sleeping, data.feeling_tired,
        data.poor_appetite_overeating, data.trouble_concentrating,
        data.feeling_nervous_anxious, data.not_control_worrying, data.age,
    ]])
    risk_score = float(model.predict_proba(features)[0][1])

    result = PredictionOutput(
        model="mental_health",
        risk_level=risk_level_from_score(risk_score),
        risk_score=round(risk_score, 3),
        key_factors=mental_health_key_factors(data),
    )
    log_prediction(result)
    return result


# ============================================================
# DIABETES RISK
# ============================================================
def diabetes_key_factors(data: DiabetesInput) -> list[str]:
    factors = []
    if data.glucose > 140:
        factors.append("elevated glucose")
    if data.bmi > 30:
        factors.append("high BMI")
    if data.blood_pressure > 90:
        factors.append("high blood pressure")
    if data.diabetes_pedigree_function > 0.8:
        factors.append("strong family history")
    if data.age > 45:
        factors.append("age-related risk")
    return factors or ["no major risk factors flagged"]


@router.post("/diabetes", response_model=PredictionOutput)
def predict_diabetes_risk(data: DiabetesInput):
    model = load_model("diabetes_model.pkl")
    features = np.array([[
        data.pregnancies, data.glucose, data.blood_pressure,
        data.skin_thickness, data.insulin, data.bmi,
        data.diabetes_pedigree_function, data.age,
    ]])
    risk_score = float(model.predict_proba(features)[0][1])

    result = PredictionOutput(
        model="diabetes",
        risk_level=risk_level_from_score(risk_score),
        risk_score=round(risk_score, 3),
        key_factors=diabetes_key_factors(data),
    )
    log_prediction(result)
    return result


# ============================================================
# HYPERTENSION RISK
# ============================================================
def hypertension_key_factors(data: HypertensionInput) -> list[str]:
    factors = []
    if data.resting_bp > 140:
        factors.append("elevated resting blood pressure")
    if data.bmi > 30:
        factors.append("high BMI")
    if data.salt_intake_level == 2:
        factors.append("high salt intake")
    if data.smoking == 1:
        factors.append("smoking")
    if data.physical_activity_level == 0:
        factors.append("low physical activity")
    if data.family_history == 1:
        factors.append("family history of hypertension")
    return factors or ["no major risk factors flagged"]


@router.post("/hypertension", response_model=PredictionOutput)
def predict_hypertension_risk(data: HypertensionInput):
    model = load_model("hypertension_model.pkl")
    features = np.array([[
        data.age, data.sex, data.bmi, data.resting_bp,
        data.salt_intake_level, data.smoking,
        data.physical_activity_level, data.family_history,
    ]])
    risk_score = float(model.predict_proba(features)[0][1])

    result = PredictionOutput(
        model="hypertension",
        risk_level=risk_level_from_score(risk_score),
        risk_score=round(risk_score, 3),
        key_factors=hypertension_key_factors(data),
    )
    log_prediction(result)
    return result


# ============================================================
# TO ADD YOUR 5th, 6th... MODEL: copy one of the blocks above.
# 1. Add an XInput schema in app/schemas/schemas.py
# 2. Write a small key_factors() function with your own rules
# 3. Write the endpoint using load_model() + risk_level_from_score() + log_prediction()
# That's it — the chatbot router doesn't need any changes, since it only
# reads PredictionOutput's standardized shape (model, risk_level, risk_score, key_factors).
# ============================================================
