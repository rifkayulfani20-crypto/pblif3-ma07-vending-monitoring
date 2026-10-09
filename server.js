const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// Sesi login dianggap kedaluwarsa setelah 30 menit (NFR-03: session timeout otomatis)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

app.use(cors());
app.use(express.json());

const file = (nama) => path.join(__dirname, nama);
const bacaJSON = (nama) => JSON.parse(fs.readFileSync(file(nama), 'utf-8'));

app.get('/', (req, res) => {
  res.send('Server monitoring vending machine aktif!');
});

// Modul monitoring bersifat read-only: data mesin hanya dibaca, tidak diubah dari sini.
app.get('/api/mesin', (req, res) => {
  res.json(bacaJSON('data.json'));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // FR-02: validasi input dasar sebelum cek kredensial
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  const users = bacaJSON('users.json').users;
  const user = users.find((u) => u.username === username);

  // FR-02: pesan kesalahan jika username/password salah
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Username atau password salah' });
  }

  res.json({
    success: true,
    nama: user.nama,
    role: user.role,
    loginAt: Date.now(),
    sessionTimeoutMs: SESSION_TIMEOUT_MS,
  });
});

// Tanggal lokal (YYYY-MM-DD), bukan UTC, supaya tidak mundur sehari di WIB
function formatTanggalLokal(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Mengubah offset "hariKe" (0 = hari ini, 1 = kemarin, dst) jadi tanggal aktual (YYYY-MM-DD).
// Dipakai supaya data transaksi contoh selalu relevan dengan "hari berjalan" (FR-03),
// tidak peduli kapan project ini dijalankan/didemokan.
function tanggalDariHariKe(hariKe) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - hariKe);
  return formatTanggalLokal(d);
}

// Endpoint lama (tetap dipertahankan)
app.get('/api/transaksi', (req, res) => {
  const data = bacaJSON('transaksi.json');
  const transaksi = data.transaksi.map((t) => ({
    ...t,
    tanggal: tanggalDariHariKe(t.hariKe),
  }));
  res.json({ transaksi });
});

// MOCK PC9: meniru GET /api/v1/orders.
// Hapus blok ini setelah API PC9 asli tersedia.
app.get('/api/v1/orders', (req, res) => {
  const data = bacaJSON('transaksi.json');
  const STATUS = { sukses: 'completed', gagal: 'failed', refund: 'refunded' };

  const orders = data.transaksi.map((t) => {
    const d = new Date();
    d.setHours(t.jam, 0, 0, 0);
    d.setDate(d.getDate() - t.hariKe);
    return {
      id: t.id,
      machine_name: t.mesin,
      product_name: t.produk,
      total_amount: t.harga,
      status: STATUS[t.status] || t.status,
      payment_method: t.metode,
      is_simulated: t.id % 4 === 0, // contoh saja supaya ada campuran data simulasi
      created_at: d.toISOString(),
    };
  });

  res.json({ data: orders });
});

app.get('/api/suhu-log', (req, res) => {
  res.json(bacaJSON('suhu_log.json'));
});

app.get('/api/produk', (req, res) => {
  res.json(bacaJSON('produk.json'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});