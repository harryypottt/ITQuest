import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  faculty: 'Faculty',
  student: 'Student',
};

interface AccessDeniedProps {
  requiredRoles?: string[];
  userRole?: string;
  attemptedPath?: string;
}

export default function AccessDenied({ requiredRoles = [], userRole, attemptedPath }: AccessDeniedProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const currentRole = userRole || 'student';
  const requiredText = requiredRoles.length
    ? requiredRoles.map((r) => roleLabels[r] || r).join(' or ')
    : 'an authorized role';

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-quest-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="p-8 md:p-10 rounded-2xl bg-quest-card border border-quest-border text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <i className="ri-shield-cross-line text-rose-400 text-4xl" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-xs font-semibold tracking-wide text-rose-400 uppercase">
              Error 403 — Forbidden
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-quest-text mb-3 font-display">
            Access Denied
          </h1>

          <p className="text-sm text-quest-textMuted mb-6 leading-relaxed">
            You do not have permission to access this page. This area is restricted to{' '}
            <span className="text-quest-text font-medium">{requiredText}</span> accounts only.
          </p>

          {/* Role comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
            <div className="p-4 rounded-xl bg-quest-bg border border-quest-border">
              <div className="text-xs text-quest-textDim mb-1.5">Your Role</div>
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-quest-primary" />
                <span className="text-sm font-semibold text-quest-text">
                  {roleLabels[currentRole] || currentRole}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-quest-bg border border-quest-border">
              <div className="text-xs text-quest-textDim mb-1.5">Required Role</div>
              <div className="flex items-center gap-2">
                <i className="ri-lock-line text-amber-400" />
                <span className="text-sm font-semibold text-quest-text">{requiredText}</span>
              </div>
            </div>
          </div>

          {attemptedPath && (
            <div className="mb-6 p-3 rounded-lg bg-quest-bg border border-quest-border/60">
              <div className="text-xs text-quest-textDim mb-1">Requested Path</div>
              <code className="text-xs text-rose-400 font-mono break-all">{attemptedPath}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-quest-primary to-quest-accent text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg" />
              Back to Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex-1 py-3 rounded-xl border border-quest-border bg-quest-bg text-quest-text text-sm font-medium hover:bg-quest-cardHover transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-logout-box-line text-lg" />
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-quest-textDim">
          If you believe you should have access, contact your platform administrator.
        </p>
      </motion.div>
    </div>
  );
}