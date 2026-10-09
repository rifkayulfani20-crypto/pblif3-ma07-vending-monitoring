import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Landing from './Landing';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataMesin from './pages/DataMesin';
import Produk from './pages/Produk';
import Transaksi from './pages/Transaksi';
import Laporan from './pages/Laporan';
import RevenueDashboard from './pages/RevenueDashboard';

// NFR-03: sesi login otomatis berakhir setelah periode tidak aktif (default 30 menit,
// mengikuti sessionTimeoutMs yang dikirim server saat login).
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000;

function App() {
  const [user, setUser] = useState(() => sessionStorage.getItem('nama') || null);
  const timeoutMsRef = useRef(
    Number(sessionStorage.getItem('sessionTimeoutMs')) || DEFAULT_TIMEOUT_MS
  );
  const lastActivityRef = useRef(Date.now());

  const handleLogin = (nama, role, loginAt, sessionTimeoutMs) => {
    sessionStorage.setItem('nama', nama);
    sessionStorage.setItem('role', role || 'pengelola');
    sessionStorage.setItem('loginAt', String(loginAt || Date.now()));
    if (sessionTimeoutMs) {
      sessionStorage.setItem('sessionTimeoutMs', String(sessionTimeoutMs));
      timeoutMsRef.current = sessionTimeoutMs;
    }
    lastActivityRef.current = Date.now();
    setUser(nama);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nama');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('loginAt');
    sessionStorage.removeItem('sessionTimeoutMs');
    setUser(null);
  };

  // Reset penghitung waktu tidak aktif setiap ada interaksi pengguna
  useEffect(() => {
    if (!user) return undefined;

    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };
    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, markActivity));

    const interval = setInterval(() => {
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor >= timeoutMsRef.current) {
        handleLogout();
      }
    }, 15000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, markActivity));
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

    if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/data-mesin" element={<DataMesin />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/revenue" element={<RevenueDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;