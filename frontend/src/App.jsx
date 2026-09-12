import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [mesin, setMesin] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/mesin')
      .then((res) => res.json())
      .then((data) => setMesin(data.mesin));
  }, []);

  const aktif = mesin.filter((m) => m.status === 'online').length;
  const offline = mesin.filter((m) => m.status === 'offline').length;
  const suhuNormal = mesin.filter((m) => m.kondisi === 'normal').length;
  const stokMenipis = mesin.filter((m) => m.stok <= 10).length;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🔥</span>
          <div>
            <p className="brand-title">Sistem Monitoring</p>
            <p className="brand-sub">Mesin Penjual Makanan Panas</p>
          </div>
        </div>
        <nav>
          <a className="nav-item active">Dashboard</a>
          <a className="nav-item">Data Mesin</a>
          <a className="nav-item">Produk</a>
          <a className="nav-item">Stok</a>
          <a className="nav-item">Monitoring Suhu</a>
          <a className="nav-item">Transaksi</a>
          <a className="nav-item">Laporan</a>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>Dashboard Monitoring</h1>
          <div className="topbar-right">
            <span>🔔</span>
            <span>Admin</span>
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <p className="stat-label">Mesin Aktif</p>
            <p className="stat-value" style={{ color: '#0f9d58' }}>{aktif}</p>
            <p className="stat-sub">dari {mesin.length} mesin</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Mesin Offline</p>
            <p className="stat-value" style={{ color: '#e24b4a' }}>{offline}</p>
            <p className="stat-sub">dari {mesin.length} mesin</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Suhu Normal</p>
            <p className="stat-value" style={{ color: '#378add' }}>{suhuNormal}</p>
            <p className="stat-sub">dari {mesin.length} mesin</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Stok Menipis</p>
            <p className="stat-value" style={{ color: '#ef9f27' }}>{stokMenipis}</p>
            <p className="stat-sub">dari {mesin.length} mesin</p>
          </div>
        </section>

        <section className="machines-section">
          <h2>Monitoring Mesin</h2>
          <div className="machines-grid">
            {mesin.map((m) => (
              <div key={m.id} className="machine-card">
                <div className="machine-header">
                  <p className="machine-name">{m.nama}</p>
                  <span className={`badge ${m.status}`}>{m.status === 'online' ? 'Online' : 'Offline'}</span>
                </div>
                <p className="machine-location">{m.lokasi}</p>
                <div className="machine-stats">
                  <span>🌡️ {m.suhu}°C</span>
                  <span>📦 Stok {m.stok}</span>
                </div>
                <p className="machine-update">Terakhir update: {m.update}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;