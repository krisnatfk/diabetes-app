import { Activity, Heart, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">
                Diabetes<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform Clinical Decision Support System berbasis Machine Learning untuk deteksi dini risiko diabetes secara akurat dan terpercaya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Beranda" },
                { href: "/predict", label: "Prediksi Diabetes" },
                { href: "/history", label: "Riwayat Prediksi" },
                { href: "/about", label: "Tentang Diabetes" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Sumber Daya</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-sky-400" /> Panduan Kesehatan</li>
              <li className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-sky-400" /> FAQ Diabetes</li>
              <li className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-sky-400" /> Riset & Jurnal</li>
              <li className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-sky-400" /> Kontak Medis</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kontak</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-sky-400 mt-0.5" />
                <span>support@diabetesai.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-400 mt-0.5" />
                <span>Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} DiabetesAI — Implementasi Machine Learning untuk Prediksi Penyakit Diabetes. Hak Cipta Dilindungi.
          </p>
          <p className="text-xs text-slate-600">
            Dibangun dengan <span className="text-sky-400">♥</span> menggunakan Next.js, FastAPI & Scikit-Learn
          </p>
        </div>
      </div>
    </footer>
  );
}
