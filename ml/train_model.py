"""
Machine Learning Pipeline for Comprehensive Diabetes Prediction
================================================================
Uses the Diabetes Health Dataset (Rabie El Kharoua) with 24 selected features
across 5 categories: Demographics, Medical History, Clinical Data, Lifestyle, Symptoms.

Trains Logistic Regression, Random Forest, and XGBoost, evaluates them with
cross-validation, and exports the best model.
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, roc_auc_score, classification_report
)
import joblib

# ─── Feature Configuration ─────────────────────────────────────────
# These are the 24 features selected for the comprehensive screening

FEATURE_GROUPS = {
    "demographics": ["Age", "Gender", "Ethnicity", "BMI"],
    "medical_history": [
        "FamilyHistoryDiabetes", "PreviousPreDiabetes", "GestationalDiabetes",
        "Hypertension", "PolycysticOvarySyndrome",
    ],
    "clinical": [
        "HbA1c", "FastingBloodSugar", "SystolicBP", "DiastolicBP",
        "CholesterolTotal", "CholesterolLDL", "CholesterolHDL",
        "CholesterolTriglycerides",
    ],
    "lifestyle": [
        "Smoking", "AlcoholConsumption", "PhysicalActivity",
        "DietQuality", "SleepQuality",
    ],
    "symptoms": [
        "FrequentUrination", "ExcessiveThirst", "UnexplainedWeightLoss",
        "FatigueLevels", "BlurredVision", "TinglingHandsFeet",
    ],
}

TARGET_COL = "Diagnosis"

# Flatten all features into a single list
ALL_FEATURES = []
for group in FEATURE_GROUPS.values():
    ALL_FEATURES.extend(group)


def load_dataset():
    """Load the comprehensive diabetes health dataset."""
    local_path = os.path.join(os.path.dirname(__file__), "diabetes_health_dataset.csv")

    if os.path.exists(local_path):
        print(f"  Loading dataset from: {local_path}")
        return pd.read_csv(local_path)

    # Fallback: try kagglehub
    try:
        import kagglehub
        print("  Downloading dataset from KaggleHub...")
        path = kagglehub.dataset_download("rabieelkharoua/diabetes-health-dataset-analysis")
        csv_path = os.path.join(path, "diabetes_data.csv")
        df = pd.read_csv(csv_path)
        # Save locally
        df.to_csv(local_path, index=False)
        print(f"  Dataset saved locally: {local_path}")
        return df
    except Exception as e:
        print(f"  KaggleHub error: {e}")
        print("\n[ERROR] Could not load dataset.")
        print("Please download from:")
        print("  https://www.kaggle.com/datasets/rabieelkharoua/diabetes-health-dataset-analysis")
        print(f"And place it at: {local_path}")
        sys.exit(1)


def main():
    print("=" * 65)
    print("  COMPREHENSIVE DIABETES PREDICTION – ML TRAINING PIPELINE")
    print("  24 Features | 5 Categories | 3 Models")
    print("=" * 65)

    # ──────────────── 1. Load dataset ────────────────
    print("\n[STEP 1] Loading dataset...")
    df = load_dataset()
    print(f"  Raw shape: {df.shape}")

    # ──────────────── 2. Data cleaning ────────────────
    print("\n[STEP 2] Cleaning data...")
    df = df.drop_duplicates()

    # Keep only the columns we need
    required_cols = ALL_FEATURES + [TARGET_COL]
    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        print(f"  [WARNING] Missing columns: {missing_cols}")
        sys.exit(1)

    df = df[required_cols].copy()

    if df.isnull().sum().any():
        null_counts = df.isnull().sum()
        print(f"  Null values found:\n{null_counts[null_counts > 0]}")
        df = df.dropna()

    print(f"  Clean shape: {df.shape}")
    print(f"  Target distribution: {df[TARGET_COL].value_counts().to_dict()}")

    # ──────────────── 3. Feature preparation ──────────
    print("\n[STEP 3] Preparing features...")

    X = df[ALL_FEATURES].copy()
    y = df[TARGET_COL].copy()

    # All features in this dataset are already numeric (int/float)
    # No label encoding needed — Gender is already 0/1, Ethnicity is 0-3, etc.
    print(f"  Feature matrix shape: {X.shape}")
    print(f"  Features: {ALL_FEATURES}")

    # Print feature groups
    for group_name, features in FEATURE_GROUPS.items():
        print(f"\n  [{group_name.upper()}] ({len(features)} features)")
        for f in features:
            print(f"    - {f}: range [{X[f].min():.2f}, {X[f].max():.2f}], mean={X[f].mean():.2f}")

    # ──────────────── 4. Feature scaling ──────────────
    print("\n[STEP 4] Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))
    print("  Scaler saved [OK]")

    # Save feature names for API reference
    feature_config = {
        "features": ALL_FEATURES,
        "feature_groups": FEATURE_GROUPS,
        "target": TARGET_COL,
    }
    joblib.dump(feature_config, os.path.join(models_dir, "feature_config.pkl"))
    print("  Feature config saved [OK]")

    # ──────────────── 5. Train / test split ───────────
    print("\n[STEP 5] Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"  Train set: {X_train.shape[0]} samples")
    print(f"  Test  set: {X_test.shape[0]} samples")

    # ──────────────── 6. Model training ───────────────
    print("\n[STEP 6] Training models...\n")

    models = {
        "Logistic Regression": LogisticRegression(
            random_state=42, max_iter=2000, C=1.0
        ),
        "Random Forest": RandomForestClassifier(
            random_state=42, n_estimators=100, max_depth=8, min_samples_split=5
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            random_state=42, n_estimators=100, max_depth=3, learning_rate=0.1
        ),
    }

    best_model = None
    best_f1 = 0.0
    best_name = ""
    results = {}

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, model in models.items():
        print(f"--- {name} ---")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = (
            model.predict_proba(X_test)[:, 1]
            if hasattr(model, "predict_proba")
            else y_pred.astype(float)
        )

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred)

        # Cross-validation
        cv_scores = cross_val_score(model, X_scaled, y, cv=cv, scoring="f1")

        print(f"  Accuracy:  {acc:.4f}")
        print(f"  Precision: {prec:.4f}")
        print(f"  Recall:    {rec:.4f}")
        print(f"  F1 Score:  {f1:.4f}")
        print(f"  ROC-AUC:   {roc:.4f}")
        print(f"  CV F1:     {cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")
        print(f"  Confusion Matrix:\n  {cm}\n")

        results[name] = {
            "accuracy": acc, "precision": prec, "recall": rec,
            "f1": f1, "roc_auc": roc, "cv_f1_mean": cv_scores.mean(),
        }

        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name

    # ──────────────── 7. Feature importance ───────────
    if hasattr(best_model, "feature_importances_"):
        print(f"\n[STEP 7] Feature Importance ({best_name}):")
        importances = best_model.feature_importances_
        feat_imp = sorted(zip(ALL_FEATURES, importances), key=lambda x: x[1], reverse=True)
        for feat, imp in feat_imp:
            bar = "#" * int(imp * 100)
            print(f"  {feat:35s} {imp:.4f} {bar}")

    # ──────────────── 8. Export best model ────────────
    print("\n" + "=" * 65)
    print(f"  [BEST] Model: {best_name}  (F1 = {best_f1:.4f})")
    print("=" * 65)

    joblib.dump(best_model, os.path.join(models_dir, "model.pkl"))
    print("  Model exported -> models/model.pkl [OK]")

    # Save model info
    model_info = {
        "best_model_name": best_name,
        "best_f1": best_f1,
        "all_results": results,
        "n_features": len(ALL_FEATURES),
        "n_samples": len(df),
    }
    joblib.dump(model_info, os.path.join(models_dir, "model_info.pkl"))
    print("  Model info exported -> models/model_info.pkl [OK]")

    print("\nDone! You can now start the FastAPI server.")
    print(f"Total features: {len(ALL_FEATURES)} | Total samples: {len(df)}")


if __name__ == "__main__":
    main()
