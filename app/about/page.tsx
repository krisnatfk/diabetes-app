"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Heart, Activity, Droplets, Scale, Cigarette, Brain } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const riskFactors = [
  { icon: Scale, title: "Obesitas (BMI Tinggi)", desc: "Kelebihan berat badan menurunkan sensitivitas insulin dan menjadi faktor risiko utama diabetes tipe 2.", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Droplets, title: "HbA1c Tinggi", desc: "Kadar HbA1c > 6.5% menunjukkan rata-rata glukosa darah tinggi selama 2-3 bulan terakhir — indikator kuat diabetes.", color: "text-red-500", bg: "bg-red-50" },
  { icon: Activity, title: "Glukosa Darah Tinggi", desc: "Kadar glukosa puasa > 126 mg/dL atau sewaktu > 200 mg/dL merupakan kriteria diagnosis diabetes menurut WHO.", color: "text-sky-500", bg: "bg-sky-50" },
  { icon: Heart, title: "Hipertensi", desc: "Tekanan darah tinggi sering menjadi komorbiditas diabetes dan meningkatkan risiko komplikasi kardiovaskular.", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Cigarette, title: "Kebiasaan Merokok", desc: "Merokok meningkatkan risiko diabetes tipe 2 sebesar 30-40% dan memperburuk resistensi insulin.", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Brain, title: "Faktor Usia", desc: "Risiko diabetes meningkat signifikan setelah usia 45 tahun seiring penurunan fungsi metabolisme tubuh.", color: "text-violet-500", bg: "bg-violet-50" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-800" />
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/health-analytics.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-white space-y-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-sky-200">Edukasi Kesehatan</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Memahami Penyakit <span className="text-cyan-300">Diabetes Mellitus</span>
              </h1>
              <p className="text-lg text-sky-100 leading-relaxed max-w-lg">
                Diabetes adalah penyakit metabolik kronis yang ditandai dengan kadar glukosa darah tinggi. Deteksi dini dan pengelolaan yang tepat dapat mencegah komplikasi serius.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                <Image src="/images/diabetes-education.png" alt="Edukasi Diabetes" fill className="object-contain drop-shadow-2xl animate-float" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Diabetes */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Pengenalan</span>
              <h2 className="text-3xl font-extrabold text-slate-800 mt-2 mb-6">Apa itu Diabetes?</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-slate-800">Diabetes Mellitus</strong> adalah penyakit kronis yang terjadi ketika pankreas tidak menghasilkan cukup insulin, atau ketika tubuh tidak dapat secara efektif menggunakan insulin yang dihasilkannya. Akibatnya, terjadi peningkatan konsentrasi glukosa dalam darah (hiperglikemia).
                </p>
                <p>
                  Menurut data <strong className="text-slate-800">World Health Organization (WHO)</strong>, jumlah penderita diabetes di dunia meningkat dari 108 juta pada tahun 1980 menjadi lebih dari 422 juta pada tahun 2014, dan terus meningkat setiap tahunnya.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[
                { value: "422M+", label: "Penderita Diabetes Global", color: "from-sky-500 to-blue-600" },
                { value: "1.5M", label: "Kematian per Tahun", color: "from-red-500 to-rose-600" },
                { value: "Tipe 2", label: "Paling Umum (90%)", color: "from-amber-500 to-orange-600" },
                { value: "50%", label: "Tidak Terdiagnosis", color: "from-violet-500 to-purple-600" },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-xl bg-white border border-slate-100 p-5 text-center shadow-sm hover:shadow-md transition"
                >
                  <p className={`text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Types of Diabetes */}
      <section className="py-16 lg:py-20 bg-section-alt">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Klasifikasi</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Tipe Utama Diabetes</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { type: "Tipe 1", emoji: "🧬", desc: "Kondisi autoimun dimana sistem kekebalan tubuh menyerang sel beta pankreas. Membutuhkan injeksi insulin harian seumur hidup. Biasanya didiagnosis pada anak-anak dan remaja.", percent: "5-10%" },
              { type: "Tipe 2", emoji: "⚖️", desc: "Jenis paling umum (90% kasus). Tubuh menjadi resisten terhadap insulin. Sangat terkait dengan obesitas, pola makan buruk, dan kurangnya aktivitas fisik. Dapat dicegah.", percent: "90-95%" },
              { type: "Gestasional", emoji: "🤰", desc: "Diabetes yang berkembang selama kehamilan dan biasanya hilang setelah melahirkan. Namun meningkatkan risiko diabetes tipe 2 di kemudian hari bagi ibu dan anak.", percent: "2-10%" },
            ].map((item, i) => (
              <motion.div key={item.type} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6 text-center space-y-4">
                    <div className="text-5xl mb-2">{item.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Diabetes {item.type}</h3>
                      <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">{item.percent} dari total kasus</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-sm font-semibold text-sky-600 uppercase tracking-wider">Parameter CDSS</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Faktor Risiko yang Dianalisis</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Sistem DiabetesAI menganalisis 8 parameter kesehatan berikut berdasarkan dataset 100.000+ rekam medis.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {riskFactors.map((rf, i) => (
              <motion.div key={rf.title} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="rounded-xl border border-slate-100 p-5 hover:shadow-md transition bg-white h-full">
                  <div className="flex items-start gap-4">
                    <div className={`${rf.bg} p-2.5 rounded-xl shrink-0`}>
                      <rf.icon className={`h-5 w-5 ${rf.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">{rf.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{rf.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="py-16 lg:py-20 bg-section-alt">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-8 flex items-start gap-4 mb-10"
          >
            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 text-lg">Peringatan Medis (Disclaimer)</h3>
              <p className="text-sm text-amber-700 mt-2 leading-relaxed">
                Sistem Prediksi DiabetesAI merupakan <strong>Clinical Decision Support System (CDSS)</strong> yang HANYA berfungsi sebagai alat bantu skrining preventif. Hasil prediksi ini BUKAN merupakan diagnosis medis dan TIDAK dapat menggantikan pemeriksaan klinis oleh dokter atau tenaga kesehatan profesional. Selalu konsultasikan hasil yang mengkhawatirkan kepada dokter spesialis.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Ingin Mengetahui Risiko Anda?</h2>
            <p className="text-slate-500 mb-6">Lakukan skrining diabetes gratis sekarang menggunakan sistem AI kami.</p>
            <Link href="/predict">
              <Button size="lg" className="h-13 px-10 text-base font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/20">
                Mulai Skrining <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
