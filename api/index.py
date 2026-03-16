import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import joblib
import numpy as np
from supabase import create_client, Client

# Load env variables
try:
    from dotenv import load_dotenv
    load_dotenv(".env")
    load_dotenv(".env.local")
except ImportError:
    pass

app = FastAPI(title="Diabetes Prediction API - Comprehensive Screening")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ML Assets ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
FEATURE_CONFIG_PATH = os.path.join(BASE_DIR, "models", "feature_config.pkl")
MODEL_INFO_PATH = os.path.join(BASE_DIR, "models", "model_info.pkl")

model = None
scaler = None
feature_config = None
model_info = None

# Feature order must match training
FEATURE_ORDER = [
    "Age", "Gender", "Ethnicity", "BMI",
    "FamilyHistoryDiabetes", "PreviousPreDiabetes", "GestationalDiabetes",
    "Hypertension", "PolycysticOvarySyndrome",
    "HbA1c", "FastingBloodSugar", "SystolicBP", "DiastolicBP",
    "CholesterolTotal", "CholesterolLDL", "CholesterolHDL",
    "CholesterolTriglycerides",
    "Smoking", "AlcoholConsumption", "PhysicalActivity",
    "DietQuality", "SleepQuality",
    "FrequentUrination", "ExcessiveThirst", "UnexplainedWeightLoss",
    "FatigueLevels", "BlurredVision", "TinglingHandsFeet",
]


def load_ml_assets():
    global model, scaler, feature_config, model_info
    try:
        if model is None:
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            if os.path.exists(FEATURE_CONFIG_PATH):
                feature_config = joblib.load(FEATURE_CONFIG_PATH)
            if os.path.exists(MODEL_INFO_PATH):
                model_info = joblib.load(MODEL_INFO_PATH)
            print("Models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")


load_ml_assets()

# ─── Supabase ───────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized.")
    except Exception as e:
        print(f"Error initializing Supabase: {e}")


# ─── Pydantic Models ───────────────────────────────────────────
class HealthDataInput(BaseModel):
    """Comprehensive diabetes screening input with 28 parameters."""
    # Demographics (Step 1)
    Age: float = Field(..., ge=0, le=120, description="Usia (tahun)")
    Gender: int = Field(..., ge=0, le=1, description="0=Perempuan, 1=Laki-laki")
    Ethnicity: int = Field(0, ge=0, le=3, description="0=Kaukasia, 1=Afrika, 2=Asia, 3=Lainnya")
    BMI: float = Field(..., ge=10, le=60, description="Body Mass Index (kg/m2)")

    # Medical History (Step 2)
    FamilyHistoryDiabetes: int = Field(0, ge=0, le=1, description="Riwayat diabetes keluarga")
    PreviousPreDiabetes: int = Field(0, ge=0, le=1, description="Riwayat pre-diabetes")
    GestationalDiabetes: int = Field(0, ge=0, le=1, description="Diabetes gestasional")
    Hypertension: int = Field(0, ge=0, le=1, description="Riwayat hipertensi")
    PolycysticOvarySyndrome: int = Field(0, ge=0, le=1, description="PCOS")

    # Clinical Data (Step 3)
    HbA1c: float = Field(..., ge=3, le=15, description="Kadar HbA1c (%)")
    FastingBloodSugar: float = Field(..., ge=50, le=400, description="Gula darah puasa (mg/dL)")
    SystolicBP: int = Field(120, ge=70, le=220, description="Tekanan sistolik (mmHg)")
    DiastolicBP: int = Field(80, ge=40, le=140, description="Tekanan diastolik (mmHg)")
    CholesterolTotal: float = Field(200.0, ge=100, le=400, description="Kolesterol total (mg/dL)")
    CholesterolLDL: float = Field(100.0, ge=30, le=250, description="Kolesterol LDL (mg/dL)")
    CholesterolHDL: float = Field(50.0, ge=15, le=120, description="Kolesterol HDL (mg/dL)")
    CholesterolTriglycerides: float = Field(150.0, ge=30, le=500, description="Trigliserida (mg/dL)")

    # Lifestyle (Step 4)
    Smoking: int = Field(0, ge=0, le=1, description="Merokok: 0=Tidak, 1=Ya")
    AlcoholConsumption: float = Field(0.0, ge=0, le=30, description="Konsumsi alkohol (unit/minggu)")
    PhysicalActivity: float = Field(5.0, ge=0, le=20, description="Aktivitas fisik (jam/minggu)")
    DietQuality: float = Field(5.0, ge=0, le=10, description="Kualitas diet (1-10)")
    SleepQuality: float = Field(7.0, ge=1, le=10, description="Kualitas tidur (1-10)")

    # Symptoms (Step 5)
    FrequentUrination: int = Field(0, ge=0, le=1, description="Sering buang air kecil")
    ExcessiveThirst: int = Field(0, ge=0, le=1, description="Haus berlebihan")
    UnexplainedWeightLoss: int = Field(0, ge=0, le=1, description="Penurunan BB tidak wajar")
    FatigueLevels: float = Field(5.0, ge=0, le=10, description="Tingkat kelelahan (0-10)")
    BlurredVision: int = Field(0, ge=0, le=1, description="Penglihatan kabur")
    TinglingHandsFeet: int = Field(0, ge=0, le=1, description="Kesemutan tangan/kaki")


