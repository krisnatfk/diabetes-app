"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, Activity, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Use direct URL in local dev, relative path in Vercel production
        const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";
        const apiUrl = isDev ? "http://127.0.0.1:8000/api/history" : "/api/history";
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Gagal mengambil data dari server.");
        const data = await res.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.prediction?.toLowerCase().includes(search) ||
      item.gender?.toLowerCase().includes(search) ||
      String(item.age).includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Database</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-1 flex items-center justify-center gap-3">
            <Clock className="h-8 w-8 text-sky-500" /> Riwayat Prediksi
          </h1>
          <p className="text-slate-500 mt-2">Seluruh riwayat prediksi yang tersimpan di database Supabase.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-sky-500" /> {filteredHistory.length} Data Prediksi
                </CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Cari riwayat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-4" />
                  <p className="text-slate-500 text-sm">Memuat data riwayat...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-red-600 font-medium">{error}</p>
                  <p className="text-sm text-slate-400 mt-1">Pastikan server backend FastAPI sudah berjalan.</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="text-slate-600 font-medium">Belum ada riwayat prediksi.</p>
                  <p className="text-sm text-slate-400 mt-1">Data prediksi akan muncul di sini setelah Anda melakukan skrining.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                        <th className="px-5 py-3 text-left font-semibold">Waktu</th>
                        <th className="px-5 py-3 text-left font-semibold">Gender</th>
                        <th className="px-5 py-3 text-left font-semibold">Usia</th>
                        <th className="px-5 py-3 text-left font-semibold">BMI</th>
                        <th className="px-5 py-3 text-left font-semibold">HbA1c</th>
                        <th className="px-5 py-3 text-left font-semibold">Glukosa</th>
                        <th className="px-5 py-3 text-left font-semibold">Risiko</th>
                        <th className="px-5 py-3 text-left font-semibold">Hasil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredHistory.map((item, index) => (
                        <motion.tr
                          key={item.id || index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-sky-50/30 transition-colors"
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                            {new Date(item.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">{item.gender}</td>
                          <td className="px-5 py-3.5 text-slate-700 font-medium">{item.age}</td>
                          <td className="px-5 py-3.5 text-slate-700">{item.bmi}</td>
                          <td className="px-5 py-3.5 text-slate-700">{item.HbA1c_level}</td>
                          <td className="px-5 py-3.5 text-slate-700">{item.blood_glucose_level}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${item.prediction === "Diabetes" ? "bg-red-400" : "bg-emerald-400"}`} />
                              <span className="font-semibold text-slate-700">{item.probability ? (item.probability * 100).toFixed(0) : "0"}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.prediction === "Diabetes"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {item.prediction === "Diabetes" ? "Diabetes" : "Normal"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
