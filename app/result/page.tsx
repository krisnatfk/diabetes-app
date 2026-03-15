"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  RadialBarChart, RadialBar, Legend
} from "recharts";
import {
  AlertTriangle, CheckCircle, ArrowLeft, Activity,
  Heart, Droplets, Scale, Cigarette, HeartPulse,
  ClipboardList, Stethoscope, TrendingUp, Info
} from "lucide-react";

// Reference ranges for health indicators
const healthRanges = {
  bmi: { low: 18.5, normal: 24.9, high: 29.9, label: "BMI" },
  HbA1c_level: { low: 4.0, normal: 5.6, high: 6.4, label: "HbA1c (%)" },
  blood_glucose_level: { low: 70, normal: 99, high: 125, label: "Glukosa (mg/dL)" },
};

function getIndicatorStatus(key: string, value: number) {
  const range = healthRanges[key as keyof typeof healthRanges];
  if (!range) return { status: "unknown", color: "slate", label: "Tidak Diketahui" };
  if (value <= range.normal) return { status: "normal", color: "emerald", label: "Normal" };
  if (value <= range.high) return { status: "warning", color: "amber", label: "Perhatian" };
  return { status: "danger", color: "red", label: "Tinggi" };
}

function getBarWidth(key: string, value: number) {
  const maxValues: Record<string, number> = { bmi: 50, HbA1c_level: 14, blood_glucose_level: 300 };
  const max = maxValues[key] || 100;
  return Math.min((value / max) * 100, 100);
}

