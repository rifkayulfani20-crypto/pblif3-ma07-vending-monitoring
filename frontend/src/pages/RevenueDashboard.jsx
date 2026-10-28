import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getTransaksi } from '../api';
import { hitungKpi, nilaiRevenue } from '../kpi';
import { useAutoRefresh } from '../useAutoRefresh';
import InfoPembaruan from '../components/InfoPembaruan';

const formatRupiah = (angka) => 'Rp' + Math.round(angka).toLocaleString('id-ID');
const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;
const inputClass =
  'px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500';

// 'YYYY-MM-DD' -> Date lokal (bukan UTC)
const parseTanggal = (str) => new Date(`${str}T00:00:00`);

const WARNA_METODE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

// Persentase per metode dengan 1 desimal yang dijamin berjumlah tepat 100,0%
// (metode "sisa terbesar": sisa pembulatan dibagikan ke yang pecahannya paling besar)
function hitungPersen(hitungan) {
  const total = Object.values(hitungan).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  const entri = Object.entries(hitungan).map(([nama, jumlah]) => {
    const mentah = (jumlah / total) * 1000; // dalam persepuluh persen
    return { nama, nilai: Math.floor(mentah), sisa: mentah - Math.floor(mentah) };
  });
  let kurang = 1000 - entri.reduce((a, e) => a + e.nilai, 0);
  [...entri]
    .sort((a, b) => b.sisa - a.sisa)
    .forEach((e) => {
      if (kurang > 0) {
        e.nilai += 1;
        kurang -= 1;
      }
    });
  return Object.fromEntries(entri.map((e) => [e.nama, e.nilai / 10]));
}

