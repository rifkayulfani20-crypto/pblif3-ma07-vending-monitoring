import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getTransaksi, getMesin, tanggalLokal } from '../api';

const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const STATUS_MESIN = {
  aktif: { label: 'Aktif', className: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  nonaktif: { label: 'Nonaktif', className: 'bg-red-50 text-red-500', dot: 'bg-red-500' },
};

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

function tanggalOffset(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return tanggalLokal(d);
}

// FR-04: siapkan label & total revenue untuk 7 hari terakhir (termasuk hari ini)
function siapkanDataMingguan(transaksi) {
  const hari = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    hari.push({ tanggal: tanggalLokal(d), label: NAMA_HARI[d.getDay()], total: 0 });
  }

  transaksi.forEach((t) => {
    if (t.status !== 'sukses') return;
    const target = hari.find((h) => h.tanggal === t.tanggal);
    if (target) target.total += t.harga;
  });

  return hari;
}

// Ringkasan satu hari: jumlah, sukses, revenue, success rate
function ringkasHari(transaksi, tanggal) {
  const data = transaksi.filter((t) => t.tanggal === tanggal);
  const sukses = data.filter((t) => t.status === 'sukses');
  return {
    jumlah: data.length,
    revenue: sukses.reduce((sum, t) => sum + t.harga, 0),
    rate: data.length ? (sukses.length / data.length) * 100 : null,
  };
}

function Dashboard() {
  const [mesin, setMesin] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    getMesin()
      .then(setMesin)
      .catch((err) => setError(err.message));

    getTransaksi()
      .then(setTransaksi)
      .catch((err) => setError(err.message));
  }, []);

  const ini = ringkasHari(transaksi, tanggalOffset(0));
  const kemarin = ringkasHari(transaksi, tanggalOffset(1));

  const jumlahMesinAktif = mesin.filter((m) => m.status === 'aktif').length;
  const jumlahMaintenance = mesin.filter((m) => m.status === 'maintenance').length;
  const jumlahNonaktif = mesin.filter((m) => m.status === 'nonaktif').length;

  // Catatan pembanding vs kemarin (naik: true/false/null)
  const catatanRevenue =
    kemarin.revenue > 0
      ? {
          naik: ini.revenue >= kemarin.revenue,
          teks: `${Math.abs(((ini.revenue - kemarin.revenue) / kemarin.revenue) * 100).toFixed(0)}% vs kemarin`,
        }
      : { naik: null, teks: 'Belum ada pembanding kemarin' };

  const selisihJumlah = ini.jumlah - kemarin.jumlah;
  const catatanJumlah = {
    naik: selisihJumlah === 0 ? null : selisihJumlah > 0,
    teks: selisihJumlah === 0 ? 'Sama dengan kemarin' : `${Math.abs(selisihJumlah)} vs kemarin`,
  };

  const catatanRate =
    ini.rate !== null && kemarin.rate !== null
      ? {
          naik: ini.rate === kemarin.rate ? null : ini.rate > kemarin.rate,
          teks: `${Math.abs(ini.rate - kemarin.rate).toFixed(0)} poin vs kemarin`,
        }
      : { naik: null, teks: 'Belum ada pembanding kemarin' };

  const statCards = [
    {
      label: 'Total Revenue (hari ini)',
      value: formatRupiah(ini.revenue),
      color: 'text-blue-600',
      icon: '💰',
      catatan: catatanRevenue,
    },
    {
      label: 'Jumlah Transaksi (hari ini)',
      value: ini.jumlah,
      color: 'text-sky-500',
      icon: '🧾',
      catatan: catatanJumlah,
    },
    {
      label: 'Success Rate (hari ini)',
      value: ini.rate === null ? '-' : ini.rate.toFixed(1) + '%',
      color: 'text-indigo-500',
      icon: '✅',
      catatan: catatanRate,
    },
    {
      label: 'Jumlah Mesin Aktif',
      value: `${jumlahMesinAktif} / ${mesin.length}`,
      color: 'text-cyan-600',
      icon: '🖥️',
      catatan: { naik: null, teks: `${jumlahMaintenance} maintenance · ${jumlahNonaktif} nonaktif` },
    },
  ];

  const dataMingguan = siapkanDataMingguan(transaksi);

  useEffect(() => {
    if (transaksi.length === 0) return undefined;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: dataMingguan.map((h) => h.label),
        datasets: [
          {
            label: 'Revenue',
            data: dataMingguan.map((h) => h.total),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14,165,233,0.1)',
            tension: 0.25,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#0ea5e9',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => formatRupiah(ctx.parsed.y) } },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => 'Rp ' + v / 1000 + 'rb' },
            grid: { color: '#f1f5f9' },
          },
          x: { grid: { display: false } },
        },
      },
    });
    return () => chartRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaksi]);

  return (
    <>
      <p className="text-sm text-slate-500 -mt-4 mb-6">
        Ringkasan performa bisnis hari ini &amp; tren penjualan 7 hari terakhir.
      </p>

      {error && (
        <p className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">
          Gagal memuat data: {error}. Pastikan server berjalan di http://localhost:3000.
        </p>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100">
            <div className="flex justify-between items-start">
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`text-3xl font-bold my-1 ${s.color}`}>{s.value}</p>
            <p
              className={`text-xs font-medium ${
                s.catatan.naik === null ? 'text-slate-400' : s.catatan.naik ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {s.catatan.naik === null ? '' : s.catatan.naik ? '▲ ' : '▼ '}
              {s.catatan.teks}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden mb-7">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 text-lg">📈</span>
          <div>
            <h2 className="text-white font-bold">Performa Penjualan Mingguan</h2>
            <p className="text-sky-50 text-xs">Total revenue per hari, 7 hari terakhir</p>
          </div>
        </div>
        <div className="p-6">
          <div className="h-72">
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Status Mesin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {mesin.map((m) => {
            const st = STATUS_MESIN[m.status] || STATUS_MESIN.nonaktif;
            return (
              <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-slate-400">{m.kode || `#${m.id}`}</span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${st.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                    {st.label}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-[15px]">{m.nama}</p>
                <p className="text-xs text-slate-400 mt-1">📍 {m.lokasi}</p>
              </div>
            );
          })}
          {mesin.length === 0 && <p className="text-sm text-slate-400">Belum ada data mesin</p>}
        </div>
      </section>
    </>
  );
}

export default Dashboard;