export default function ResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("predictionResult");
    if (!data) {
      router.push("/predict");
    } else {
      setResultData(JSON.parse(data));
    }
  }, [router]);

  if (!resultData) return null;

  const { input, result } = resultData;
  const probability = result.probability * 100;
  const isHighRisk = result.prediction === "Diabetes";

  // Chart data
  const riskChartData = [
    { name: "Risiko", value: probability },
    { name: "Aman", value: 100 - probability },
  ];

  const riskColors = isHighRisk ? ["#ef4444", "#f1f5f9"] : ["#10b981", "#f1f5f9"];

  const indicatorsBarData = [
    { name: "BMI", value: input.bmi, fill: getIndicatorStatus("bmi", input.bmi).color === "emerald" ? "#10b981" : getIndicatorStatus("bmi", input.bmi).color === "amber" ? "#f59e0b" : "#ef4444" },
    { name: "HbA1c", value: input.HbA1c_level, fill: getIndicatorStatus("HbA1c_level", input.HbA1c_level).color === "emerald" ? "#10b981" : getIndicatorStatus("HbA1c_level", input.HbA1c_level).color === "amber" ? "#f59e0b" : "#ef4444" },
    { name: "Glukosa", value: input.blood_glucose_level / 3, fill: getIndicatorStatus("blood_glucose_level", input.blood_glucose_level).color === "emerald" ? "#10b981" : getIndicatorStatus("blood_glucose_level", input.blood_glucose_level).color === "amber" ? "#f59e0b" : "#ef4444" },
  ];

  const radialData = [
    { name: "Skor Risiko", value: probability, fill: isHighRisk ? "#ef4444" : "#10b981" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Hasil Analisis</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-1">
            Laporan Prediksi Risiko Diabetes
          </h1>
        </motion.div>

        {/* ─── RISK ALERT BANNER ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 mb-8 shadow-lg ${
            isHighRisk
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
          }`}
        >
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${
            isHighRisk ? "bg-white/20" : "bg-white/20"
          }`}>
            {isHighRisk ? <AlertTriangle className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {isHighRisk ? "⚠️ Risiko Tinggi Terindikasi Diabetes" : "✅ Risiko Rendah — Tidak Terindikasi Diabetes"}
            </h2>
            <p className="text-white/80 mt-1">
              {isHighRisk
                ? "Berdasarkan analisis 8 parameter kesehatan Anda, sistem mendeteksi pola yang konsisten dengan indikasi diabetes. Segera konsultasikan ke dokter."
                : "Profil kesehatan Anda saat ini menunjukkan risiko rendah terhadap diabetes. Tetap jaga pola hidup sehat."}
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-5xl font-extrabold">{probability.toFixed(0)}%</div>
            <div className="text-sm text-white/70">Probabilitas</div>
          </div>
        </motion.div>

        {/* ─── CHARTS ROW ─── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Donut Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-sky-500" /> Distribusi Risiko
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" startAngle={90} endAngle={-270}>
                        {riskChartData.map((_, index) => <Cell key={index} fill={riskColors[index]} />)}
                      </Pie>
                      <RechartsTooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${isHighRisk ? "bg-red-500" : "bg-emerald-500"}`} /> Risiko</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Aman</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radial Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sky-500" /> Skor Risiko
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={18} data={radialData} startAngle={180} endAngle={-180}>
                      <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#f1f5f9" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center -mt-4">
                  <span className={`text-3xl font-extrabold ${isHighRisk ? "text-red-500" : "text-emerald-500"}`}>
                    {probability.toFixed(1)}%
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Confidence Score</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart - Indicators */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-sky-500" /> Indikator Utama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={indicatorsBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                      <RechartsTooltip />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                        {indicatorsBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── HEALTH INDICATOR DETAIL ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="mb-8 border-slate-100 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-sky-500" /> Detail Indikator Kesehatan Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: "bmi", icon: Scale, label: "Indeks Massa Tubuh (BMI)", value: input.bmi, unit: "kg/m²", ref: "Normal: 18.5 – 24.9" },
                  { key: "HbA1c_level", icon: Droplets, label: "Kadar HbA1c", value: input.HbA1c_level, unit: "%", ref: "Normal: < 5.7%" },
                  { key: "blood_glucose_level", icon: Activity, label: "Glukosa Darah", value: input.blood_glucose_level, unit: "mg/dL", ref: "Normal: 70 – 99 mg/dL" },
                  { key: "age", icon: Heart, label: "Usia Pasien", value: input.age, unit: "Tahun", ref: "Risiko meningkat > 45 tahun" },
                ].map((item) => {
                  const status = item.key !== "age" ? getIndicatorStatus(item.key, item.value) : (input.age > 45 ? { color: "amber", label: "Lanjut Usia" } : { color: "emerald", label: "Muda" });
                  const colorMap: Record<string, string> = {
                    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    amber: "bg-amber-50 text-amber-700 border-amber-200",
                    red: "bg-red-50 text-red-700 border-red-200",
                  };

                  return (
                    <div key={item.key} className="rounded-xl border border-slate-100 p-4 hover:shadow-sm transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-sky-500" />
                          <span className="text-xs font-medium text-slate-500">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorMap[status.color] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-800">
                        {item.value} <span className="text-sm font-normal text-slate-400">{item.unit}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.ref}</p>
                      {item.key !== "age" && (
                        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              status.color === "emerald" ? "bg-emerald-400" : status.color === "amber" ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${getBarWidth(item.key, item.value)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── PATIENT SUMMARY & RECOMMENDATIONS ─── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Patient Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-sky-500" /> Ringkasan Data Pasien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { label: "Jenis Kelamin", value: input.gender === "Male" ? "Laki-laki" : input.gender === "Female" ? "Perempuan" : "Lainnya" },
                        { label: "Usia", value: `${input.age} Tahun` },
                        { label: "Riwayat Hipertensi", value: input.hypertension === 1 ? "Ya" : "Tidak" },
                        { label: "Riwayat Penyakit Jantung", value: input.heart_disease === 1 ? "Ya" : "Tidak" },
                        { label: "Riwayat Merokok", value: { never: "Tidak Pernah", current: "Aktif", former: "Mantan Perokok", ever: "Pernah", "not current": "Tidak Saat Ini", "No Info": "Tidak Ada Info" }[input.smoking_history] || input.smoking_history },
                        { label: "Indeks Massa Tubuh", value: `${input.bmi} kg/m²` },
                        { label: "Kadar HbA1c", value: `${input.HbA1c_level}%` },
                        { label: "Glukosa Darah", value: `${input.blood_glucose_level} mg/dL` },
                      ].map((row) => (
                        <tr key={row.label}>
                          <td className="py-2.5 text-slate-500 font-medium">{row.label}</td>
                          <td className="py-2.5 text-right font-semibold text-slate-800">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-sky-500" /> Rekomendasi Medis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isHighRisk ? (
                    <>
                      <RecommendationItem icon="🏥" title="Konsultasi Dokter" desc="Segera jadwalkan konsultasi dengan dokter spesialis endokrinologi untuk pemeriksaan lebih lanjut dan validasi diagnosis klinis." priority="urgent" />
                      <RecommendationItem icon="🩸" title="Monitoring Glukosa" desc="Lakukan pemeriksaan glukosa darah puasa dan tes OGTT secara berkala untuk memantau perkembangan kondisi." priority="urgent" />
                      <RecommendationItem icon="🥗" title="Diet Rendah Gula" desc="Kurangi konsumsi karbohidrat sederhana dan gula. Prioritaskan sayuran, protein tanpa lemak, dan biji-bijian utuh." priority="high" />
                      <RecommendationItem icon="🏃" title="Aktivitas Fisik" desc="Lakukan minimal 150 menit olahraga aerobik per minggu (jalan cepat, berenang, bersepeda)." priority="high" />
                      <RecommendationItem icon="⚖️" title="Kontrol Berat Badan" desc="Targetkan penurunan berat badan 5-7% untuk mengurangi risiko diabetes secara signifikan." priority="medium" />
                    </>
                  ) : (
                    <>
                      <RecommendationItem icon="✅" title="Pertahankan Gaya Hidup" desc="Profil kesehatan Anda baik. Pertahankan pola makan seimbang dan olahraga teratur." priority="low" />
                      <RecommendationItem icon="📅" title="Pemeriksaan Berkala" desc="Lakukan pemeriksaan kesehatan komprehensif (medical check-up) setidaknya sekali dalam setahun." priority="medium" />
                      <RecommendationItem icon="⚖️" title="Jaga BMI Ideal" desc="Pertahankan BMI antara 18.5 – 24.9 kg/m² dengan diet seimbang dan olahraga teratur." priority="low" />
                      <RecommendationItem icon="🧬" title="Faktor Genetik" desc="Jika ada riwayat diabetes dalam keluarga, lakukan skrining lebih sering setelah usia 35 tahun." priority="medium" />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── DISCLAIMER ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 flex items-start gap-3 mb-8">
            <Info className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-sky-800">Peringatan Medis (Disclaimer)</p>
              <p className="text-xs text-sky-700 mt-1">
                Hasil ini dihasilkan oleh model Machine Learning (Clinical Decision Support System) dan BUKAN merupakan diagnosis medis pasti. Sistem ini hanya alat bantu skrining preventif. Selalu konsultasikan hasil yang mengkhawatirkan dengan tenaga kesehatan profesional.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── ACTION BUTTONS ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row justify-center gap-3"
        >
          <Button onClick={() => router.push("/predict")} variant="outline" className="gap-2 h-12 px-6 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Prediksi Ulang
          </Button>
          <Button onClick={() => router.push("/history")} className="gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white">
            <ClipboardList className="h-4 w-4" /> Lihat Riwayat
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Recommendation Item Component ───
function RecommendationItem({ icon, title, desc, priority }: { icon: string; title: string; desc: string; priority: string }) {
  const borderColors: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-amber-500",
    medium: "border-l-sky-500",
    low: "border-l-emerald-500",
  };
  return (
    <div className={`border-l-4 ${borderColors[priority]} bg-slate-50 rounded-r-lg p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed pl-7">{desc}</p>
    </div>
  );
}
