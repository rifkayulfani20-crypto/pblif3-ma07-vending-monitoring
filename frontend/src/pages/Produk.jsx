import { useEffect, useState } from 'react';
import { getProduk } from '../api';

const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

const warnaKategori = {
  'Makanan Berat': 'bg-blue-50 text-blue-600',
  'Makanan Ringan': 'bg-cyan-50 text-cyan-600',
};

function Produk() {
  const [produk, setProduk] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getProduk()
      .then(setProduk)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-3V6a4 4 0 0 0-8 0v1H6a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z" />
          </svg>
        </span>
        <h2 className="text-white font-bold">Daftar Produk</h2>
      </div>

      {error && (
        <p className="m-5 bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg">
          Gagal memuat produk: {error}
        </p>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-slate-500 text-left">
            <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Nama Produk</th>
            <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide">Kategori</th>
            <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wide text-right">Harga</th>
          </tr>
        </thead>
        <tbody>
          {produk.map((p) => (
            <tr key={p.id} className="border-t border-sky-100 hover:bg-sky-50 transition-colors">
              <td className="px-6 py-3.5 font-semibold text-slate-800">🍽️ {p.nama}</td>
              <td className="px-6 py-3.5">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${warnaKategori[p.kategori] || 'bg-slate-50 text-slate-500'}`}>
                  {p.kategori}
                </span>
              </td>
              <td className="px-6 py-3.5 text-right font-bold text-blue-600">{formatRupiah(p.harga)}</td>
            </tr>
          ))}
          {produk.length === 0 && !error && (
            <tr>
              <td colSpan="3" className="px-6 py-10 text-center text-slate-400">Belum ada produk</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Produk;