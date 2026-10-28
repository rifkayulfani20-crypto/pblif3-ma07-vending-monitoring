import { INTERVAL_REFRESH } from '../useAutoRefresh';

// Penanda kecil bahwa data diperbarui otomatis
export default function InfoPembaruan({ terakhir }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs text-slate-400 print:hidden">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60 animate-ping"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
      </span>
      Diperbarui otomatis tiap {INTERVAL_REFRESH / 1000} detik
      {terakhir ? `, terakhir ${terakhir.toLocaleTimeString('id-ID')}` : ''}
    </p>
  );
}