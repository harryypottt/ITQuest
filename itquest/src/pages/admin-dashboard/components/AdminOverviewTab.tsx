import { useEffect, useState } from 'react';

interface AdminOverviewTabProps {
  onSwitchToUsers: () => void;
}

export default function AdminOverviewTab({ onSwitchToUsers }: AdminOverviewTabProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalProfessors: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin stats:', err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: 'Total Active Users',
      value: stats.totalUsers,
      icon: 'ri-group-line',
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: 'ri-time-line',
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      action: onSwitchToUsers,
      actionText: 'Review Requests',
    },
    {
      title: 'Faculty Members',
      value: stats.totalProfessors,
      icon: 'ri-user-star-line',
      color: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
    {
      title: 'System Administrators',
      value: stats.totalAdmins,
      icon: 'ri-shield-user-line',
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-5 backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.borderColor} bg-slate-900/60 ${card.textColor}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-800" />
              ) : (
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
              )}

              {card.action && (
                <button
                  type="button"
                  onClick={card.action}
                  className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white transition cursor-pointer"
                >
                  <span>{card.actionText}</span>
                  <i className="ri-arrow-right-line" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <i className="ri-user-settings-line" />
              <span>USER GOVERNANCE</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">Manage User Access & Roles</h3>
            <p className="mt-1 text-xs text-slate-400">
              Approve new student and faculty registrations, promote professors to administrators, or suspend inactive accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToUsers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <span>Open User Access Portal</span>
            <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <i className="ri-shield-keyhole-line" />
              <span>SECURITY LOGS</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">System Audit Trail</h3>
            <p className="mt-1 text-xs text-slate-400">
              Review history of administrative actions, account promotions, status modifications, and security events.
            </p>
          </div>
          <div className="flex items-center text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
            <span>Audit Trail Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

