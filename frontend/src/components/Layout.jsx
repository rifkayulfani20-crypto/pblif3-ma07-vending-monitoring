import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const MENU = [
  { path: '/', label: 'Dashboard' },
  { path: '/data-mesin', label: 'Data Mesin' },
  { path: '/produk', label: 'Produk' },
  { path: '/transaksi', label: 'Transaksi' },
  { path: '/laporan', label: 'Laporan' },
  { path: '/revenue', label: 'Revenue (Executive)' },
];

const JUDUL = {
  '/': 'Dashboard Monitoring',
  '/data-mesin': 'Data Mesin',
  '/produk': 'Produk',
  '/transaksi': 'Transaksi',
  '/laporan': 'Laporan',
  '/revenue': 'Executive Dashboard',
};

function Layout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-blue-950 to-slate-900 text-white p-5 print:hidden">
        <div className="flex items-center gap-3 mb-8 px-1">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-2xl shadow-lg shadow-sky-500/30">🔥</span>
          <div>
            <p className="text-sm font-bold">Sistem Monitoring</p>
            <p className="text-[11px] text-sky-300/70 mt-0.5">Mesin Penjual Makanan Panas</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {MENU.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-sky-100/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-8">
        <div className="max-w-[1400px] mx-auto">
          <header className="flex justify-between items-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900">{JUDUL[pathname] || 'Dashboard Monitoring'}</h1>
            <div className="flex items-center gap-4 text-sm print:hidden">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold">
                {(user || '?').charAt(0).toUpperCase()}
              </span>
              <span className="font-medium">{user}</span>
              <span className="px-2.5 py-1 rounded-full bg-sky-100 text-blue-700 text-xs font-semibold">
                Pengelola
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border border-sky-200 rounded-lg text-sm font-semibold text-blue-700 hover:bg-sky-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;