"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  AlertTriangle, CheckCircle, ArrowLeft, Activity,
  Heart, Droplets, Scale, HeartPulse,
  ClipboardList, Stethoscope, TrendingUp, Info,
  Dna, FlaskConical, Dumbbell, AlertCircle, User, Shield
} from "lucide-react";

// ─── Risk level colors & labels ─────────────────────────────────
const RISK_COLORS: Record<string, { bg: string; text: string; border: string; fill: string }> = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", fill: "#ef4444" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", fill: "#f59e0b" },
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", fill: "#10b981" },
};

const RISK_LABELS: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

const CATEGORY_ICONS: Record<string, any> = {
  genetic: Dna,
  clinical: FlaskConical,
  lifestyle: Dumbbell,
  symptoms: AlertCircle,
  demographic: User,
};

// ─── Health indicator helpers ───────────────────────────────────
function getIndicatorStatus(key: string, value: number) {
  const ranges: Record<string, { normal: number; high: number }> = {
    BMI: { normal: 24.9, high: 29.9 },
    HbA1c: { normal: 5.6, high: 6.4 },
    FastingBloodSugar: { normal: 99, high: 125 },
    SystolicBP: { normal: 120, high: 140 },
    DiastolicBP: { normal: 80, high: 90 },
    CholesterolTotal: { normal: 200, high: 239 },
    CholesterolLDL: { normal: 100, high: 160 },
    CholesterolHDL: { normal: 60, high: 100 },
    CholesterolTriglycerides: { normal: 150, high: 200 },
  };
  const range = ranges[key];
  if (!range) return { color: "emerald", label: "N/A" };
  // HDL is special: higher is better
  if (key === "CholesterolHDL") {
    if (value >= 60) return { color: "emerald", label: "Baik" };
    if (value >= 40) return { color: "amber", label: "Perhatian" };
    return { color: "red", label: "Rendah" };
  }
  if (value <= range.normal) return { color: "emerald", label: "Normal" };
  if (value <= range.high) return { color: "amber", label: "Perhatian" };
  return { color: "red", label: "Tinggi" };
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
  const riskFactors = result.risk_factors || {};

  // Chart data
  const riskChartData = [
    { name: "Risiko", value: probability },
    { name: "Aman", value: 100 - probability },
  ];
  const riskColors = isHighRisk ? ["#ef4444", "#f1f5f9"] : ["#10b981", "#f1f5f9"];

  // Radar chart data for risk categories
  const radarData = Object.entries(riskFactors).map(([key, val]: [string, any]) => ({
    category: val.label.replace("Risiko ", ""),
    score: val.score,
    fullMark: 100,
  }));

  const radialData = [
    { name: "Skor Risiko", value: probability, fill: isHighRisk ? "#ef4444" : "#10b981" },
  ];

  // Clinical indicators to display
  const clinicalIndicators = [
    { key: "BMI", label: "BMI", value: input.BMI, unit: "kg/m\u00B2", ref: "Normal: 18.5 - 24.9", icon: Scale },
    { key: "HbA1c", label: "HbA1c", value: input.HbA1c, unit: "%", ref: "Normal: < 5.7%", icon: Droplets },
    { key: "FastingBloodSugar", label: "Gula Darah Puasa", value: input.FastingBloodSugar, unit: "mg/dL", ref: "Normal: < 100", icon: Activity },
    { key: "SystolicBP", label: "Tek. Sistolik", value: input.SystolicBP, unit: "mmHg", ref: "Normal: < 120", icon: HeartPulse },
    { key: "CholesterolTotal", label: "Kolesterol Total", value: input.CholesterolTotal, unit: "mg/dL", ref: "Normal: < 200", icon: Heart },
    { key: "CholesterolTriglycerides", label: "Trigliserida", value: input.CholesterolTriglycerides, unit: "mg/dL", ref: "Normal: < 150", icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Hasil Analisis Komprehensif</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-1">
            Laporan Prediksi Risiko Diabetes
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Berdasarkan 28 parameter kesehatan dalam 5 kategori</p>
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
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-white/20 shrink-0">
            {isHighRisk ? <AlertTriangle className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">
              {isHighRisk ? "Risiko Tinggi Terindikasi Diabetes" : "Risiko Rendah - Tidak Terindikasi Diabetes"}
            </h2>
            <p className="text-white/80 mt-1">
              {isHighRisk
                ? "Berdasarkan analisis 28 parameter kesehatan Anda, sistem mendeteksi pola yang konsisten dengan indikasi diabetes. Segera konsultasikan ke dokter."
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

          {/* Radar Chart - Risk Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full border-slate-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-sky-500" /> Profil Risiko Multi-Dimensi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Skor" dataKey="score" stroke={isHighRisk ? "#ef4444" : "#10b981"} fill={isHighRisk ? "#ef4444" : "#10b981"} fillOpacity={0.3} strokeWidth={2} />
                      <RechartsTooltip formatter={(v: any) => `${v}/100`} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radial Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
        </div>

        {/* ─── RISK FACTOR CATEGORIES ─── */}
        {Object.keys(riskFactors).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="mb-8 border-slate-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Dna className="h-5 w-5 text-sky-500" /> Analisis Risiko Per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(riskFactors).map(([key, val]: [string, any]) => {
                    const Icon = CATEGORY_ICONS[key] || Shield;
                    const colors = RISK_COLORS[val.level] || RISK_COLORS.low;
                    return (
                      <div key={key} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${colors.text}`} />
                            <span className="text-sm font-semibold text-slate-700">{val.label}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {RISK_LABELS[val.level]}
                          </span>
                        </div>
                        <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${val.score}%`, backgroundColor: colors.fill }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 text-right">{val.score}/100</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── CLINICAL INDICATORS ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="mb-8 border-slate-100 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-sky-500" /> Detail Indikator Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clinicalIndicators.map((item) => {
                  const status = getIndicatorStatus(item.key, item.value);
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
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
                        { label: "Jenis Kelamin", value: input.Gender === 1 ? "Laki-laki" : "Perempuan" },
                        { label: "Usia", value: `${input.Age} Tahun` },
                        { label: "BMI", value: `${input.BMI} kg/m\u00B2` },
                        { label: "Riwayat Diabetes Keluarga", value: input.FamilyHistoryDiabetes === 1 ? "Ya" : "Tidak" },
                        { label: "Hipertensi", value: input.Hypertension === 1 ? "Ya" : "Tidak" },
                        { label: "HbA1c", value: `${input.HbA1c}%` },
                        { label: "Gula Darah Puasa", value: `${input.FastingBloodSugar} mg/dL` },
                        { label: "Tekanan Darah", value: `${input.SystolicBP}/${input.DiastolicBP} mmHg` },
                        { label: "Kolesterol Total", value: `${input.CholesterolTotal} mg/dL` },
                        { label: "Merokok", value: input.Smoking === 1 ? "Ya" : "Tidak" },
                        { label: "Aktivitas Fisik", value: `${input.PhysicalActivity} jam/minggu` },
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
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
                      <RecommendationItem icon="&#x1F3E5;" title="Konsultasi Dokter Segera" desc="Jadwalkan konsultasi dengan dokter spesialis endokrinologi untuk pemeriksaan lanjutan dan validasi diagnosis klinis." priority="urgent" />
                      <RecommendationItem icon="&#x1FA78;" title="Tes Lanjutan" desc="Lakukan OGTT (Oral Glucose Tolerance Test), tes insulin, dan pemeriksaan fungsi ginjal." priority="urgent" />
                      {input.FamilyHistoryDiabetes === 1 && (
                        <RecommendationItem icon="&#x1F9EC;" title="Konseling Genetik" desc="Dengan riwayat diabetes keluarga, pertimbangkan konseling genetik dan skrining keluarga lainnya." priority="high" />
                      )}
                      <RecommendationItem icon="&#x1F957;" title="Diet Rendah Gula" desc="Kurangi karbohidrat sederhana. Prioritaskan sayuran, protein tanpa lemak, dan biji-bijian utuh." priority="high" />
                      <RecommendationItem icon="&#x1F3C3;" title="Tingkatkan Aktivitas Fisik" desc="Lakukan minimal 150 menit olahraga aerobik per minggu." priority="high" />
                      {input.BMI >= 25 && (
                        <RecommendationItem icon="&#x2696;&#xFE0F;" title="Kontrol Berat Badan" desc={`BMI Anda ${input.BMI} (${input.BMI >= 30 ? "Obesitas" : "Overweight"}). Targetkan penurunan 5-7% BB.`} priority="medium" />
                      )}
                    </>
                  ) : (
                    <>
                      <RecommendationItem icon="&#x2705;" title="Pertahankan Gaya Hidup" desc="Profil kesehatan Anda baik. Pertahankan pola makan seimbang dan olahraga teratur." priority="low" />
                      <RecommendationItem icon="&#x1F4C5;" title="Pemeriksaan Berkala" desc="Lakukan medical check-up komprehensif setidaknya sekali dalam setahun." priority="medium" />
                      {input.FamilyHistoryDiabetes === 1 && (
                        <RecommendationItem icon="&#x1F9EC;" title="Perhatikan Faktor Genetik" desc="Dengan riwayat diabetes keluarga, lakukan skrining lebih sering setelah usia 35 tahun." priority="medium" />
                      )}
                      <RecommendationItem icon="&#x2696;&#xFE0F;" title="Jaga BMI Ideal" desc="Pertahankan BMI antara 18.5 - 24.9 kg/m&sup2;." priority="low" />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── DISCLAIMER ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 flex items-start gap-3 mb-8">
            <Info className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-sky-800">Peringatan Medis (Disclaimer)</p>
              <p className="text-xs text-sky-700 mt-1">
                Hasil ini dihasilkan oleh model Machine Learning (Gradient Boosting, akurasi 94.2%) dan BUKAN merupakan diagnosis medis pasti.
                Sistem ini menggunakan 28 parameter kesehatan berdasarkan standar klinis internasional sebagai alat bantu skrining preventif.
                Selalu konsultasikan hasil yang mengkhawatirkan dengan tenaga kesehatan profesional.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── ACTION BUTTONS ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
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
        <span className="text-lg" dangerouslySetInnerHTML={{ __html: icon }} />
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed pl-7" dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  );
}
