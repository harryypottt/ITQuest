import { useEffect, useState } from 'react';

export type AuditLog = {
  id: number;
  adminName: string;
  action: string;
  targetUser: string;
  details: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'danger' | 'success';
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/audit-logs');
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getBadgeStyle = (action: string) => {
    if (action.includes('APPROVE') || action.includes('ENABLE')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    if (action.includes('REJECT') || action.includes('DISABLE')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
    if (action.includes('PROMOTE')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
    return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">System Audit Trail</h2>
          <p className="text-xs text-gray-400">Live logs of administrative actions executed across IT Quest</p>
        </div>
        <button
          type="button"
          onClick={fetchLogs}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
        >
          <i className="ri-refresh-line" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-gray-500">Loading audit history...</div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500">No audit activity logged yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-3 font-semibold">Timestamp</th>
                <th className="px-3 py-3 font-semibold">Admin</th>
                <th className="px-3 py-3 font-semibold">Action</th>
                <th className="px-3 py-3 font-semibold">Target User</th>
                <th className="px-3 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 font-mono text-[11px] text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 font-bold text-white">{log.adminName}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-200">{log.targetUser}</td>
                  <td className="px-3 py-3 text-gray-400 text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

