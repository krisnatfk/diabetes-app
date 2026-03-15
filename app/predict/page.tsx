"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2, Stethoscope, Info, ArrowRight } from "lucide-react";

export default function PredictPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    gender: "Female",
    age: "",
    hypertension: "0",
    heart_disease: "0",
    smoking_history: "never",
    bmi: "",
    HbA1c_level: "",
    blood_glucose_level: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        gender: formData.gender,
        age: parseFloat(formData.age),
        hypertension: parseInt(formData.hypertension),
        heart_disease: parseInt(formData.heart_disease),
        smoking_history: formData.smoking_history,
        bmi: parseFloat(formData.bmi),
        HbA1c_level: parseFloat(formData.HbA1c_level),
        blood_glucose_level: parseFloat(formData.blood_glucose_level)
      };

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Terjadi kesalahan saat memproses prediksi.");
      }

      const data = await res.json();
      sessionStorage.setItem("predictionResult", JSON.stringify({ input: payload, result: data }));
      router.push("/result");
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server API. Pastikan FastAPI berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 to-white">
      <div className="container mx-auto max-w-4xl px-4 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Skrining Diabetes</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-1">
            Formulir Prediksi Risiko Diabetes
          </h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Masukkan 8 parameter kesehatan Anda secara akurat. Model AI akan menganalisis data dan memberikan hasil prediksi dalam hitungan detik.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3 mb-6"
        >
          <Info className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
          <p className="text-sm text-sky-700">
            Formulir ini menggunakan 8 parameter medis yang lazim digunakan dalam riset prediktif diabetes. Data Anda akan diproses secara langsung oleh model Machine Learning dan tidak disimpan secara lokal.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-t-xl border-b border-sky-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800">Data Kesehatan Pasien</CardTitle>
                  <CardDescription className="text-slate-500">Semua field wajib diisi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Demographics */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Data Demografis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-slate-700">Jenis Kelamin</Label>
                      <Select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="h-11">
                        <option value="Female">Perempuan</option>
                        <option value="Male">Laki-laki</option>
                        <option value="Other">Lainnya</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-slate-700">Usia (Tahun)</Label>
                      <Input id="age" name="age" type="number" step="1" min="0" max="120" placeholder="Contoh: 45" value={formData.age} onChange={handleChange} required className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Riwayat Medis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="hypertension" className="text-slate-700">Riwayat Hipertensi</Label>
                      <Select id="hypertension" name="hypertension" value={formData.hypertension} onChange={handleChange} required className="h-11">
                        <option value="0">Tidak Pernah</option>
                        <option value="1">Pernah / Sedang</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heart_disease" className="text-slate-700">Penyakit Jantung</Label>
                      <Select id="heart_disease" name="heart_disease" value={formData.heart_disease} onChange={handleChange} required className="h-11">
                        <option value="0">Tidak Pernah</option>
                        <option value="1">Pernah / Sedang</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smoking_history" className="text-slate-700">Riwayat Merokok</Label>
                      <Select id="smoking_history" name="smoking_history" value={formData.smoking_history} onChange={handleChange} required className="h-11">
                        <option value="never">Tidak Pernah</option>
                        <option value="No Info">Tidak Ada Info</option>
                        <option value="current">Saat Ini Aktif</option>
                        <option value="former">Mantan Perokok</option>
                        <option value="ever">Pernah</option>
                        <option value="not current">Tidak Saat Ini</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Clinical Data */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Data Klinis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="bmi" className="text-slate-700">BMI (kg/m²)</Label>
                      <Input id="bmi" name="bmi" type="number" step="0.1" min="10" placeholder="Contoh: 28.3" value={formData.bmi} onChange={handleChange} required className="h-11" />
                      <p className="text-[11px] text-slate-400">Normal: 18.5 – 24.9</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="HbA1c_level" className="text-slate-700">Kadar HbA1c (%)</Label>
                      <Input id="HbA1c_level" name="HbA1c_level" type="number" step="0.1" min="3" placeholder="Contoh: 6.2" value={formData.HbA1c_level} onChange={handleChange} required className="h-11" />
                      <p className="text-[11px] text-slate-400">Normal: &lt; 5.7%</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood_glucose_level" className="text-slate-700">Glukosa Darah (mg/dL)</Label>
                      <Input id="blood_glucose_level" name="blood_glucose_level" type="number" step="1" min="50" placeholder="Contoh: 140" value={formData.blood_glucose_level} onChange={handleChange} required className="h-11" />
                      <p className="text-[11px] text-slate-400">Normal: 70 – 99 mg/dL</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-13 text-base font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/20" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menganalisis Data...</>
                  ) : (
                    <>Analisis Risiko Diabetes <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
