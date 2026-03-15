import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env variables (for supabase) — tries .env first, then .env.local
load_dotenv(".env")
load_dotenv(".env.local")

app = FastAPI(title="Diabetes Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders
MODEL_PATH = "models/model.pkl"
SCALER_PATH = "models/scaler.pkl"
GENDER_ENCODER_PATH = "models/gender_encoder.pkl"
SMOKING_ENCODER_PATH = "models/smoking_encoder.pkl"

# Initialize them as None, they will be loaded on first request or startup
model = None
scaler = None
gender_encoder = None
smoking_encoder = None

def load_ml_assets():
    global model, scaler, gender_encoder, smoking_encoder
    try:
        if model is None:
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            gender_encoder = joblib.load(GENDER_ENCODER_PATH)
            smoking_encoder = joblib.load(SMOKING_ENCODER_PATH)
            print("Models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")

load_ml_assets()

# Initialize Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized.")
    except Exception as e:
        print(f"Error initializing Supabase: {e}")

class HealthDataInput(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    smoking_history: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Diabetes Prediction API is running."}

@app.post("/predict")
def predict_diabetes(data: HealthDataInput):
    load_ml_assets() # Ensure models are loaded if they weren't at startup
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")

    try:
        # Preprocess input
        input_data = data.model_dump()
        input_df = pd.DataFrame([input_data])
        
        # Encode categorical variables
        # Handle unseen values by falling back to the mode or skipping
        try:
            input_df['gender'] = gender_encoder.transform(input_df['gender'])
        except ValueError:
            # If the value is unseen, we might map it to a default (e.g. 0)
            input_df['gender'] = 0
            
        try:
            input_df['smoking_history'] = smoking_encoder.transform(input_df['smoking_history'])
        except ValueError:
            input_df['smoking_history'] = 0

        # Ensure column order matches training data
        columns = ['gender', 'age', 'hypertension', 'heart_disease', 'smoking_history', 'bmi', 'HbA1c_level', 'blood_glucose_level']
        input_df = input_df[columns]

        # Scale features
        input_scaled = scaler.transform(input_df)

        # Predict
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1] if hasattr(model, "predict_proba") else float(prediction)

        result_label = "Diabetes" if prediction == 1 else "No Diabetes"

        # Save to database
        if supabase:
            try:
                db_data = input_data.copy()
                db_data["prediction"] = result_label
                db_data["probability"] = float(probability)
                supabase.table("predictions").insert(db_data).execute()
            except Exception as db_err:
                print(f"Database error: {db_err}")

        return {
            "prediction": result_label,
            "probability": float(probability)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/history")
def get_prediction_history():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database Supabase tidak terhubung.")
    try:
        response = supabase.table("predictions").select("*").order("created_at", desc=True).limit(50).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
