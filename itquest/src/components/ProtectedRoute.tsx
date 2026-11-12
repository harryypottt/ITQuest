import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/pages/AccessDenied';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-quest-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-quest-primary" />
          <span className="text-sm text-quest-textMuted">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <AccessDenied
        requiredRoles={allowedRoles}
        userRole={user?.role}
        attemptedPath={location.pathname}
      />
    );
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // O ang iyong loading spinner
  }

  if (isAuthenticated && user) {
    // 🎯 DAPAT ROLE-BASED DIN ANG REDIRECT DITO
    const role = String(user.role).toLowerCase();

    if (role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === 'faculty') {
      return <Navigate to="/faculty-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}