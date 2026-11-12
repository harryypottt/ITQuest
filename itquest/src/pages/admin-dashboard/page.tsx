import { useState } from 'react';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminOverviewTab from './components/AdminOverviewTab';
import AuditLogsTab, { AuditLog } from './components/AuditLogsTab';
import { useNavigate } from 'react-router-dom';

type AdminTabKey = 'overview' | 'audit_logs';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const navigate = useNavigate();

  // SAMPLE SYSTEM STATS
  const stats = {
    totalUsers: 124,
    pendingApprovals: 5,
    totalProfessors: 12,
    totalAdmins: 3,
  };

  // AUDIT LOGS STATE
  const [logs] = useState<AuditLog[]>([
    { id: 1, adminName: 'System Admin', action: 'Approved User Account', targetUser: 'John Doe', timestamp: '2026-11-09 10:15 AM', severity: 'info', details: 'User account was approved after review and compliance checks.' },
    { id: 2, adminName: 'System Admin', action: 'Promoted User to Admin', targetUser: 'Dr. Maria Clara', timestamp: '2026-11-08 02:30 PM', severity: 'warning', details: 'Administrative authority was granted to Dr. Maria Clara after review.' },
    { id: 3, adminName: 'System Admin', action: 'Rejected User Registration', targetUser: 'Unknown User', timestamp: '2026-11-07 09:00 AM', severity: 'danger', details: 'User registration was rejected after administrative review.' },
  ]);

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        {/* Banner with reduced padding */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#070D18]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity filter blur-[0.5px]"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D18] via-[#070D18]/90 to-transparent" />

          <div className="relative z-10 p-4 md:p-5">
            <p className="text-[11px] font-semibold text-emerald-400 font-mono">ADMIN PORTAL // GOVERNANCE</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              System Administration Hub
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-normal">
              Monitor overall platform statistics, system health, and review administrative audit logs.
            </p>
          </div>
        </div>

        {/* Tab Buttons Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B1220]/90 border border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#10b981] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className="ri-dashboard-line text-sm" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audit_logs'
                ? 'bg-[#10b981] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className="ri-history-line text-sm" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-10">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              {...({
                totalUsers: stats.totalUsers,
                pendingApprovals: stats.pendingApprovals,
                totalProfessors: stats.totalProfessors,
                totalAdmins: stats.totalAdmins,
                onSwitchToUsers: () => navigate('/admin-dashboard/users'),
              } as any)}
            />
          )}

          {activeTab === 'audit_logs' && <AuditLogsTab {...({ logs } as any)} />}
        </div>

      </div>
    </AdminDashboardLayout>
  );
}

