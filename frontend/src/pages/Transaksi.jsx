import { useEffect, useState } from 'react';
import { getTransaksi } from '../api';

const LABEL_STATUS = { sukses: 'Sukses', gagal: 'Gagal', refund: 'Refund' };
const WARNA_STATUS = {
  sukses: 'bg-emerald-50 text-emerald-600',
  gagal: 'bg-red-50 text-red-500',
  refund: 'bg-amber-50 text-amber-600',
};

const selectClass =
  'px-3.5 py-2.5 border border-sky-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500';

function BadgeSimulasi() {
  return (
    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
      SIMULASI
    </span>
  );
}

function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterMesin, setFilterMesin] = useState('semua');
  const [filterMetode, setFilterMetode] = useState('semua');
  const [filterData, setFilterData] = useState('semua'); // semua | asli | simulasi
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTransaksi()
      .then(setTransaksi)
      .catch((err) => setError(err.message));
  }, []);

  const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

  const daftarMesin = [...new Set(transaksi.map((t) => t.mesin))];
  const daftarMetode = [...new Set(transaksi.map((t) => t.metode))];

  const transaksiTampil = transaksi.filter((t) => {
    const cocokTanggal = !filterTanggal || t.tanggal === filterTanggal;
    const cocokStatus = filterStatus === 'semua' || t.status === filterStatus;
    const cocokMesin = filterMesin === 'semua' || t.mesin === filterMesin;
    const cocokMetode = filterMetode === 'semua' || t.metode === filterMetode;
    const cocokData =
      filterData === 'semua' ||
      (filterData === 'simulasi' && t.simulasi) ||
      (filterData === 'asli' && !t.simulasi);
    return cocokTanggal && cocokStatus && cocokMesin && cocokMetode && cocokData;
  });

  // Definisi KPI sama dengan Dashboard Revenue:
  // Total Transaksi = sukses + gagal (refund tidak dihitung)
  // Revenue = total sukses - total refund
  const jumlahTransaksi = transaksiTampil.filter((t) => t.status !== 'refund').length;
  const jumlahRefund = transaksiTampil.filter((t) => t.status === 'refund').length;
  const total = transaksiTampil.reduce((sum, t) => {
    if (t.status === 'sukses') return sum + t.harga;
    if (t.status === 'refund') return sum - t.harga;
    return sum;
  }, 0);

  const adaFilter =
    filterTanggal ||
    filterStatus !== 'semua' ||
    filterMesin !== 'semua' ||
    filterMetode !== 'semua' ||
    filterData !== 'semua';

  const resetFilter = () => {
    setFilterTanggal('');
    setFilterStatus('semua');
    setFilterMesin('semua');
    setFilterMetode('semua');
    setFilterData('semua');
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg">
          Gagal memuat transaksi: {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 flex items-center gap-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-2xl">🧾</span>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Transaksi (sukses + gagal)</p>
            <p className="text-2xl font-bold text-slate-900">
              {jumlahTransaksi}
              {jumlahRefund > 0 && (
                <span className="ml-2 text-xs font-medium text-slate-400">+ {jumlahRefund} refund</span>
              )}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 flex items-center gap-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-2xl">💰</span>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Revenue (sukses − refund)</p>
            <p className="text-2xl font-bold text-blue-600">{formatRupiah(total)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <h2 className="text-white font-bold">Riwayat Transaksi</h2>
        </div>

        <div className="p-5 flex flex-wrap gap-3 border-b border-sky-100 bg-sky-50/50">
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className={selectClass}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
            <option value="semua">Semua Status</option>
            <option value="sukses">✅ Sukses</option>
            <option value="gagal">❌ Gagal</option>
            <option value="refund">↩️ Refund</option>
          </select>
          <select value={filterMetode} onChange={(e) => setFilterMetode(e.target.value)} className={selectClass}>
            <option value="semua">Semua Metode</option>
            {daftarMetode.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={filterMesin} onChange={(e) => setFilterMesin(e.target.value)} className={selectClass}>
            <option value="semua">Semua Mesin</option>
            {daftarMesin.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={filterData} onChange={(e) => setFilterData(e.target.value)} className={selectClass}>
            <option value="semua">Data Asli + Simulasi</option>
            <option value="asli">Hanya Data Asli</option>
            <option value="simulasi">Hanya Simulasi</option>
          </select>
          {adaFilter && (
            <button
              onClick={resetFilter}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sky-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Tanggal &amp; Jam</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Mesin</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Produk</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Metode</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide text-right">Harga</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaksiTampil.map((t) => (
                <tr key={t.id} className="border-t border-sky-100 hover:bg-sky-50 transition-colors">
                  <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">🕐 {t.tanggal} · {t.waktu}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">
                    {t.mesin}
                    {t.simulasi && <BadgeSimulasi />}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{t.produk}</td>
                  <td className="px-6 py-3.5 text-slate-500">{t.metode}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${WARNA_STATUS[t.status] || 'bg-slate-50 text-slate-500'}`}>
                      {LABEL_STATUS[t.status] || t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold text-blue-600">{formatRupiah(t.harga)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => setDetail(t)} className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {transaksiTampil.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                    {transaksi.length === 0 ? 'Belum ada transaksi' : 'Tidak ada transaksi yang cocok dengan filter'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 mb-4">
              Detail Transaksi #{detail.id}
              {detail.simulasi && <BadgeSimulasi />}
            </h3>
            <dl className="space-y-3 text-sm">
              {[
                ['Tanggal', detail.tanggal],
                ['Jam', detail.waktu],
                ['Mesin', detail.mesin],
                ['Produk', detail.produk],
                ['Metode Pembayaran', detail.metode],
                ['Status', LABEL_STATUS[detail.status] || detail.status],
                ['Harga', formatRupiah(detail.harga)],
                ['Jenis Data', detail.simulasi ? 'Simulasi' : 'Asli'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-sky-100 pb-2">
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => setDetail(null)}
              className="mt-5 w-full py-2.5 bg-sky-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-sky-100 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaksi;