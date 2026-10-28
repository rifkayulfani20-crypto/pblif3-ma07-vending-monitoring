// Satu-satunya tempat rumus KPI. Dipakai Dashboard, Transaksi, Revenue, dan Laporan
// supaya angkanya selalu sama di semua halaman.
//
// Definisi:
//   Total Transaksi = sukses + gagal (refund tidak dihitung sebagai transaksi)
//   Revenue         = total sukses - total refund
//   Success Rate    = sukses / (sukses + gagal)
//   AOV             = total sukses / jumlah sukses
//
// Jika diputuskan refund TIDAK mengurangi revenue, cukup ubah menjadi false.
export const REFUND_MENGURANGI_REVENUE = true;

// Nilai revenue satu transaksi: sukses menambah, refund mengurangi, lainnya 0
export function nilaiRevenue(t) {
  if (t.status === 'sukses') return t.harga;
  if (t.status === 'refund' && REFUND_MENGURANGI_REVENUE) return -t.harga;
  return 0;
}

export function hitungKpi(list) {
  const sukses = list.filter((t) => t.status === 'sukses');
  const gagal = list.filter((t) => t.status === 'gagal');
  const refund = list.filter((t) => t.status === 'refund');
  const kotor = sukses.reduce((sum, t) => sum + t.harga, 0);
  const totalRefund = refund.reduce((sum, t) => sum + t.harga, 0);
  const totalTransaksi = sukses.length + gagal.length;
  return {
    sukses,
    revenue: list.reduce((sum, t) => sum + nilaiRevenue(t), 0),
    totalRefund,
    totalTransaksi,
    aov: sukses.length ? kotor / sukses.length : 0,
    successRate: totalTransaksi ? (sukses.length / totalTransaksi) * 100 : 0,
  };
}

// Peringkat mesin berdasarkan jumlah transaksi sukses (terjual).
// Jika imbang, mesin dengan revenue lebih besar di atas. Mesin tanpa transaksi tetap ikut (terjual 0).
export function peringkatMesin(list, namaMesin = []) {
  const perMesin = {};
  namaMesin.forEach((nama) => { perMesin[nama] = []; });
  list.forEach((t) => { (perMesin[t.mesin] = perMesin[t.mesin] || []).push(t); });
  return Object.entries(perMesin)
    .map(([nama, items]) => {
      const kpi = hitungKpi(items);
      return { nama, terjual: kpi.sukses.length, revenue: kpi.revenue };
    })
    .sort((a, b) => b.terjual - a.terjual || b.revenue - a.revenue);
}