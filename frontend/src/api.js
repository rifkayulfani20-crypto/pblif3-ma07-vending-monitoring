// Satu-satunya tempat alamat API. Saat PC9 siap, ganti lewat frontend/.env:
// VITE_API_URL=http://alamat-pc9:PORT
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ORDERS_PATH = '/api/v1/orders';

const pad = (n) => String(n).padStart(2, '0');

// Tanggal lokal (YYYY-MM-DD), bukan UTC, supaya tidak mundur sehari di WIB
export function tanggalLokal(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const STATUS_MAP = {
  completed: 'sukses',
  paid: 'sukses',
  success: 'sukses',
  failed: 'gagal',
  cancelled: 'gagal',
  refunded: 'refund',
};

// Terjemahkan bentuk order PC9 -> bentuk yang dipakai halaman kita
export function normalisasiOrder(o) {
  const d = new Date(o.created_at);
  return {
    id: o.id,
    mesin: o.machine_name || `Mesin ${o.machine_id ?? '-'}`,
    produk: o.product_name || '-',
    harga: Number(o.total_amount),
    status: STATUS_MAP[o.status] || o.status,
    metode: o.payment_method || '-',
    simulasi: Boolean(o.is_simulated),
    tanggal: tanggalLokal(d),
    jam: d.getHours(),
    waktu: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

// Fungsi umum: ambil JSON dari backend, sertakan token jika ada
async function ambilJSON(path, pesanGagal) {
  const token = sessionStorage.getItem('token');
  const res = await fetch(BASE_URL + path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`${pesanGagal} (${res.status})`);
  return res.json();
}

export async function getTransaksi() {
  const json = await ambilJSON(ORDERS_PATH, 'Gagal mengambil order');
  const list = Array.isArray(json) ? json : json.data || [];
  return list.map(normalisasiOrder);
}

export async function getMesin() {
  const json = await ambilJSON('/api/mesin', 'Gagal mengambil data mesin');
  return json.mesin || [];
}

export async function getProduk() {
  const json = await ambilJSON('/api/produk', 'Gagal mengambil data produk');
  return json.produk || [];
}

export async function getSuhuLog() {
  const json = await ambilJSON('/api/suhu-log', 'Gagal mengambil log suhu');
  return json.log || [];
}