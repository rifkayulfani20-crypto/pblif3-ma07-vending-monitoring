import { useEffect, useRef, useState } from 'react';

// Interval pembaruan otomatis (milidetik)
export const INTERVAL_REFRESH = 30000;

// Ambil data saat halaman dibuka, lalu perbarui otomatis tiap `interval`.
// - Data hanya diganti jika isinya benar-benar berbeda, sehingga grafik tidak berkedip.
// - Pembaruan dilewati saat tab browser sedang tidak dilihat.
export function useAutoRefresh(ambil, interval = INTERVAL_REFRESH) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [terakhir, setTerakhir] = useState(null);
  const sebelumnya = useRef('');

  useEffect(() => {
    let aktif = true;

    const muat = () =>
      ambil()
        .then((hasil) => {
          if (!aktif) return;
          const kunci = JSON.stringify(hasil);
          if (kunci !== sebelumnya.current) {
            sebelumnya.current = kunci;
            setData(hasil);
          }
          setError('');
          setTerakhir(new Date());
        })
        .catch((err) => {
          if (aktif) setError(err.message);
        });

    muat();
    const id = setInterval(() => {
      if (!document.hidden) muat();
    }, interval);

    return () => {
      aktif = false;
      clearInterval(id);
    };
  }, [ambil, interval]);

  return { data, error, terakhir };
}