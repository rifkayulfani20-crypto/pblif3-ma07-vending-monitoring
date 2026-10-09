// RBAC PBLIF3-PC9: pembatas akses halaman berdasarkan role.
// Dipakai membungkus <Route element={...}> yang mau dibatasi.
//
// Contoh pemakaian:
// <Route path="/transaksi" element={
//   <ProtectedRoute role={role} allowedRoles={['admin', 'operator']}>
//     <Transaksi />
//   </ProtectedRoute>
// } />

function ProtectedRoute({ role, allowedRoles, children }) {
  const diizinkan = allowedRoles.includes(role);

  if (!diizinkan) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center gap-3">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-2xl">🔒</span>
        <h2 className="text-lg font-bold text-slate-900">Akses Ditolak</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Halaman ini hanya bisa diakses oleh role{' '}
          <span className="font-semibold text-slate-600">{allowedRoles.join(' / ')}</span>.
          Akun kamu saat ini berperan sebagai{' '}
          <span className="font-semibold text-slate-600">{role}</span>.
        </p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
