import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder

print("Generating dummy model for testing...")
os.makedirs("models", exist_ok=True)

# 1. Create dummy encoders
gender_encoder = LabelEncoder()
gender_encoder.fit(["Female", "Male", "Other"])
joblib.dump(gender_encoder, 'models/gender_encoder.pkl')

smoking_encoder = LabelEncoder()
smoking_encoder.fit(["never", "No Info", "current", "former", "ever", "not current"])
joblib.dump(smoking_encoder, 'models/smoking_encoder.pkl')

# 2. Create dummy scaler
scaler = StandardScaler()
dummy_data = np.random.rand(10, 8)
scaler.fit(dummy_data)
joblib.dump(scaler, 'models/scaler.pkl')

# 3. Create dummy model
model = LogisticRegression()
# Fit with dummy data matching 8 features
X = np.random.rand(10, 8)
y = np.array([0, 1, 0, 1, 0, 1, 0, 1, 0, 1])
model.fit(X, y)

joblib.dump(model, 'models/model.pkl')
print("Dummy model generated successfully.")
