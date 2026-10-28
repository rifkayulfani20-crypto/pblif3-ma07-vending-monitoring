import { Link } from 'react-router-dom';

const FITUR = [
  {
    icon: '📊',
    judul: 'Ringkasan Hari Ini',
    isi: 'Lihat total pendapatan, jumlah transaksi, dan success rate langsung setelah masuk.',
    warna: 'bg-sky-100 text-sky-600',
    garis: 'border-t-sky-400',
  },
  {
    icon: '🧾',
    judul: 'Riwayat Transaksi',
    isi: 'Saring transaksi berdasarkan tanggal, status, dan metode pembayaran.',
    warna: 'bg-blue-100 text-blue-600',
    garis: 'border-t-blue-400',
  },
  {
    icon: '⏰',
    judul: 'Jam Sibuk',
    isi: 'Ketahui jam transaksi paling ramai dari data penjualan.',
    warna: 'bg-cyan-100 text-cyan-600',
    garis: 'border-t-cyan-400',
  },
  {
    icon: '🏷️',
    judul: 'Data Simulasi',
    isi: 'Transaksi uji diberi tanda SIMULASI dan bisa dipisahkan dari data asli.',
    warna: 'bg-indigo-100 text-indigo-500',
    garis: 'border-t-indigo-300',
  },
];

const LANGKAH = [
  {
    no: '1',
    judul: 'Transaksi Tercatat',
    isi: 'Setiap pembelian di mesin dicatat lengkap dengan produk, harga, jam, dan metode bayar.',
    warna: 'from-sky-500 to-blue-500 shadow-sky-400/40',
  },
  {
    no: '2',
    judul: 'Data Diolah Server',
    isi: 'Server menghitung revenue, success rate, AOV, dan jam sibuk secara otomatis.',
    warna: 'from-sky-500 to-blue-600 shadow-blue-400/40',
  },
  {
    no: '3',
    judul: 'Tampil di Dashboard',
    isi: 'Pengelola melihat grafik tren dan laporan, lalu mengekspornya ke CSV atau PDF.',
    warna: 'from-blue-500 to-blue-600 shadow-blue-400/40',
  },
];

function MesinIlustrasi() {
  return (
    <svg viewBox="0 0 260 340" className="w-full max-w-[280px] drop-shadow-xl" role="img" aria-label="Ilustrasi mesin penjual makanan panas">
      {/* uap */}
      <g className="animate-pulse" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M70 34 q-8 -10 0 -20 q8 -10 0 -20" />
        <path d="M130 34 q-8 -10 0 -20 q8 -10 0 -20" />
        <path d="M190 34 q-8 -10 0 -20 q8 -10 0 -20" />
      </g>

      {/* badan mesin */}
      <rect x="20" y="40" width="220" height="290" rx="18" fill="#7dd3fc" />
      <rect x="20" y="40" width="220" height="290" rx="18" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6" />

      {/* kaca etalase */}
      <rect x="36" y="58" width="140" height="200" rx="10" fill="#1e3a5f" />
      <rect x="36" y="58" width="140" height="200" rx="10" fill="none" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.8" />

      {/* rak 1 */}
      <rect x="46" y="110" width="120" height="4" rx="2" fill="#7dd3fc" opacity="0.8" />
      <ellipse cx="68" cy="98" rx="14" ry="10" fill="#f59e0b" />
      <ellipse cx="106" cy="98" rx="14" ry="10" fill="#fbbf24" />
      <ellipse cx="144" cy="98" rx="14" ry="10" fill="#fde68a" />

      {/* rak 2 */}
      <rect x="46" y="170" width="120" height="4" rx="2" fill="#7dd3fc" opacity="0.8" />
      <rect x="54" y="140" width="28" height="26" rx="6" fill="#ef4444" />
      <rect x="92" y="140" width="28" height="26" rx="6" fill="#fb923c" />
      <rect x="130" y="140" width="28" height="26" rx="6" fill="#facc15" />

      {/* rak 3 */}
      <rect x="46" y="230" width="120" height="4" rx="2" fill="#7dd3fc" opacity="0.8" />
      <circle cx="68" cy="214" r="13" fill="#fde68a" />
      <circle cx="106" cy="214" r="13" fill="#fdba74" />
      <circle cx="144" cy="214" r="13" fill="#fcd34d" />

      {/* panel kanan */}
      <rect x="188" y="58" width="40" height="30" rx="6" fill="#1e3a5f" />
      <text x="208" y="77" textAnchor="middle" fontSize="10" fontWeight="700" fill="#67e8f9" fontFamily="monospace">OPEN</text>
      <rect x="190" y="100" width="36" height="8" rx="3" fill="#e0f2fe" />
      <rect x="190" y="116" width="36" height="8" rx="3" fill="#e0f2fe" />
      <rect x="190" y="132" width="36" height="8" rx="3" fill="#e0f2fe" />
      <rect x="196" y="160" width="24" height="40" rx="5" fill="#1e3a5f" />
      <circle cx="208" cy="214" r="5" fill="#0ea5e9" />

      {/* kotak ambil */}
      <rect x="36" y="272" width="140" height="42" rx="8" fill="#1e3a5f" />
      <rect x="44" y="280" width="124" height="26" rx="5" fill="#2c4a73" />
    </svg>
  );
}

