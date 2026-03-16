"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Stethoscope, Info, ArrowRight, ArrowLeft,
  User, HeartPulse, FlaskConical, Dumbbell, AlertCircle,
  Check
} from "lucide-react";

// ─── Step Configuration ─────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Informasi Umum",
    subtitle: "Lengkapi data demografis dasar",
    icon: User,
    color: "from-sky-500 to-blue-600",
  },
  {
    id: 2,
    title: "Riwayat Medis & Keluarga",
    subtitle: "Ceritakan riwayat kesehatan Anda dan keluarga",
    icon: HeartPulse,
    color: "from-rose-500 to-pink-600",
  },
  {
    id: 3,
    title: "Data Klinis & Lab",
    subtitle: "Masukkan hasil pemeriksaan laboratorium",
    icon: FlaskConical,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 4,
    title: "Gaya Hidup",
    subtitle: "Ceritakan kebiasaan sehari-hari Anda",
    icon: Dumbbell,
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 5,
    title: "Gejala & Kondisi",
    subtitle: "Apakah Anda mengalami gejala berikut?",
    icon: AlertCircle,
    color: "from-amber-500 to-orange-600",
  },
];

// ─── Toggle Button Component ────────────────────────────────────
function ToggleButton({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4 hover:shadow-sm transition">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onChange(1)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === 1
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Ya
          </button>
          <button
            type="button"
            onClick={() => onChange(0)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === 0
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Slider-like Input ──────────────────────────────────────────
function RangeInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-slate-700">{label}</Label>
        {value && <span className="text-sm font-semibold text-sky-600">{value} {unit}</span>}
      </div>
      <Input
        id={name}
        name={name}
        type="number"
        step={step}
        min={min}
        max={max}
        placeholder={`${min} - ${max}`}
        value={value}
        onChange={onChange}
        required
        className="h-11"
      />
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────
export default function PredictPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Demographics
    Gender: 0,
    Age: "",
    weight: "",
    height: "",
    BMI: "",
    Ethnicity: 0,

    // Step 2: Medical History
    FamilyHistoryDiabetes: 0,
    PreviousPreDiabetes: 0,
    GestationalDiabetes: 0,
    Hypertension: 0,
    PolycysticOvarySyndrome: 0,

    // Step 3: Clinical
    HbA1c: "",
    FastingBloodSugar: "",
    SystolicBP: "",
    DiastolicBP: "",
    CholesterolTotal: "",
    CholesterolLDL: "",
    CholesterolHDL: "",
    CholesterolTriglycerides: "",

    // Step 4: Lifestyle
    Smoking: 0,
    AlcoholConsumption: "",
    PhysicalActivity: "",
    DietQuality: "",
    SleepQuality: "",

    // Step 5: Symptoms
    FrequentUrination: 0,
    ExcessiveThirst: 0,
    UnexplainedWeightLoss: 0,
    FatigueLevels: "",
    BlurredVision: 0,
    TinglingHandsFeet: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Auto-calculate BMI
    if (name === "weight" || name === "height") {
      const w = parseFloat(name === "weight" ? value : updated.weight);
      const h = parseFloat(name === "height" ? value : updated.height);
      if (w > 0 && h > 0) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(1);
        updated.BMI = bmi;
      }
    }

    setFormData(updated);
  };

  const handleToggle = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.Age && formData.BMI;
      case 2:
        return true; // All toggles have defaults
      case 3:
        return formData.HbA1c && formData.FastingBloodSugar;
      case 4:
        return true; // defaults are fine
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        Age: parseFloat(formData.Age),
        Gender: formData.Gender,
        Ethnicity: formData.Ethnicity,
        BMI: parseFloat(formData.BMI),
        FamilyHistoryDiabetes: formData.FamilyHistoryDiabetes,
        PreviousPreDiabetes: formData.PreviousPreDiabetes,
        GestationalDiabetes: formData.GestationalDiabetes,
        Hypertension: formData.Hypertension,
        PolycysticOvarySyndrome: formData.PolycysticOvarySyndrome,
        HbA1c: parseFloat(formData.HbA1c) || 5.5,
        FastingBloodSugar: parseFloat(formData.FastingBloodSugar) || 90,
        SystolicBP: parseInt(formData.SystolicBP) || 120,
        DiastolicBP: parseInt(formData.DiastolicBP) || 80,
        CholesterolTotal: parseFloat(formData.CholesterolTotal) || 200,
        CholesterolLDL: parseFloat(formData.CholesterolLDL) || 100,
        CholesterolHDL: parseFloat(formData.CholesterolHDL) || 50,
        CholesterolTriglycerides: parseFloat(formData.CholesterolTriglycerides) || 150,
        Smoking: formData.Smoking,
        AlcoholConsumption: parseFloat(formData.AlcoholConsumption) || 0,
        PhysicalActivity: parseFloat(formData.PhysicalActivity) || 5,
        DietQuality: parseFloat(formData.DietQuality) || 5,
        SleepQuality: parseFloat(formData.SleepQuality) || 7,
        FrequentUrination: formData.FrequentUrination,
        ExcessiveThirst: formData.ExcessiveThirst,
        UnexplainedWeightLoss: formData.UnexplainedWeightLoss,
        FatigueLevels: parseFloat(formData.FatigueLevels) || 5,
        BlurredVision: formData.BlurredVision,
        TinglingHandsFeet: formData.TinglingHandsFeet,
      };

      const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";
      const apiUrl = isDev ? "http://127.0.0.1:8000/api/predict" : "/api/predict";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "Terjadi kesalahan pada server saat memproses prediksi.";
        try {
          const errData = await res.json();
          errorMessage = errData.detail || errorMessage;
        } catch {
          errorMessage = "Gagal menghubungi server API. Pastikan server backend FastAPI berjalan.";
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      sessionStorage.setItem("predictionResult", JSON.stringify({ input: payload, result: data }));
      router.push("/result");
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server API.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 to-white">
      <div className="container mx-auto max-w-4xl px-4 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Skrining Diabetes Komprehensif</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-1">
            Formulir Prediksi Risiko Diabetes
          </h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            28 parameter kesehatan dalam 5 tahap skrining menggunakan standar klinis internasional
          </p>
        </motion.div>

        {/* ─── Progress Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button
                    onClick={() => s.id < step && setStep(s.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shrink-0 ${
                      isActive
                        ? `bg-gradient-to-br ${s.color} text-white shadow-lg`
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-400 w-full" : isActive ? "bg-sky-400 w-1/2" : "w-0"
                          }`}
                          style={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Tahap {step} dari {STEPS.length}</p>
          </div>
        </motion.div>

        {/* ─── Form Card ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-slate-100 shadow-lg">
              <CardHeader className={`bg-gradient-to-r ${currentStep.color} rounded-t-xl`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <StepIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{currentStep.title}</CardTitle>
                    <CardDescription className="text-white/80">{currentStep.subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm flex items-center gap-2">
                    <span className="text-lg">&#x26A0;&#xFE0F;</span> {error}
                  </div>
                )}

                {/* ─── Step 1: Demographics ─── */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Gender */}
                    <div>
                      <Label className="text-slate-700 mb-3 block">Jenis Kelamin</Label>
                      <div className="flex gap-3">
                        {[
                          { value: 0, label: "Perempuan", emoji: "👩" },
                          { value: 1, label: "Laki-laki", emoji: "👨" },
                        ].map((g) => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => handleToggle("Gender", g.value)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                              formData.Gender === g.value
                                ? "border-sky-500 bg-sky-50 text-sky-700 shadow-lg shadow-sky-500/10"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xl">{g.emoji}</span> {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age */}
                    <RangeInput label="Usia" name="Age" value={formData.Age} onChange={handleChange} min={1} max={120} step={1} unit="tahun" hint="Risiko meningkat setelah usia 45 tahun" />

                    {/* Weight & Height for BMI auto-calc */}
                    <div>
                      <Label className="text-slate-700 mb-3 block">Ukuran Tubuh</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Input id="weight" name="weight" type="number" step="0.1" min="20" max="250" placeholder="Berat (kg)" value={formData.weight} onChange={handleChange} className="h-11" />
                          <p className="text-[11px] text-slate-400">Berat badan (kg)</p>
                        </div>
                        <div className="space-y-1">
                          <Input id="height" name="height" type="number" step="1" min="100" max="250" placeholder="Tinggi (cm)" value={formData.height} onChange={handleChange} className="h-11" />
                          <p className="text-[11px] text-slate-400">Tinggi badan (cm)</p>
                        </div>
                      </div>
                      {formData.BMI && (
                        <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-sky-700">BMI Anda:</span>
                            <span className={`text-lg font-bold ${
                              parseFloat(formData.BMI) < 18.5 ? "text-amber-600" :
                              parseFloat(formData.BMI) <= 24.9 ? "text-emerald-600" :
                              parseFloat(formData.BMI) <= 29.9 ? "text-amber-600" : "text-red-600"
                            }`}>
                              {formData.BMI} kg/m&sup2;
                            </span>
                          </div>
                          <p className="text-[11px] text-sky-600 mt-1">
                            {parseFloat(formData.BMI) < 18.5 ? "Berat Badan Kurang" :
                             parseFloat(formData.BMI) <= 24.9 ? "Normal" :
                             parseFloat(formData.BMI) <= 29.9 ? "Overweight" : "Obesitas"}
                            {" "} (Normal: 18.5 - 24.9)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ethnicity */}
                    <div className="space-y-2">
                      <Label htmlFor="Ethnicity" className="text-slate-700">Etnis</Label>
                      <Select id="Ethnicity" name="Ethnicity" value={String(formData.Ethnicity)} onChange={(e) => handleToggle("Ethnicity", parseInt(e.target.value))} className="h-11">
                        <option value="0">Kaukasia</option>
                        <option value="1">Afrika</option>
                        <option value="2">Asia</option>
                        <option value="3">Lainnya</option>
                      </Select>
                      <p className="text-[11px] text-slate-400">Beberapa kelompok etnis memiliki risiko diabetes lebih tinggi</p>
                    </div>
                  </div>
                )}

                {/* ─── Step 2: Medical History ─── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                      <Info className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-rose-700">
                        Riwayat keluarga dan kondisi medis sebelumnya sangat penting dalam menentukan risiko diabetes Anda.
                      </p>
                    </div>

                    <ToggleButton label="Riwayat diabetes dalam keluarga?" value={formData.FamilyHistoryDiabetes} onChange={(v) => handleToggle("FamilyHistoryDiabetes", v)} description="Orang tua, saudara kandung, kakek/nenek" />
                    <ToggleButton label="Pernah didiagnosa pre-diabetes?" value={formData.PreviousPreDiabetes} onChange={(v) => handleToggle("PreviousPreDiabetes", v)} description="Kadar gula darah tinggi tapi belum diabetes" />
                    <ToggleButton label="Riwayat diabetes saat kehamilan (gestasional)?" value={formData.GestationalDiabetes} onChange={(v) => handleToggle("GestationalDiabetes", v)} description="Diabetes yang muncul saat kehamilan" />
                    <ToggleButton label="Riwayat hipertensi (tekanan darah tinggi)?" value={formData.Hypertension} onChange={(v) => handleToggle("Hypertension", v)} description="Tekanan darah > 140/90 mmHg" />
                    <ToggleButton label="Sindrom Ovarium Polikistik (PCOS)?" value={formData.PolycysticOvarySyndrome} onChange={(v) => handleToggle("PolycysticOvarySyndrome", v)} description="Kondisi hormonal pada wanita" />
                  </div>
                )}

                {/* ─── Step 3: Clinical Data ─── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                      <FlaskConical className="h-5 w-5 text-violet-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-violet-700">
                        Data laboratorium memberikan indikator paling akurat. Jika Anda tidak memiliki hasil lab terbaru, Anda bisa mengisi perkiraan atau menggunakan nilai default.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Kadar HbA1c (%)" name="HbA1c" value={formData.HbA1c} onChange={handleChange} min={3} max={15} step={0.1} unit="%" hint="Normal: < 5.7% | Pre-diabetes: 5.7-6.4% | Diabetes: > 6.5%" />
                      <RangeInput label="Gula Darah Puasa" name="FastingBloodSugar" value={formData.FastingBloodSugar} onChange={handleChange} min={50} max={400} step={1} unit="mg/dL" hint="Normal: < 100 | Pre-diabetes: 100-125 | Diabetes: > 126" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Tekanan Sistolik" name="SystolicBP" value={formData.SystolicBP} onChange={handleChange} min={70} max={220} step={1} unit="mmHg" hint="Normal: < 120 mmHg" />
                      <RangeInput label="Tekanan Diastolik" name="DiastolicBP" value={formData.DiastolicBP} onChange={handleChange} min={40} max={140} step={1} unit="mmHg" hint="Normal: < 80 mmHg" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Kolesterol Total" name="CholesterolTotal" value={formData.CholesterolTotal} onChange={handleChange} min={100} max={400} step={1} unit="mg/dL" hint="Normal: < 200 mg/dL" />
                      <RangeInput label="Kolesterol LDL" name="CholesterolLDL" value={formData.CholesterolLDL} onChange={handleChange} min={30} max={250} step={1} unit="mg/dL" hint="Optimal: < 100 mg/dL" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Kolesterol HDL" name="CholesterolHDL" value={formData.CholesterolHDL} onChange={handleChange} min={15} max={120} step={1} unit="mg/dL" hint="Baik: > 40 mg/dL (pria), > 50 mg/dL (wanita)" />
                      <RangeInput label="Trigliserida" name="CholesterolTriglycerides" value={formData.CholesterolTriglycerides} onChange={handleChange} min={30} max={500} step={1} unit="mg/dL" hint="Normal: < 150 mg/dL" />
                    </div>
                  </div>
                )}

                {/* ─── Step 4: Lifestyle ─── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                      <Dumbbell className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-emerald-700">
                        Gaya hidup adalah faktor risiko yang BISA dimodifikasi. Data ini membantu memberikan rekomendasi yang lebih personal.
                      </p>
                    </div>

                    <ToggleButton label="Apakah Anda merokok?" value={formData.Smoking} onChange={(v) => handleToggle("Smoking", v)} description="Termasuk rokok elektrik / vape" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Konsumsi Alkohol" name="AlcoholConsumption" value={formData.AlcoholConsumption} onChange={handleChange} min={0} max={30} step={0.5} unit="unit/minggu" hint="0 = Tidak minum alkohol" />
                      <RangeInput label="Aktivitas Fisik" name="PhysicalActivity" value={formData.PhysicalActivity} onChange={handleChange} min={0} max={20} step={0.5} unit="jam/minggu" hint="Direkomendasikan: > 2.5 jam/minggu" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <RangeInput label="Kualitas Diet" name="DietQuality" value={formData.DietQuality} onChange={handleChange} min={0} max={10} step={1} unit="/10" hint="0 = Sangat buruk, 10 = Sangat baik" />
                      <RangeInput label="Kualitas Tidur" name="SleepQuality" value={formData.SleepQuality} onChange={handleChange} min={1} max={10} step={1} unit="/10" hint="Durasi & kualitas tidur rata-rata" />
                    </div>
                  </div>
                )}

                {/* ─── Step 5: Symptoms ─── */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-700">
                        Perhatikan gejala-gejala berikut. Jika Anda mengalami beberapa gejala secara bersamaan, segera konsultasikan ke dokter.
                      </p>
                    </div>

                    <ToggleButton label="Sering buang air kecil?" value={formData.FrequentUrination} onChange={(v) => handleToggle("FrequentUrination", v)} description="Terutama di malam hari (nokturia)" />
                    <ToggleButton label="Haus berlebihan?" value={formData.ExcessiveThirst} onChange={(v) => handleToggle("ExcessiveThirst", v)} description="Rasa haus yang tidak normal meski sudah minum" />
                    <ToggleButton label="Penurunan berat badan tidak wajar?" value={formData.UnexplainedWeightLoss} onChange={(v) => handleToggle("UnexplainedWeightLoss", v)} description="BB turun tanpa diet atau olahraga" />
                    <ToggleButton label="Penglihatan kabur?" value={formData.BlurredVision} onChange={(v) => handleToggle("BlurredVision", v)} description="Pandangan buram atau berubah-ubah" />
                    <ToggleButton label="Kesemutan di tangan/kaki?" value={formData.TinglingHandsFeet} onChange={(v) => handleToggle("TinglingHandsFeet", v)} description="Mati rasa atau sensasi kesemutan" />

                    <RangeInput label="Tingkat Kelelahan" name="FatigueLevels" value={formData.FatigueLevels} onChange={handleChange} min={0} max={10} step={1} unit="/10" hint="0 = Sangat berenergi, 10 = Sangat kelelahan" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* ─── Navigation Buttons ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-6 gap-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="h-12 px-6 rounded-xl gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`h-12 px-8 rounded-xl gap-2 bg-gradient-to-r ${currentStep.color} hover:opacity-90 text-white shadow-lg`}
            >
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="h-12 px-8 rounded-xl gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/20"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menganalisis Data...</>
              ) : (
                <>Analisis Risiko Diabetes <ArrowRight className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          )}
        </motion.div>

        {/* ─── Info Banner ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3"
        >
          <Info className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
          <p className="text-sm text-sky-700">
            Formulir ini menggunakan <strong>28 parameter medis</strong> dalam <strong>5 tahap skrining</strong> berdasarkan standar klinis internasional (FINDRISC, ADA). Model AI (Gradient Boosting) dilatih dengan dataset komprehensif untuk memberikan prediksi yang akurat.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
