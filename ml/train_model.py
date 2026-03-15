"""
Machine Learning Pipeline for Diabetes Prediction
===================================================
Loads the diabetes_prediction_dataset, preprocesses it,
trains Logistic Regression / Random Forest / Decision Tree,
evaluates them, and exports the best model as model.pkl.
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, roc_auc_score
)
import joblib


def load_dataset():
    """
    Try loading the dataset from multiple sources:
    1. Local CSV file (ml/diabetes_prediction_dataset.csv)
    2. KaggleHub API
    """
    local_path = os.path.join(os.path.dirname(__file__), "diabetes_prediction_dataset.csv")

    if os.path.exists(local_path):
        print(f"Loading dataset from local file: {local_path}")
        return pd.read_csv(local_path)

    # Fallback: try kagglehub
    try:
        import kagglehub
        from kagglehub import KaggleDatasetAdapter
        print("Downloading dataset from KaggleHub...")
        df = kagglehub.load_dataset(
            KaggleDatasetAdapter.PANDAS,
            "iammustafatz/diabetes-prediction-dataset",
            "diabetes_prediction_dataset.csv",
        )
        # Save locally for next time
        df.to_csv(local_path, index=False)
        print("Dataset saved locally for future use.")
        return df
    except Exception as e:
        print(f"KaggleHub error: {e}")
        print("\n[ERROR] Could not load dataset.")
        print("Please download the CSV manually from:")
        print("  https://www.kaggle.com/datasets/iammustafatz/diabetes-prediction-dataset")
        print(f"And place it at: {local_path}")
        sys.exit(1)


def main():
    # ──────────────── 1. Load dataset ────────────────
    print("=" * 60)
    print("  DIABETES PREDICTION – ML TRAINING PIPELINE")
    print("=" * 60)

    df = load_dataset()
    print(f"\nDataset shape (raw): {df.shape}")
    print(df.head())

    # ──────────────── 2. Data cleaning ────────────────
    print("\n[STEP 2] Cleaning data...")
    df = df.drop_duplicates()
    if df.isnull().sum().any():
        print("  Dropping rows with missing values...")
        df = df.dropna()
    print(f"  Dataset shape (clean): {df.shape}")

    # ──────────────── 3. Encode categoricals ──────────
    print("\n[STEP 3] Encoding categorical features...")
    gender_encoder = LabelEncoder()
    smoking_encoder = LabelEncoder()

    df["gender"] = gender_encoder.fit_transform(df["gender"])
    df["smoking_history"] = smoking_encoder.fit_transform(df["smoking_history"])

    # Save encoders
    os.makedirs("models", exist_ok=True)
    joblib.dump(gender_encoder, "models/gender_encoder.pkl")
    joblib.dump(smoking_encoder, "models/smoking_encoder.pkl")
    print("  Encoders saved ✓")
    print(f"  Gender classes:  {list(gender_encoder.classes_)}")
    print(f"  Smoking classes: {list(smoking_encoder.classes_)}")

    # ──────────────── 4. Feature scaling ──────────────
    print("\n[STEP 4] Scaling features...")
    feature_cols = [
        "gender", "age", "hypertension", "heart_disease",
        "smoking_history", "bmi", "HbA1c_level", "blood_glucose_level",
    ]
    X = df[feature_cols]
    y = df["diabetes"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, "models/scaler.pkl")
    print("  Scaler saved ✓")

    # ──────────────── 5. Train / test split ───────────
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    print(f"\n  Train set: {X_train.shape[0]} samples")
    print(f"  Test  set: {X_test.shape[0]} samples")

    # ──────────────── 6. Model training ───────────────
    print("\n[STEP 5] Training models...\n")
    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree":       DecisionTreeClassifier(random_state=42),
        "Random Forest":       RandomForestClassifier(random_state=42, n_estimators=100),
    }

    best_model = None
    best_f1 = 0.0
    best_name = ""

    for name, model in models.items():
        print(f"--- {name} ---")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = (
            model.predict_proba(X_test)[:, 1]
            if hasattr(model, "predict_proba")
            else y_pred.astype(float)
        )

        acc  = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec  = recall_score(y_test, y_pred, zero_division=0)
        f1   = f1_score(y_test, y_pred, zero_division=0)
        roc  = roc_auc_score(y_test, y_prob)
        cm   = confusion_matrix(y_test, y_pred)

        print(f"  Accuracy:  {acc:.4f}")
        print(f"  Precision: {prec:.4f}")
        print(f"  Recall:    {rec:.4f}")
        print(f"  F1 Score:  {f1:.4f}")
        print(f"  ROC-AUC:   {roc:.4f}")
        print(f"  Confusion Matrix:\n  {cm}\n")

        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name

    # ──────────────── 7. Export best model ────────────
    print("=" * 60)
    print(f"  ★ Best Model: {best_name}  (F1 = {best_f1:.4f})")
    print("=" * 60)
    joblib.dump(best_model, "models/model.pkl")
    print("  Model exported → models/model.pkl ✓")
    print("\nDone! You can now start the FastAPI server.")


if __name__ == "__main__":
    main()
