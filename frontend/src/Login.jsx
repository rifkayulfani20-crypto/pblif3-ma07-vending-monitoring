import { useState } from 'react';
import { BASE_URL } from './api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        onLogin(data.nama, data.role, data.loginAt, data.sessionTimeoutMs);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch {
      setError('Tidak bisa terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 p-6">
      {/* cahaya dekorasi */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/60 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/60 blur-3xl"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl p-9 w-[340px] shadow-2xl shadow-sky-400/30 border border-sky-100 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-400/40">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="4" y1="9" x2="20" y2="9" />
              <circle cx="8" cy="13.5" r="1" fill="white" stroke="none" />
              <circle cx="12" cy="13.5" r="1" fill="white" stroke="none" />
              <circle cx="16" cy="13.5" r="1" fill="white" stroke="none" />
              <rect x="9" y="17" width="6" height="3" rx="1" />
            </svg>
          </span>
          <div>
            <p className="font-bold text-slate-900">Sistem Monitoring</p>
            <p className="text-[11px] text-slate-500">Mesin Penjual Makanan Panas</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-4">Masuk ke Dashboard</h2>

        {error && (
          <p className="bg-red-50 text-red-500 text-sm px-3.5 py-2.5 rounded-lg mb-2" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="username" className="text-sm text-slate-600 font-medium mt-3 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username"
          autoComplete="username"
          required
          className="px-3.5 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <label htmlFor="password" className="text-sm text-slate-600 font-medium mt-3 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="px-3.5 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>

        <p className="text-[11px] text-slate-500 mt-5 text-center leading-relaxed">
          Gunakan akun pengelola yang terdaftar. Sesi berakhir otomatis setelah 30 menit tidak aktif.
        </p>
      </form>
    </div>
  );
}

export default Login;