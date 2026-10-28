import { useState } from 'react';
import { getTransaksi, getMesin, tanggalLokal } from '../api';
import { hitungKpi } from '../kpi';
import { useAutoRefresh } from '../useAutoRefresh';
import InfoPembaruan from '../components/InfoPembaruan';

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

function Laporan() {
  // Data diperbarui otomatis (useAutoRefresh), ringkasan ikut berubah tanpa refresh halaman
  const { data: mesin, error: errorMesin } = useAutoRefresh(getMesin);
  const { data: transaksi, error: errorTransaksi, terakhir } = useAutoRefresh(getTransaksi);
  const error = errorTransaksi || errorMesin;
  const [sertakanSimulasi, setSertakanSimulasi] = useState(true);

  const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

  const dataTampil = sertakanSimulasi ? transaksi : transaksi.filter((t) => !t.simulasi);
  // Rumus KPI bersama (kpi.js), sama dengan Dashboard, Transaksi, dan Revenue
  const { sukses, revenue: totalRevenue, totalTransaksi, successRate } = hitungKpi(dataTampil);
  const mesinAktif = mesin.filter((m) => m.status === 'aktif').length;

  const produkTerlaris = {};
  sukses.forEach((t) => {
    produkTerlaris[t.produk] = (produkTerlaris[t.produk] || 0) + 1;
  });
  const terlaris = Object.entries(produkTerlaris).sort((a, b) => b[1] - a[1])[0];

  const ringkasan = [
    { label: 'Total Mesin', value: mesin.length, icon: '🖥️' },
    { label: 'Mesin Aktif', value: `${mesinAktif} / ${mesin.length}`, icon: '🟢' },
    { label: 'Total Transaksi', value: totalTransaksi, icon: '🧾' },
    { label: 'Total Revenue (sukses - refund)', value: formatRupiah(totalRevenue), icon: '💰' },
    { label: 'Success Rate', value: successRate.toFixed(1) + '%', icon: '✅' },
    { label: 'Produk Terlaris', value: terlaris ? `${terlaris[0]} (${terlaris[1]}x)` : '-', icon: '🏆' },
  ];

  const exportCSV = () => {
    const header = 'Metrik,Nilai\n';
    const rows = ringkasan.map((r) => `${csvCell(r.label)},${csvCell(r.value)}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_ringkasan_${tanggalLokal(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" />
            </svg>
          </span>
          <div>
            <h2 className="text-white font-bold">Laporan Ringkasan</h2>
            <p className="text-sky-50 text-xs">Rekap performa sistem monitoring vending machine</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={exportCSV} className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-semibold transition-colors">
            ⬇️ Export CSV
          </button>
          <button onClick={exportPDF} className="px-3.5 py-2 bg-white text-blue-700 rounded-lg text-xs font-semibold hover:bg-sky-50 transition-colors">
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {error && (
        <p className="mx-6 mt-4 bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg">
          Gagal memuat data: {error}
        </p>
      )}

      <div className="px-6 pt-5 print:hidden">
        <InfoPembaruan terakhir={terakhir} />
      </div>

      <label className="flex items-center gap-2 px-6 pt-3 text-sm text-slate-500 print:hidden">
        <input
          type="checkbox"
          checked={sertakanSimulasi}
          onChange={(e) => setSertakanSimulasi(e.target.checked)}
          className="accent-blue-600"
        />
        Sertakan data simulasi
      </label>

      <div className="p-6 divide-y divide-sky-100">
        {ringkasan.map((r) => (
          <div key={r.label} className="flex justify-between items-center py-4">
            <span className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-lg">{r.icon}</span>
              {r.label}
            </span>
            <span className="text-base font-bold text-slate-900">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Laporan;