# ─── Risk Analysis Helpers ──────────────────────────────────────
def analyze_risk_factors(data: dict, probability: float):
    """Analyze individual risk categories and return detailed breakdown."""
    risk_categories = {}

    # Genetic & Family Risk
    genetic_score = 0
    if data["FamilyHistoryDiabetes"] == 1:
        genetic_score += 40
    if data["PreviousPreDiabetes"] == 1:
        genetic_score += 30
    if data["GestationalDiabetes"] == 1:
        genetic_score += 20
    if data["PolycysticOvarySyndrome"] == 1:
        genetic_score += 10
    risk_categories["genetic"] = {
        "label": "Risiko Genetik & Keluarga",
        "score": min(genetic_score, 100),
        "level": "high" if genetic_score >= 40 else "medium" if genetic_score >= 20 else "low",
    }

    # Clinical Risk
    clinical_score = 0
    if data["HbA1c"] >= 6.5:
        clinical_score += 35
    elif data["HbA1c"] >= 5.7:
        clinical_score += 20
    if data["FastingBloodSugar"] >= 126:
        clinical_score += 35
    elif data["FastingBloodSugar"] >= 100:
        clinical_score += 20
    if data["SystolicBP"] >= 140 or data["DiastolicBP"] >= 90:
        clinical_score += 15
    if data["CholesterolTotal"] >= 240:
        clinical_score += 10
    if data["CholesterolTriglycerides"] >= 200:
        clinical_score += 5
    risk_categories["clinical"] = {
        "label": "Risiko Klinis & Laboratorium",
        "score": min(clinical_score, 100),
        "level": "high" if clinical_score >= 50 else "medium" if clinical_score >= 25 else "low",
    }

    # Lifestyle Risk
    lifestyle_score = 0
    if data["BMI"] >= 30:
        lifestyle_score += 25
    elif data["BMI"] >= 25:
        lifestyle_score += 15
    if data["Smoking"] == 1:
        lifestyle_score += 15
    if data["AlcoholConsumption"] >= 14:
        lifestyle_score += 10
    if data["PhysicalActivity"] < 2.5:
        lifestyle_score += 20
    if data["DietQuality"] < 4:
        lifestyle_score += 15
    if data["SleepQuality"] < 5:
        lifestyle_score += 15
    risk_categories["lifestyle"] = {
        "label": "Risiko Gaya Hidup",
        "score": min(lifestyle_score, 100),
        "level": "high" if lifestyle_score >= 50 else "medium" if lifestyle_score >= 25 else "low",
    }

    # Symptom Risk
    symptom_score = 0
    if data["FrequentUrination"] == 1:
        symptom_score += 25
    if data["ExcessiveThirst"] == 1:
        symptom_score += 25
    if data["UnexplainedWeightLoss"] == 1:
        symptom_score += 20
    if data["BlurredVision"] == 1:
        symptom_score += 15
    if data["TinglingHandsFeet"] == 1:
        symptom_score += 15
    if data["FatigueLevels"] >= 7:
        symptom_score += 10
    risk_categories["symptoms"] = {
        "label": "Gejala Klinis",
        "score": min(symptom_score, 100),
        "level": "high" if symptom_score >= 50 else "medium" if symptom_score >= 25 else "low",
    }

    # Demographic Risk
    demo_score = 0
    if data["Age"] >= 65:
        demo_score += 30
    elif data["Age"] >= 45:
        demo_score += 20
    if data["Hypertension"] == 1:
        demo_score += 25
    if data["BMI"] >= 25:
        demo_score += 20
    risk_categories["demographic"] = {
        "label": "Risiko Demografis",
        "score": min(demo_score, 100),
        "level": "high" if demo_score >= 50 else "medium" if demo_score >= 25 else "low",
    }

    return risk_categories


# ─── Endpoints ──────────────────────────────────────────────────
@app.get("/api/")
def read_root():
    return {
        "status": "ok",
        "message": "Comprehensive Diabetes Prediction API is running.",
        "n_features": len(FEATURE_ORDER),
        "model_info": model_info if model_info else {},
    }


@app.post("/api/predict")
def predict_diabetes(data: HealthDataInput):
    load_ml_assets()
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")

    try:
        input_data = data.model_dump()

        # Build feature array in correct order
        feature_values = [float(input_data[f]) for f in FEATURE_ORDER]
        input_array = np.array([feature_values])

        # Scale features
        input_scaled = scaler.transform(input_array)

        # Predict
        prediction = model.predict(input_scaled)[0]
        probability = (
            model.predict_proba(input_scaled)[0][1]
            if hasattr(model, "predict_proba")
            else float(prediction)
        )

        result_label = "Diabetes" if prediction == 1 else "No Diabetes"

        # Analyze risk factors
        risk_factors = analyze_risk_factors(input_data, probability)

        # Save to database
        if supabase:
            try:
                db_data = {}
                for key, val in input_data.items():
                    db_data[key] = val
                db_data["prediction"] = result_label
                db_data["probability"] = float(probability)
                supabase.table("predictions").insert(db_data).execute()
            except Exception as db_err:
                print(f"Database error: {db_err}")

        return {
            "prediction": result_label,
            "probability": float(probability),
            "risk_factors": risk_factors,
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/history")
def get_prediction_history():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database Supabase tidak terhubung.")
    try:
        response = (
            supabase.table("predictions")
            .select("*")
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
