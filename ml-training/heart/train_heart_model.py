"""
Trains the heart attack risk model — updated to match the actual columns in
the UCI combined Heart Disease dataset (Cleveland/Hungarian/VA/Switzerland),
downloaded from: kaggle.com/datasets/redwankarimsony/heart-disease-data

Actual columns in this dataset:
id, age, sex, dataset, cp, trestbps, chol, fbs, restecg, thalch, exang,
oldpeak, slope, ca, thal, num

Run: python train_heart_model.py
Then copy the resulting heart_model.pkl into backend-setup/ml-models/
"""
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

# ---- 1. Load data ----
df = pd.read_csv("heart.csv")

# ---- 2. Clean up columns to match what our FastAPI endpoint sends ----
# sex: "Male"/"Female" text -> 1/0
df["sex"] = df["sex"].map({"Male": 1, "Female": 0})

# fbs / exang: TRUE/FALSE (as strings or booleans depending on how pandas
# parsed them) -> 1/0. astype(str) first makes this handle both cases safely.
df["fbs"] = df["fbs"].astype(str).map({"True": 1, "False": 0, "TRUE": 1, "FALSE": 0})
df["exang"] = df["exang"].astype(str).map({"True": 1, "False": 0, "TRUE": 1, "FALSE": 0})

# num: 0-4 severity scale in this dataset -> convert to binary
# (0 = no disease, 1-4 = disease present) — this matches what our
# PredictionOutput/key_factors logic expects (binary risk classification)
df["target"] = (df["num"] > 0).astype(int)

# Our FastAPI endpoint's HeartPredictionInput uses these 8 fields:
# age, sex, resting_bp, cholesterol, max_heart_rate, fasting_blood_sugar,
# exercise_angina, st_depression
# Map dataset column names to that same order:
FEATURE_COLUMNS = ["age", "sex", "trestbps", "chol", "thalch", "fbs", "exang", "oldpeak"]
TARGET_COLUMN = "target"

# ---- 3. Drop rows with missing values in the columns we actually use ----
df = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN])

X = df[FEATURE_COLUMNS]
y = df[TARGET_COLUMN]

print(f"Training on {len(df)} rows after cleaning.")
print(f"Class balance:\n{y.value_counts()}\n")

# ---- 4. Train/test split ----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---- 5. Train a couple of candidate models ----
log_reg = LogisticRegression(max_iter=1000)
log_reg.fit(X_train, y_train)

rf = RandomForestClassifier(n_estimators=200, random_state=42)
rf.fit(X_train, y_train)

# ---- 6. Compare — recall matters most here (missing a high-risk case is worse
# than a false alarm), so look at recall for class 1 specifically ----
for name, model in [("Logistic Regression", log_reg), ("Random Forest", rf)]:
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    print(f"\n--- {name} ---")
    print(classification_report(y_test, preds))
    print(f"ROC AUC: {roc_auc_score(y_test, probs):.3f}")

# ---- 7. Pick the better model and save it ----
# Swap `rf` for `log_reg` below if logistic regression scores better on your data.
best_model = rf
joblib.dump(best_model, "heart_model.pkl")
print("\nSaved heart_model.pkl — copy this into backend-setup/ml-models/")