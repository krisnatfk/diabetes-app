"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Activity, ShieldCheck, Clock, ArrowRight, Brain,
  HeartPulse, Stethoscope, TrendingUp, Users, Sparkles
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
  })
};

const stats = [
  { value: "28", label: "Parameter Kesehatan", icon: Users },
  { value: "94%", label: "Akurasi Model", icon: TrendingUp },
  { value: "5", label: "Tahap Skrining", icon: Brain },
  { value: "<1s", label: "Waktu Prediksi", icon: Clock },
];

const features = [
  {
    icon: Activity,
    title: "Akurasi Tinggi",
    desc: "Model Gradient Boosting dilatih dengan data klinis komprehensif mencakup 28 parameter kesehatan untuk memberikan prediksi yang sangat akurat.",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terenkripsi",
    desc: "Data kesehatan Anda tersimpan aman di database Supabase dengan standar keamanan enterprise-grade.",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Sparkles,
    title: "Analisis Komprehensif",
    desc: "Tidak hanya prediksi — kami memberikan visualisasi risiko, analisis indikator kesehatan, dan rekomendasi medis personal.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: HeartPulse,
    title: "Berbasis Evidensi",
    desc: "Seluruh parameter medis yang digunakan berdasarkan jurnal riset diabetes internasional WHO dan ADA Guidelines.",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: Stethoscope,
    title: "Clinical Decision Support",
    desc: "Dirancang sebagai sistem pendukung keputusan klinis yang membantu tenaga medis dalam skrining awal diabetes.",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Clock,
    title: "Real-time & Instan",
    desc: "Dapatkan hasil analisis risiko diabetes dalam hitungan detik — tanpa perlu menunggu hasil laboratorium.",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-50",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.png"
            alt="Health Technology Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 text-sm font-medium text-sky-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Powered by Machine Learning
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Deteksi Dini{" "}
                <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  Risiko Diabetes
                </span>{" "}
                dengan AI
              </h1>

              <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
                Platform Clinical Decision Support System yang menganalisis 28 parameter kesehatan dalam 5 tahap skrining menggunakan algoritma Gradient Boosting untuk memprediksi risiko diabetes secara akurat.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/predict">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/25 h-12 px-8 text-base rounded-xl">
                    Mulai Prediksi <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white/70 text-white hover:bg-white hover:text-sky-700 hover:border-white h-12 px-8 text-base font-semibold rounded-xl transition-all duration-300">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Floating Health Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="glass-card rounded-2xl p-6 shadow-2xl max-w-sm ml-auto animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Analisis Kesehatan</p>
                      <p className="text-xs text-slate-500">Real-time Monitoring</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Glukosa Darah</span>
                      <span className="font-semibold text-emerald-600">Normal</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">HbA1c Level</span>
                      <span className="font-semibold text-amber-600">Perhatian</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">BMI</span>
                      <span className="font-semibold text-sky-600">Baik</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative -mt-16 z-20 container mx-auto max-w-5xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 lg:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-sky-50 text-sky-600 mb-2">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-800">{stat.value}</p>
                <p className="text-xs lg:text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Fitur Utama</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-2">
              Mengapa Memilih <span className="gradient-text">DiabetesAI?</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Platform skrining diabetes berbasis AI paling komprehensif dengan standar internasional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col space-y-4">
                    <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-section-alt">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Cara Kerja</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-2">
              Tiga Langkah Mudah
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Input Data Kesehatan",
                desc: "Isi 28 parameter kesehatan dalam 5 tahap: demografi, riwayat medis, data klinis, gaya hidup, dan gejala.",
                icon: "📝",
              },
              {
                step: "02",
                title: "Analisis AI",
                desc: "Model Gradient Boosting (94% akurasi) memproses data Anda dan menghitung probabilitas risiko diabetes dalam hitungan detik.",
                icon: "🤖",
              },
              {
                step: "03",
                title: "Hasil & Rekomendasi",
                desc: "Dapatkan analisis komprehensif mencakup skor risiko, visualisasi indikator, dan rekomendasi tindakan medis.",
                icon: "📊",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Langkah {item.step}
                </div>
                <div className="text-4xl mt-4 mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                Siap Mengetahui Risiko Diabetes Anda?
              </h2>
              <p className="text-sky-100 max-w-xl mx-auto mb-8 text-lg">
                Lakukan skrining kesehatan gratis sekarang dan dapatkan analisis risiko diabetes secara instan.
              </p>
              <Link href="/predict">
                <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50 h-14 px-10 text-lg font-semibold rounded-xl shadow-lg">
                  Mulai Skrining Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
