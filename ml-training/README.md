# ML Training Scripts

Separate from the backend on purpose — training code and serving code shouldn't
live together. Train here, then copy the resulting `.pkl` file into
`backend-setup/ml-models/`.

## Setup

```bash
pip install pandas scikit-learn joblib numpy
```

## Folders

- **heart/** — needs a real dataset (UCI Heart Disease, via Kaggle). Best data
  quality of the four, start here.
- **diabetes/** — needs a real dataset (PIMA Indians Diabetes, via Kaggle).
- **mental-health/** — uses a synthetic, rule-based dataset generated in the
  script itself, since clean public clinical datasets for this exact
  questionnaire format are hard to find and ethically sensitive. Good enough
  for a working demo; swap in real data later if you find a suitable source.
- **hypertension/** — same approach: synthetic data built from known
  real-world risk-factor relationships (age, BMI, salt intake, smoking,
  activity, family history all push risk in the medically expected direction).

## Running each one

```bash
cd heart
python train_heart_model.py
# copy heart_model.pkl into ../../backend-setup/ml-models/

cd ../diabetes
python train_diabetes_model.py
# copy diabetes_model.pkl into ../../backend-setup/ml-models/

cd ../mental-health
python train_mental_health_model.py
# copy mental_health_model.pkl into ../../backend-setup/ml-models/

cd ../hypertension
python train_hypertension_model.py
# copy hypertension_model.pkl into ../../backend-setup/ml-models/
```

Once all four `.pkl` files are in `backend-setup/ml-models/`, every endpoint in
`/api/predict/*` will work end-to-end.

## Improving these later

- For heart/diabetes: try XGBoost, tune hyperparameters, check feature
  importance to refine the `key_factors` rules in the backend.
- For mental-health/hypertension: if you find a real dataset that fits, swap
  the synthetic generator for `pd.read_csv(...)` the same way heart/diabetes
  do it — the rest of the training code (split, train, evaluate, save) stays
  the same pattern.