function DashboardPreview() {
  const batang = [35, 50, 42, 65, 80, 58, 90, 70];
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-sky-400/30 border border-sky-100 overflow-hidden w-full max-w-md">
      {/* bar judul jendela */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-sky-50 border-b border-sky-100">
        <span className="w-2.5 h-2.5 rounded-full bg-sky-200"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-sky-200"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-sky-200"></span>
        <span className="ml-3 text-[11px] text-slate-500 font-medium">Dashboard Revenue &amp; Performa</span>
      </div>

      <div className="p-4 space-y-4">
        {/* kartu KPI */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Revenue', bar: 'w-16 bg-sky-400', bg: 'bg-sky-50' },
            { label: 'Success Rate', bar: 'w-12 bg-blue-400', bg: 'bg-blue-50' },
            { label: 'Peak Hour', bar: 'w-14 bg-cyan-400', bg: 'bg-cyan-50' },
          ].map((k) => (
            <div key={k.label} className={`rounded-xl p-3 ${k.bg}`}>
              <p className="text-[10px] text-slate-500">{k.label}</p>
              <div className={`mt-1.5 h-3 rounded ${k.bar}`}></div>
            </div>
          ))}
        </div>

        {/* grafik batang */}
        <div className="rounded-xl border border-sky-100 p-3">
          <p className="text-[10px] text-slate-500 mb-2">Tren penjualan</p>
          <div className="flex items-end gap-1.5 h-24">
            {batang.map((t, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${i === 6 ? 'bg-gradient-to-t from-blue-500 to-sky-400' : 'bg-sky-100'}`}
                style={{ height: `${t}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* donut + legenda */}
        <div className="flex items-center gap-4 rounded-xl border border-sky-100 p-3">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#e0f2fe" strokeWidth="6" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="100 100" />
          </svg>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-400"></span>QRIS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-sky-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-xl shadow-lg shadow-sky-400/40">🔥</span>
            <div className="leading-tight">
              <p className="font-bold text-slate-900">Sistem Monitoring</p>
              <p className="text-[11px] text-slate-500">Mesin Penjual Makanan Panas</p>
            </div>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg text-sm font-semibold hover:bg-sky-50 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200">
        {/* cahaya dekorasi */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/60 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/60 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/70 border border-sky-200 text-xs font-semibold text-blue-700">
              Dashboard Business Intelligence
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
              Monitoring Transaksi dan{' '}
              <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Performa Bisnis
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Pantau pendapatan, tingkat keberhasilan transaksi, dan jam tersibuk mesin penjual makanan panas dalam satu dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/login"
                className="px-7 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
              >
                Masuk ke Dashboard
              </Link>
              <a
                href="#fitur"
                className="px-7 py-3.5 bg-white/70 border border-blue-300 text-blue-700 rounded-xl font-semibold hover:bg-white transition-colors"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* gambar */}
          <div className="relative flex items-center justify-center min-h-[360px]">
            <div className="absolute left-0 sm:left-4 bottom-0 z-10 hidden sm:block">
              <MesinIlustrasi />
            </div>
            <div className="relative sm:ml-40 w-full flex justify-center sm:justify-end">
              <DashboardPreview />
            </div>
          </div>
        </div>

        {/* gelombang pembatas */}
        <svg viewBox="0 0 1440 60" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 C240 70 480 0 720 30 C960 60 1200 10 1440 30 L1440 60 L0 60 Z" fill="#f0f9ff" />
        </svg>
      </header>

      <main className="flex-1">
        {/* Fitur */}
        <section id="fitur" className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-2">Fitur Utama</h2>
          <p className="text-center text-slate-500 mb-10">Semua yang dibutuhkan pengelola untuk membaca performa penjualan.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FITUR.map((f) => (
              <div
                key={f.judul}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-sky-100 border-t-4 ${f.garis} hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200/60 transition-all`}
              >
                <span className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4 ${f.warna}`}>
                  {f.icon}
                </span>
                <h3 className="font-bold text-slate-900 mb-1">{f.judul}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.isi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cara kerja */}
        <section className="bg-white border-y border-sky-100">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-center mb-10">Cara Kerja</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LANGKAH.map((l) => (
                <div key={l.no} className="text-center">
                  <span className={`mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${l.warna} text-white text-xl font-bold shadow-lg`}>
                    {l.no}
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900">{l.judul}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{l.isi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ajakan akhir */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 to-blue-200 px-8 py-12 text-center">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/60 blur-2xl"></div>
            <h2 className="relative text-2xl font-bold text-slate-900">Siap memantau performa bisnis?</h2>
            <p className="relative mt-2 text-slate-600">Masuk dengan akun pengelola untuk melihat dashboard.</p>
            <Link
              to="/login"
              className="relative inline-block mt-6 px-7 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-sky-100 text-slate-500 text-sm text-center py-6">
        Website Monitoring Transaksi dan Performa Bisnis
      </footer>
    </div>
  );
}