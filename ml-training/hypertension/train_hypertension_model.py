"""
Trains the hypertension risk model.

Like mental health, a single standard public dataset for this exact feature
set isn't as commonly available as heart/diabetes, so this script generates
a synthetic-but-realistic training set using known risk-factor relationships
(age, BMI, salt intake, smoking, activity level, family history all push risk
up in a medically plausible direction). Swap in a real dataset later if you
find one that matches these features (search Kaggle: "hypertension risk
prediction dataset").
"""
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

np.random.seed(42)
n_samples = 2000

age = np.random.randint(18, 80, n_samples)
sex = np.random.randint(0, 2, n_samples)
bmi = np.random.normal(26, 5, n_samples).clip(15, 45)
resting_bp = np.random.normal(125, 15, n_samples).clip(90, 200)
salt_intake_level = np.random.randint(0, 3, n_samples)
smoking = np.random.randint(0, 2, n_samples)
physical_activity_level = np.random.randint(0, 3, n_samples)
family_history = np.random.randint(0, 2, n_samples)

# Weighted risk score based on known real-world risk factors, then thresholded
risk_score = (
    0.02 * age +
    0.15 * bmi +
    0.08 * resting_bp +
    3.0 * salt_intake_level +
    4.0 * smoking +
    -3.0 * physical_activity_level +
    4.0 * family_history +
    np.random.normal(0, 5, n_samples)  # noise
)
threshold = np.percentile(risk_score, 65)  # top ~35% labeled "at risk"
at_risk = (risk_score >= threshold).astype(int)

df = pd.DataFrame({
    "age": age, "sex": sex, "bmi": bmi, "resting_bp": resting_bp,
    "salt_intake_level": salt_intake_level, "smoking": smoking,
    "physical_activity_level": physical_activity_level,
    "family_history": family_history, "at_risk": at_risk,
})

FEATURE_COLUMNS = [
    "age", "sex", "bmi", "resting_bp", "salt_intake_level",
    "smoking", "physical_activity_level", "family_history",
]
X = df[FEATURE_COLUMNS]
y = df["at_risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]
print(classification_report(y_test, preds))
print(f"ROC AUC: {roc_auc_score(y_test, probs):.3f}")

joblib.dump(model, "hypertension_model.pkl")
print("\nSaved hypertension_model.pkl — copy this into backend-setup/ml-models/")
print("\nNOTE: trained on synthetic data reflecting known risk relationships.")
print("Good enough for a working demo — swap in a real dataset if you find one.")
