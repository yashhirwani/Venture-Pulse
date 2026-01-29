import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

DATA_PATH = "data/startup_ml_clean.csv"
MODEL_PATH = "models/risk_model.joblib"
PREPROCESSOR_PATH = "models/preprocessor.joblib"

# -----------------------------
# 1. Load Data
# -----------------------------
df = pd.read_csv(DATA_PATH)

print("Loaded ML data shape:", df.shape)
print(df.head())

X = df.drop(columns=['status_failed'])
y = df['status_failed']

# -----------------------------
# 2. Define Features
# -----------------------------
numeric_features = [
    'funding_total_usd',
    'funding_rounds',
    'years_since_founded',
    'years_since_last_funding'
]

categorical_features = ['domain_clean']

# -----------------------------
# 3. Preprocessing
# -----------------------------
numeric_transformer = 'passthrough'

categorical_transformer = OneHotEncoder(
    handle_unknown='ignore',
    sparse_output=False
)

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

# -----------------------------
# 4. Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight='balanced',
    n_jobs=-1
)

# -----------------------------
# 5. Pipeline
# -----------------------------
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', model)
])

# -----------------------------
# 6. Train/Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Train shape:", X_train.shape)
print("Test shape:", X_test.shape)

# -----------------------------
# 7. Train Model
# -----------------------------
print("Training model...")
pipeline.fit(X_train, y_train)

# -----------------------------
# 8. Evaluate
# -----------------------------
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

roc_auc = roc_auc_score(y_test, y_proba)
print("ROC-AUC Score:", round(roc_auc, 4))

# -----------------------------
# 9. Save Model
# -----------------------------
import os
os.makedirs("models", exist_ok=True)

joblib.dump(pipeline, MODEL_PATH)

print("\n✅ Model training complete")
print("Model saved to:", MODEL_PATH)