function RevenueDashboard() {
  // Data diperbarui otomatis (useAutoRefresh), KPI ikut berubah tanpa refresh halaman
  const { data: transaksi, error, terakhir } = useAutoRefresh(getTransaksi);
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterMetode, setFilterMetode] = useState('semua');
  const [sertakanSimulasi, setSertakanSimulasi] = useState(true);

  const trendRef = useRef(null);
  const trendChart = useRef(null);
  const payRef = useRef(null);
  const payChart = useRef(null);

  const daftarMetode = useMemo(() => [...new Set(transaksi.map((t) => t.metode))], [transaksi]);

  // Filter selain tanggal (dipakai juga untuk perbandingan periode)
  const dasar = useMemo(
    () =>
      transaksi.filter((t) => {
        if (!sertakanSimulasi && t.simulasi) return false;
        if (filterStatus !== 'semua' && t.status !== filterStatus) return false;
        if (filterMetode !== 'semua' && t.metode !== filterMetode) return false;
        return true;
      }),
    [transaksi, sertakanSimulasi, filterStatus, filterMetode]
  );

  // Filter lengkap termasuk rentang tanggal
  const data = useMemo(
    () => dasar.filter((t) => (!dari || t.tanggal >= dari) && (!sampai || t.tanggal <= sampai)),
    [dasar, dari, sampai]
  );

  const { sukses, revenue: totalRevenue, totalRefund, totalTransaksi, aov, successRate } = hitungKpi(data);

  // Struktur data peak hours: 24 slot jam
  const jamCount = {};
  sukses.forEach((t) => { jamCount[t.jam] = (jamCount[t.jam] || 0) + 1; });
  const peakHour = Object.entries(jamCount).sort((a, b) => b[1] - a[1])[0];
  const jamMaks = Math.max(1, ...Object.values(jamCount));

  // Revenue per tanggal: sukses ditambah, refund dikurangi
  const revenuePerTanggal = {};
  data.forEach((t) => {
    const nilai = nilaiRevenue(t);
    if (nilai !== 0) revenuePerTanggal[t.tanggal] = (revenuePerTanggal[t.tanggal] || 0) + nilai;
  });
  const tanggalList = Object.keys(revenuePerTanggal).sort();

  const metodeCount = {};
  sukses.forEach((t) => { metodeCount[t.metode] = (metodeCount[t.metode] || 0) + 1; });
  const persenMetode = hitungPersen(metodeCount);
  const totalMetode = Object.values(metodeCount).reduce((a, b) => a + b, 0);

  // KPI per mesin: hitungKpi() dijalankan pada tiap kelompok mesin (mengikuti filter yang aktif)
  const kpiPerMesin = Object.entries(
    data.reduce((acc, t) => {
      (acc[t.mesin] = acc[t.mesin] || []).push(t);
      return acc;
    }, {})
  )
    .map(([nama, list]) => ({ nama, ...hitungKpi(list) }))
    .sort((a, b) => b.revenue - a.revenue);

  // Mesin terlaris = transaksi sukses terbanyak (imbang: revenue lebih besar)
  const terlarisMesin = [...kpiPerMesin].sort((a, b) => b.sukses.length - a.sukses.length || b.revenue - a.revenue)[0];

  // Perbandingan 7 hari terakhir vs 7 hari sebelumnya (tidak terpengaruh filter tanggal)
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const hariKeDari = (tanggalStr) => Math.round((hariIni - parseTanggal(tanggalStr)) / 86400000);
  const kpiIni = hitungKpi(dasar.filter((t) => hariKeDari(t.tanggal) >= 0 && hariKeDari(t.tanggal) <= 6));
  const kpiLalu = hitungKpi(dasar.filter((t) => hariKeDari(t.tanggal) >= 7 && hariKeDari(t.tanggal) <= 13));
  const persenPerubahan =
    kpiLalu.revenue > 0
      ? ((kpiIni.revenue - kpiLalu.revenue) / kpiLalu.revenue) * 100
      : kpiIni.revenue > 0
        ? 100
        : 0;

  const perbandingan = [
    { label: 'Revenue', ini: formatRupiah(kpiIni.revenue), lalu: formatRupiah(kpiLalu.revenue) },
    { label: 'Jumlah Transaksi', ini: kpiIni.totalTransaksi, lalu: kpiLalu.totalTransaksi },
  ];

  useEffect(() => {
    if (tanggalList.length === 0) return undefined;
    trendChart.current = new Chart(trendRef.current, {
      type: 'line',
      data: {
        labels: tanggalList.map((d) => d.slice(5)),
        datasets: [{
          label: 'Revenue',
          data: tanggalList.map((d) => revenuePerTanggal[d]),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          tension: 0.25, fill: true, borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: (v) => 'Rp' + v / 1000 + 'rb' }, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
      },
    });
    return () => trendChart.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const labels = Object.keys(metodeCount);
    if (labels.length === 0) return undefined;
    payChart.current = new Chart(payRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: labels.map((l) => metodeCount[l]), backgroundColor: WARNA_METODE }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed} transaksi (${persenMetode[ctx.label].toFixed(1)}%)`,
            },
          },
        },
      },
    });
    return () => payChart.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const exportCSV = () => {
    const header = ['ID', 'Mesin', 'Produk', 'Harga', 'Tanggal', 'Jam', 'Metode', 'Status', 'Simulasi']
      .map(csvCell)
      .join(',');
    const rows = data
      .map((t) =>
        [t.id, t.mesin, t.produk, t.harga, t.tanggal, t.jam, t.metode, t.status, t.simulasi ? 'ya' : 'tidak']
          .map(csvCell)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan_performa.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  const adaFilter = dari || sampai || filterStatus !== 'semua' || filterMetode !== 'semua' || !sertakanSimulasi;
  const resetFilter = () => {
    setDari('');
    setSampai('');
    setFilterStatus('semua');
    setFilterMetode('semua');
    setSertakanSimulasi(true);
  };

  const kpis = [
    { label: 'Total Transaksi', value: totalTransaksi, icon: '🧾' },
    { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: '💰' },
    { label: 'AOV (Rata-rata)', value: formatRupiah(aov), icon: '📊' },
    { label: 'Success Rate', value: successRate.toFixed(1) + '%', icon: '✅' },
    { label: 'Peak Hour', value: peakHour ? `Jam ${peakHour[0]}:00` : '-', icon: '⏰' },
    { label: 'Total Refund', value: formatRupiah(totalRefund), icon: '↩️', dashed: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Dashboard Revenue &amp; Performa</h2>
          <p className="text-sm text-slate-400">Rekap performa bisnis dari seluruh mesin</p>
          <div className="mt-1">
            <InfoPembaruan terakhir={terakhir} />
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={exportCSV} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
            ⬇️ Export CSV
          </button>
          <button onClick={exportPDF} className="px-4 py-2 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-lg text-sm font-semibold shadow hover:opacity-90">
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {error && (
        <p className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg">Gagal memuat data: {error}</p>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-wrap items-center gap-3 print:hidden">
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Dari
          <input type="date" value={dari} max={sampai || undefined} onChange={(e) => setDari(e.target.value)} className={inputClass} />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Sampai
          <input type="date" value={sampai} min={dari || undefined} onChange={(e) => setSampai(e.target.value)} className={inputClass} />
        </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass}>
          <option value="semua">Semua Status</option>
          <option value="sukses">✅ Sukses</option>
          <option value="gagal">❌ Gagal</option>
          <option value="refund">↩️ Refund</option>
        </select>
        <select value={filterMetode} onChange={(e) => setFilterMetode(e.target.value)} className={inputClass}>
          <option value="semua">Semua Metode</option>
          {daftarMetode.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" checked={sertakanSimulasi} onChange={(e) => setSertakanSimulasi(e.target.checked)} />
          Sertakan data simulasi
        </label>
        {adaFilter && (
          <button onClick={resetFilter} className="px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700">
            Reset filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`bg-white rounded-2xl p-4 shadow-sm border ${k.dashed ? 'border-dashed border-slate-300' : 'border-slate-100'}`}
          >
            <p className="text-lg mb-1">{k.icon}</p>
            <p className="text-xs text-slate-500 font-medium">{k.label}</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Tren Revenue Harian</h3>
          {tanggalList.length === 0 && <p className="text-sm text-slate-400">Tidak ada data untuk filter ini</p>}
          <canvas ref={trendRef} height="110"></canvas>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-1">Breakdown Metode Pembayaran</h3>
          <p className="text-xs text-slate-400 mb-4">Dari transaksi sukses</p>
          {Object.keys(metodeCount).length === 0 && <p className="text-sm text-slate-400">Tidak ada data untuk filter ini</p>}
          <canvas ref={payRef}></canvas>
          {totalMetode > 0 && (
            <table className="w-full text-sm mt-4" data-testid="breakdown-metode">
              <tbody>
                {Object.keys(metodeCount).map((m, i) => (
                  <tr key={m} className="border-t border-slate-100">
                    <td className="py-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: WARNA_METODE[i % WARNA_METODE.length] }}></span>
                      <span className="font-medium text-slate-700">{m}</span>
                    </td>
                    <td className="py-2 text-right text-slate-500">{metodeCount[m]}</td>
                    <td className="py-2 text-right font-semibold text-slate-800">{persenMetode[m].toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-200">
                  <td className="py-2 font-bold text-slate-900">Total</td>
                  <td className="py-2 text-right font-bold text-slate-900">{totalMetode}</td>
                  <td className="py-2 text-right font-bold text-slate-900">100.0%</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-1">Analisis Jam Sibuk</h3>
        <p className="text-xs text-slate-400 mb-4">Jumlah transaksi sukses per jam operasional</p>
        <div className="flex items-end gap-1.5 h-32">
          {Array.from({ length: 24 }, (_, jam) => jam).map((jam) => {
            const jumlah = jamCount[jam] || 0;
            const tinggi = Math.max(4, (jumlah / jamMaks) * 100);
            const isPuncak = peakHour && Number(peakHour[0]) === jam;
            return (
              <div key={jam} className="flex-1 h-full flex flex-col items-center justify-end gap-1" title={`Jam ${jam}:00 — ${jumlah} transaksi`}>
                <div
                  className={`w-full rounded-t ${isPuncak ? 'bg-emerald-500' : jumlah > 0 ? 'bg-emerald-200' : 'bg-slate-100'}`}
                  style={{ height: `${tinggi}%` }}
                ></div>
                <span className="text-[9px] text-slate-400">{jam}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-1">KPI per Mesin</h3>
        <p className="text-xs text-slate-400 mb-4">Performa bisnis tiap mesin, mengikuti filter di atas</p>
        {kpiPerMesin.length === 0 ? (
          <p className="text-sm text-slate-400">Tidak ada data untuk filter ini</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left">
                  <th className="py-2 font-medium">Mesin</th>
                  <th className="py-2 font-medium text-right">Transaksi</th>
                  <th className="py-2 font-medium text-right">Terjual</th>
                  <th className="py-2 font-medium text-right">Revenue</th>
                  <th className="py-2 font-medium text-right">AOV</th>
                  <th className="py-2 font-medium pl-6 w-56">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {kpiPerMesin.map((m) => (
                  <tr key={m.nama} className="border-t border-slate-100">
                    <td className="py-3 font-semibold text-slate-800">
                      {m.nama}
                      {terlarisMesin && terlarisMesin.sukses.length > 0 && m.nama === terlarisMesin.nama && (
                        <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">🏆 Terlaris</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-600">{m.totalTransaksi}</td>
                    <td className="py-3 text-right text-slate-600">{m.sukses.length}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">{formatRupiah(m.revenue)}</td>
                    <td className="py-3 text-right text-slate-600">{formatRupiah(m.aov)}</td>
                    <td className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.successRate}%` }}></div>
                        </div>
                        <span className="w-12 text-right font-semibold text-slate-700">{m.successRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-900">Perbandingan Performa</h3>
            <p className="text-xs text-slate-400">7 hari terakhir vs 7 hari sebelumnya</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${persenPerubahan >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {persenPerubahan >= 0 ? '▲' : '▼'} {Math.abs(persenPerubahan).toFixed(1)}%
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-left">
              <th className="py-2 font-medium">Metrik</th>
              <th className="py-2 font-medium text-right">7 Hari Terakhir</th>
              <th className="py-2 font-medium text-right">7 Hari Sebelumnya</th>
            </tr>
          </thead>
          <tbody>
            {perbandingan.map((row) => (
              <tr key={row.label} className="border-t border-slate-100">
                <td className="py-3 font-semibold text-slate-800">{row.label}</td>
                <td className="py-3 text-right text-emerald-600 font-bold">{row.ini}</td>
                <td className="py-3 text-right text-slate-400">{row.lalu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueDashboard;