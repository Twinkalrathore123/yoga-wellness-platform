"""
Trains the mental health risk model.

Unlike heart/diabetes (lab values), this is questionnaire-based (PHQ-9/GAD-7
style: each question scored 0-3). You have two options for data:

Option A (recommended for a student/portfolio project): generate a synthetic
training set yourself using clear scoring rules (e.g. total score >= 15 out
of 24 = high risk), since real clinical mental-health datasets are hard to
find and ethically sensitive to use.

Option B: search Kaggle for "mental health survey" datasets and adapt the
feature columns below to match.

This script shows Option A — a synthetic dataset generator + trainer —
so you have something working immediately. Swap in real data later if
you find a suitable public dataset.
"""
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

# ---- 1. Generate a synthetic training set ----
np.random.seed(42)
n_samples = 2000

data = {
    "little_interest_pleasure": np.random.randint(0, 4, n_samples),
    "feeling_down_depressed": np.random.randint(0, 4, n_samples),
    "trouble_sleeping": np.random.randint(0, 4, n_samples),
    "feeling_tired": np.random.randint(0, 4, n_samples),
    "poor_appetite_overeating": np.random.randint(0, 4, n_samples),
    "trouble_concentrating": np.random.randint(0, 4, n_samples),
    "feeling_nervous_anxious": np.random.randint(0, 4, n_samples),
    "not_control_worrying": np.random.randint(0, 4, n_samples),
    "age": np.random.randint(15, 75, n_samples),
}
df = pd.DataFrame(data)

# Label rule: total questionnaire score >= 15 (out of max 24) = "at risk"
question_cols = [c for c in df.columns if c != "age"]
total_score = df[question_cols].sum(axis=1)
df["at_risk"] = (total_score >= 15).astype(int)

FEATURE_COLUMNS = question_cols + ["age"]
X = df[FEATURE_COLUMNS]
y = df["at_risk"]

# ---- 2. Train/test split ----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---- 3. Train ----
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]
print(classification_report(y_test, preds))
print(f"ROC AUC: {roc_auc_score(y_test, probs):.3f}")

joblib.dump(model, "mental_health_model.pkl")
print("\nSaved mental_health_model.pkl — copy this into backend-setup/ml-models/")
print("\nNOTE: this model is trained on synthetic, rule-based data. Treat it as")
print("a functional placeholder — swap in a real dataset before relying on it")
print("for anything beyond a course project/demo.")
