import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type AdminDashboardLayoutProps = {
  children: ReactNode;
};

const adminNavGroups = [
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Admin Hub', path: '/admin-dashboard', icon: 'ri-shield-flash-line' },
      { label: 'User Access & Roles', path: '/admin-dashboard/users', icon: 'ri-user-settings-line' },
    ],
  },
];

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="border-b border-slate-800/80 px-6 py-5 flex items-center justify-between bg-[#070D18]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <i className="ri-shield-keyhole-line" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-white tracking-wider">IT QUEST</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">ADMIN</span>
            </div>
            <p className="text-[11px] text-slate-400">Pateros Tech College</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {adminNavGroups.map((group) => (
          <section key={group.label}>
            <p className="mb-2.5 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === '/admin-dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <i className={`${item.icon} text-base`} />
                    <span>{item.label}</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-slate-600 text-sm" />
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="border-t border-slate-800/80 p-4 space-y-3 bg-[#070D18]">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">System Administrator</p>
            <p className="text-[10px] text-slate-400 truncate">Governance & Security</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
        >
          <i className="ri-logout-box-r-line text-sm" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-200 font-body flex">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-[#0B1220] lg:flex">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#0B1220] transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent()}
      </aside>

      {/* Main Container */}
      <main className="min-h-screen flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070D18]/90 px-4 py-3.5 backdrop-blur-md md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 hover:text-white"
            >
              <i className="ri-menu-line text-lg" />
            </button>
            <div>
              <p className="text-[11px] text-emerald-400 font-mono font-semibold hidden sm:block">PTC IT QUEST // ADMIN CONSOLE</p>
              <h2 className="text-base font-extrabold text-white tracking-wide">Admin Dashboard</h2>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
