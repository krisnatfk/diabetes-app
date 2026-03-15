import joblib, pandas as pd

model = joblib.load('models/model.pkl')
scaler = joblib.load('models/scaler.pkl')
ge = joblib.load('models/gender_encoder.pkl')
se = joblib.load('models/smoking_encoder.pkl')

cols = ['gender','age','hypertension','heart_disease','smoking_history','bmi','HbA1c_level','blood_glucose_level']

tests = [
    ("Sangat Sehat (Muda, Normal)", "Female", 25, 0, 0, "never", 22, 4.5, 85),
    ("Agak Berisiko (BMI+HbA1c naik)", "Male", 50, 0, 0, "former", 29, 5.8, 130),
    ("Menengah (Pre-diabetes)", "Male", 55, 1, 0, "current", 30, 6.2, 145),
    ("Cukup Tinggi", "Female", 60, 1, 0, "never", 33, 6.8, 180),
    ("Sangat Tinggi (Semua buruk)", "Male", 65, 1, 1, "current", 38, 7.5, 250),
]

print("=" * 72)
print("  DESKRIPSI                           PROB     HASIL")
print("=" * 72)
for t in tests:
    label, gender, age, hyp, hd, smoke, bmi, hba1c, glucose = t
    df = pd.DataFrame([{
        'gender': gender, 'age': age, 'hypertension': hyp,
        'heart_disease': hd, 'smoking_history': smoke,
        'bmi': bmi, 'HbA1c_level': hba1c, 'blood_glucose_level': glucose
    }])
    df['gender'] = ge.transform(df['gender'])
    df['smoking_history'] = se.transform(df['smoking_history'])
    df = df[cols]
    X = scaler.transform(df)
    prob = model.predict_proba(X)[0][1]
    pred = "DIABETES" if prob >= 0.5 else "NORMAL"
    pct = "{:.1f}%".format(prob * 100)
    print("  {:<38} {:>6}   {}".format(label, pct, pred))
print("=" * 72)
