import { useState, useEffect, useMemo } from 'react';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

export type Program = 'BSIT' | 'CCS';
export type RequestRole = 'Student' | 'Professor' | 'Admin';

export type PendingRequest = {
  id: string | number;
  name: string;
  email: string;
  role: RequestRole;
  program?: Program;
  yearLevel?: number;
  section?: string;
  specialization?: string;
  requestedAt: string;
};

export type ProcessedRequest = PendingRequest & {
  decision: 'Approved' | 'Rejected';
  processedAt: string;
};

export type ApprovedUser = PendingRequest & {
  status: 'Enabled' | 'Disabled';
  approvedAt: string;
};

const API_BASE_URL = 'http://localhost:5000/api/admin';
const INITIAL_DIRECTORY_LIMIT = 5;

export default function UserAccess() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);
  const [requestToReverse, setRequestToReverse] = useState<ProcessedRequest | null>(null);
  const [profToPromote, setProfToPromote] = useState<ApprovedUser | null>(null);
  const [adminToDemote, setAdminToDemote] = useState<ApprovedUser | null>(null);
  
  // Pending Requests Filter States
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  // User Directory Filter States (Search + Roles lang)
  const [directorySearch, setDirectorySearch] = useState('');
  const [dirRoleFilter, setDirRoleFilter] = useState('All');

  const [notice, setNotice] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_DIRECTORY_LIMIT);

  // 1. KUNIN ANG DATA MULA SA EXPRESS + MYSQL BACKEND
  const loadUsersFromDB = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/requests/pending`),
        fetch(`${API_BASE_URL}/users/approved`),
      ]);
      const pendingData = await pendingRes.json();
      const approvedData = await approvedRes.json();
      setRequests(pendingData);
      setApprovedUsers(approvedData);
    } catch (err) {
      console.error('Failed to load users from DB:', err);
    }
  };

  useEffect(() => {
    loadUsersFromDB();
  }, []);

  const yearLevels =
    programFilter === 'BSIT'
      ? [1, 2, 3, 4]
      : programFilter === 'CCS'
      ? [1, 2]
      : [];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchMatch =
        request.name.toLowerCase().includes(search.toLowerCase()) ||
        request.email.toLowerCase().includes(search.toLowerCase());
      const roleMatch = roleFilter === 'All' || request.role === roleFilter;
      const programMatch = programFilter === 'All' || request.program === programFilter;
      const yearMatch = yearFilter === 'All' || request.yearLevel === Number(yearFilter);
      return searchMatch && roleMatch && programMatch && yearMatch;
    });
  }, [requests, search, roleFilter, programFilter, yearFilter]);

  // USER DIRECTORY FILTER LOGIC (Name/Email Search + Role Filter)
  const filteredApprovedUsers = useMemo(() => {
    const query = directorySearch.trim().toLowerCase();
    return approvedUsers.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const roleMatch = dirRoleFilter === 'All' || user.role === dirRoleFilter;

      return searchMatch && roleMatch;
    });
  }, [approvedUsers, directorySearch, dirRoleFilter]);

  const adminList = useMemo(() => {
    return approvedUsers.filter((user) => user.role === 'Admin');
  }, [approvedUsers]);

  // HANDLERS SA BACKEND (API CALLS)
  async function handleDecision(id: string | number, decision: 'Approved' | 'Rejected') {
    const request = requests.find((item) => item.id === id);
    if (!request) return;
    try {
      await fetch(`${API_BASE_URL}/requests/${id}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, adminName: 'System Admin' }),
      });
      const processedRequest: ProcessedRequest = {
        ...request,
        decision,
        processedAt: new Date().toLocaleString(),
      };
      setProcessedRequests((current) => [processedRequest, ...current]);
      setNotice(`${request.name} was ${decision.toLowerCase()}.`);
      loadUsersFromDB();
    } catch (err) {
      console.error('Error recording decision:', err);
    }
  }

  async function handleReverseDecision() {
    if (!requestToReverse) return;
    const request = requestToReverse;
    try {
      await fetch(`${API_BASE_URL}/users/${request.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending', adminName: 'System Admin' }),
      });
      setProcessedRequests((current) =>
        current.filter((item) => item.id !== request.id)
      );
      setNotice(`${request.name}'s decision was reversed. Request is pending again.`);
      setRequestToReverse(null);
      loadUsersFromDB();
    } catch (err) {
      console.error('Error reversing decision:', err);
    }
  }

  async function confirmPromoteProfessor() {
    if (!profToPromote) return;
    try {
      await fetch(`${API_BASE_URL}/users/${profToPromote.id}/promote-admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotedBy: 'System Admin' }),
      });
      setNotice(`🎉 ${profToPromote.name} has been promoted to System Administrator!`);
      setProfToPromote(null);
      loadUsersFromDB();
    } catch (err) {
      console.error('Error promoting user:', err);
    }
  }

  async function confirmDemoteAdmin() {
    if (!adminToDemote) return;
    try {
      await fetch(`${API_BASE_URL}/users/${adminToDemote.id}/demote-admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName: 'System Admin' }),
      });
      setNotice(`⚠️ ${adminToDemote.name}'s Admin privileges were revoked.`);
      setAdminToDemote(null);
      loadUsersFromDB();
    } catch (err) {
      console.error('Error demoting user:', err);
    }
  }

  async function toggleUserStatus(id: string | number, currentStatus: string) {
    const nextStatus = currentStatus === 'Enabled' ? 'disabled' : 'active';
    try {
      await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, adminName: 'System Admin' }),
      });
      loadUsersFromDB();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-emerald-400 font-mono">USER MANAGEMENT</p>
          <h1 className="mt-1 text-2xl font-bold text-white">User Access & Roles</h1>
          <p className="mt-1 text-xs text-gray-400">
            Review registration requests before granting access to IT Quest.
          </p>
        </div>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-200"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="text-emerald-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. SYSTEM ADMINISTRATORS SECTION */}
        {adminList.length > 0 && (
          <section className="rounded-2xl border border-purple-500/30 bg-[#111827] p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-base border border-purple-500/30">
                  <i className="ri-shield-user-line" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Active System Administrators</h2>
                  <p className="text-xs text-gray-400">Users with elevated platform governance privileges</p>
                </div>
              </div>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                {adminList.length} Admins
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {adminList.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-purple-500/20 bg-purple-500/[0.03]"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{admin.name}</p>
                    <p className="text-[11px] text-gray-400">{admin.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminToDemote(admin)}
                    className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/15 text-[11px] font-bold text-rose-300 hover:bg-rose-500/25 transition cursor-pointer"
                  >
                    Remove Admin
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. PENDING REQUESTS SECTION */}
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-base font-semibold text-white">Pending Requests</h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Review and process new account registrations.
              </p>
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 self-start md:self-auto">
              <span className="text-xs font-bold text-amber-200">
                {requests.length} pending
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email..."
              className="min-w-0 rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 focus:border-emerald-400"
            />
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Professor">Professor</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={programFilter}
              onChange={(event) => {
                setProgramFilter(event.target.value);
                setYearFilter('All');
              }}
              className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="All">All Programs</option>
              <option value="BSIT">BSIT</option>
              <option value="CCS">CCS</option>
            </select>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              disabled={programFilter === 'All'}
              className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="All">All Year Levels</option>
              {yearLevels.map((year) => (
                <option key={year} value={year}>
                  {year === 1
                    ? '1st Year'
                    : year === 2
                    ? '2nd Year'
                    : year === 3
                    ? '3rd Year'
                    : '4th Year'}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-3 font-semibold">Applicant</th>
                  <th className="px-3 py-3 font-semibold">Role / Program</th>
                  <th className="px-3 py-3 font-semibold">Details</th>
                  <th className="px-3 py-3 font-semibold">Requested</th>
                  <th className="px-3 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-3">
                      <p className="font-bold text-white">{request.name}</p>
                      <p className="text-[11px] text-gray-400">{request.email}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          request.role === 'Admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : request.role === 'Professor'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {request.role}
                      </span>
                      {request.program && (
                        <p className="mt-1 text-[11px] text-gray-400">{request.program}</p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-300">
                      {request.yearLevel ? (
                        <>
                          <p className="font-medium">
                            Year {request.yearLevel} · {request.section}
                          </p>
                          <p className="text-[11px] text-gray-400">{request.specialization}</p>
                        </>
                      ) : (
                        <span className="text-gray-500">No student details</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-400 font-mono text-[11px]">
                      {request.requestedAt}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecision(request.id, 'Approved')}
                          className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/25 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(request.id, 'Rejected')}
                          className="rounded-lg bg-rose-500/15 px-2.5 py-1 text-xs font-bold text-rose-300 transition hover:bg-rose-500/25 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-xs text-gray-500">
                      No requests match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. USER DIRECTORY SECTION */}
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">User Directory</h2>
              <p className="mt-0.5 text-xs text-gray-400">Approved accounts in IT Quest</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              {approvedUsers.length} users
            </span>
          </div>

          {/* USER DIRECTORY FILTER BAR (CLEAN: SEARCH INPUT + ALL ROLES DROPDOWN ONLY) */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              type="text"
              value={directorySearch}
              onChange={(event) => {
                setDirectorySearch(event.target.value);
                setVisibleCount(INITIAL_DIRECTORY_LIMIT);
              }}
              placeholder="Search approved users by name or email..."
              className="min-w-0 rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 focus:border-emerald-400"
            />
            <select
              value={dirRoleFilter}
              onChange={(event) => {
                setDirRoleFilter(event.target.value);
                setVisibleCount(INITIAL_DIRECTORY_LIMIT);
              }}
              className="rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Professor">Professor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {filteredApprovedUsers.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
              <p className="text-xs text-gray-400">No approved users match your filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="mt-3 space-y-2.5">
                {filteredApprovedUsers.slice(0, visibleCount).map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'Admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : user.role === 'Professor'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role === 'Professor' && (
                        <button
                          type="button"
                          onClick={() => setProfToPromote(user)}
                          className="rounded-lg border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 text-xs font-bold text-purple-300 transition hover:bg-purple-500/25 cursor-pointer flex items-center gap-1"
                        >
                          <i className="ri-shield-user-line" />
                          <span>Make Admin</span>
                        </button>
                      )}
                      {user.role === 'Admin' && (
                        <button
                          type="button"
                          onClick={() => setAdminToDemote(user)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-xs font-bold text-rose-300 transition hover:bg-rose-500/25 cursor-pointer"
                        >
                          Remove Admin
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer transition ${
                          user.status === 'Enabled'
                            ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                            : 'border border-rose-400/20 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20'
                        }`}
                      >
                        {user.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DYNAMIC SHOW MORE / SHOW LESS BUTTON */}
              {filteredApprovedUsers.length > INITIAL_DIRECTORY_LIMIT && (
                <div className="mt-4 flex justify-center">
                  {visibleCount < filteredApprovedUsers.length ? (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(filteredApprovedUsers.length)}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
                    >
                      <span>Show More ({filteredApprovedUsers.length - visibleCount} remaining)</span>
                      <i className="ri-arrow-down-s-line text-sm" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(INITIAL_DIRECTORY_LIMIT)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 cursor-pointer"
                    >
                      <span>Show Less</span>
                      <i className="ri-arrow-up-s-line text-sm" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* 4. RECENTLY PROCESSED SECTION */}
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Recently Processed</h2>
              <p className="mt-0.5 text-xs text-gray-400">Your recent approval or rejection decisions</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              {processedRequests.length} processed
            </span>
          </div>
          {processedRequests.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
              <p className="text-xs text-gray-400">No processed requests yet.</p>
              <p className="mt-1 text-[11px] text-gray-500">Approved or rejected requests will appear here with an option to reverse.</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{request.name}</p>
                    <p className="text-[11px] text-gray-400">{request.email}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{request.processedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        request.decision === 'Approved'
                          ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                          : 'border border-rose-400/20 bg-rose-400/10 text-rose-300'
                      }`}
                    >
                      {request.decision}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRequestToReverse(request)}
                      className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20 cursor-pointer"
                    >
                      Reverse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL 1: Promote to Admin */}
        {profToPromote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-[#111827] p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xl">
                  <i className="ri-shield-user-line" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Promote to Administrator?</h3>
                  <p className="text-xs text-gray-400">Grant full System Governance permissions.</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to promote <span className="font-bold text-white">{profToPromote.name}</span> to Administrator?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfToPromote(null)}
                  className="rounded-xl border border-white/10 px-3.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmPromoteProfessor}
                  className="rounded-xl bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-400 cursor-pointer shadow-lg shadow-purple-500/20"
                >
                  Confirm Promotion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Remove Admin Access */}
        {adminToDemote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#111827] p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xl">
                  <i className="ri-user-unfollow-line" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Revoke Admin Access?</h3>
                  <p className="text-xs text-gray-400">Demote user back to Professor role.</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-white">{adminToDemote.name}</span> from System Administrators?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminToDemote(null)}
                  className="rounded-xl border border-white/10 px-3.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDemoteAdmin}
                  className="rounded-xl bg-rose-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-400 cursor-pointer shadow-lg shadow-rose-500/20"
                >
                  Revoke Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: Reverse Decision */}
        {requestToReverse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl">
              <h3 className="text-base font-bold text-white">Reverse Decision?</h3>
              <p className="mt-2 text-xs text-gray-300">
                Are you sure you want to return{' '}
                <span className="font-bold text-white">{requestToReverse.name}</span> to Pending Requests?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRequestToReverse(null)}
                  className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReverseDecision}
                  className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-gray-950 hover:bg-amber-300 cursor-pointer"
                >
                  Confirm Reverse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

