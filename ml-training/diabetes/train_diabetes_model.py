"""
Trains the diabetes risk model.

1. Download the PIMA Indians Diabetes dataset from Kaggle:
   https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database
2. Save it as diabetes.csv in this same folder.
3. Run: python train_diabetes_model.py
4. Copy the resulting diabetes_model.pkl into backend-setup/ml-models/
"""
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

df = pd.read_csv("diabetes.csv")

FEATURE_COLUMNS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]
TARGET_COLUMN = "Outcome"

X = df[FEATURE_COLUMNS]
y = df[TARGET_COLUMN]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]
print(classification_report(y_test, preds))
print(f"ROC AUC: {roc_auc_score(y_test, probs):.3f}")

joblib.dump(model, "diabetes_model.pkl")
print("\nSaved diabetes_model.pkl — copy this into backend-setup/ml-models/")
