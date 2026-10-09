import { useEffect, useState } from 'react';

// Catatan: modul ini bersifat read-only, sama seperti Produk (FR-17).
// Data mesin dikelola oleh modul hardware/inventori tim lain — sesuai
// Ruang Lingkup Proyek yang menyatakan modul ini tidak mencakup
// pengendalian langsung terhadap perangkat keras mesin.

const LABEL_STATUS = {
  aktif: 'Aktif',
  nonaktif: 'Nonaktif',
  maintenance: 'Maintenance',
};

const WARNA_STATUS = {
  aktif: 'bg-emerald-50 text-emerald-600',
  nonaktif: 'bg-red-50 text-red-500',
  maintenance: 'bg-amber-50 text-amber-600',
};

const DOT_STATUS = {
  aktif: 'bg-emerald-500',
  nonaktif: 'bg-red-500',
  maintenance: 'bg-amber-500',
};

function DataMesin() {
  const [mesin, setMesin] = useState([]);
  const [cari, setCari] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  useEffect(() => {
    fetch('http://localhost:3000/api/mesin')
      .then((res) => res.json())
      .then((data) => setMesin(data.mesin));
  }, []);

  const kataCari = cari.toLowerCase();
  const mesinTampil = mesin.filter((m) => {
    const cocokCari =
      (m.nama || '').toLowerCase().includes(kataCari) ||
      (m.lokasi || '').toLowerCase().includes(kataCari) ||
      (m.kode || '').toLowerCase().includes(kataCari);
    const cocokFilter = filterStatus === 'semua' || m.status === filterStatus;
    return cocokCari && cocokFilter;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="4" y1="9" x2="20" y2="9" />
          </svg>
        </span>
        <div>
          <h2 className="text-white font-bold">Data Mesin</h2>
          <p className="text-sky-50 text-xs">Daftar mesin penjualan (read-only, data dari modul hardware)</p>
        </div>
      </div>

      <div className="p-5 flex flex-col sm:flex-row gap-3 border-b border-sky-100 bg-sky-50/50">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </span>
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari kode, nama, atau lokasi mesin..."
            className="w-full pl-10 pr-3.5 py-2.5 border border-sky-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2.5 border border-sky-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="semua">Semua Status</option>
          <option value="aktif">🟢 Aktif</option>
          <option value="nonaktif">🔴 Nonaktif</option>
          <option value="maintenance">🟠 Maintenance</option>
        </select>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-slate-500 text-left">
            <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">Kode</th>
            <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">Nama Mesin</th>
            <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">Lokasi</th>
            <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {mesinTampil.map((m) => (
            <tr key={m.id} className="border-t border-sky-100 hover:bg-sky-50 transition-colors">
              <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{m.kode}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{m.nama}</td>
              <td className="px-5 py-3.5 text-slate-500">📍 {m.lokasi}</td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${WARNA_STATUS[m.status] || 'bg-slate-50 text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${DOT_STATUS[m.status] || 'bg-slate-400'}`}></span>
                  {LABEL_STATUS[m.status] || m.status}
                </span>
              </td>
            </tr>
          ))}
          {mesinTampil.length === 0 && (
            <tr>
              <td colSpan="4" className="px-5 py-10 text-center text-slate-400">
                {mesin.length === 0 ? 'Belum ada data mesin' : 'Tidak ada mesin yang cocok dengan pencarian'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataMesin;