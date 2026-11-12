import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    const res = await login(email.trim(), password);

    if (res.success && res.user) {
      // Tiyakin ang eksaktong role value (case-insensitive para safe)
      const role = String(res.user.role).toLowerCase();

      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (role === 'faculty') {
        navigate('/faculty-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError(res.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-quest-bg text-quest-text">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Top navigation */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10 lg:px-16">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-quest-primary to-quest-accent shadow-lg shadow-emerald-500/20">
            <i className="ri-sword-line text-2xl text-white" />
          </div>

          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            IT<span className="text-quest-primary">Quest</span>
          </span>
        </Link>

        <Link
          to="/register"
          className="rounded-lg border border-quest-border px-4 py-2 text-sm font-semibold text-quest-text transition hover:border-quest-primary/50 hover:text-quest-primary"
        >
          Create Account
        </Link>
      </header>

      {/* Main content */}
      <section className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pb-12 pt-6 sm:px-10 lg:min-h-[calc(100vh-88px)] lg:px-16 lg:py-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left panel: platform introduction */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-quest-primary/20 bg-quest-primary/10 px-4 py-2 text-sm font-medium text-quest-primary">
              <i className="ri-sparkling-2-line" />
              Your next level starts here
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
              Learn new skills.
              <br />
              <span className="bg-gradient-to-r from-quest-primary to-quest-accent bg-clip-text text-transparent">
                Complete quests.
              </span>
              <br />
              Level up.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-quest-textMuted xl:text-lg">
              Build your IT skills through interactive learning activities,
              challenges, and quizzes. Track your progress as you work toward
              your next achievement.
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl border border-quest-border bg-quest-card/70 p-4">
                <i className="ri-book-open-line text-2xl text-quest-primary" />
                <p className="mt-3 text-sm font-semibold">Learn</p>
                <p className="mt-1 text-xs text-quest-textMuted">
                  Explore IT topics
                </p>
              </div>

              <div className="rounded-2xl border border-quest-border bg-quest-card/70 p-4">
                <i className="ri-trophy-line text-2xl text-amber-400" />
                <p className="mt-3 text-sm font-semibold">Earn</p>
                <p className="mt-1 text-xs text-quest-textMuted">
                  Collect rewards
                </p>
              </div>

              <div className="rounded-2xl border border-quest-border bg-quest-card/70 p-4">
                <i className="ri-line-chart-line text-2xl text-cyan-400" />
                <p className="mt-3 text-sm font-semibold">Improve</p>
                <p className="mt-1 text-xs text-quest-textMuted">
                  Track your growth
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-quest-textMuted">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-quest-bg bg-emerald-500/20">
                  <i className="ri-code-s-slash-line text-emerald-400" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-quest-bg bg-cyan-500/20">
                  <i className="ri-shield-check-line text-cyan-400" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-quest-bg bg-violet-500/20">
                  <i className="ri-global-line text-violet-400" />
                </div>
              </div>
              <span>Programming, networking, cybersecurity, and more.</span>
            </div>
          </motion.div>

          {/* Right panel: login form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-7 text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-quest-primary to-quest-accent shadow-lg shadow-emerald-500/20 lg:hidden">
                <i className="ri-sword-line text-3xl text-white" />
              </div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-quest-primary">
                Welcome back
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Sign in to IT Quest
              </h2>

              <p className="mt-3 text-sm leading-6 text-quest-textMuted">
                Enter your account details to continue your learning journey.
              </p>
            </div>

            <div className="rounded-2xl border border-quest-border bg-quest-card/90 p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-8">
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400"
                >
                  <i className="ri-error-warning-line mt-0.5 text-lg" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-quest-textDim" />

                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@paterostechnologicalcollege.edu.ph"
                      required
                      className="w-full rounded-xl border border-quest-border bg-quest-bg py-3.5 pl-12 pr-4 text-sm text-quest-text outline-none transition placeholder:text-quest-textDim focus:border-quest-primary focus:ring-2 focus:ring-quest-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-semibold"
                    >
                      Password
                    </label>
                    <span className="text-xs text-quest-textDim">
                      Keep your account secure
                    </span>
                  </div>

                  <div className="relative">
                    <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-quest-textDim" />

                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-quest-border bg-quest-bg py-3.5 pl-12 pr-12 text-sm text-quest-text outline-none transition placeholder:text-quest-textDim focus:border-quest-primary focus:ring-2 focus:ring-quest-primary/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-quest-textMuted transition hover:text-quest-primary focus:outline-none focus:ring-2 focus:ring-quest-primary/30"
                    >
                      <i
                        className={`${
                          showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                        } text-lg`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-quest-textMuted">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-quest-border bg-quest-bg accent-emerald-500 focus:ring-quest-primary/20"
                    />
                    Remember me
                  </label>

                  <span className="text-xs text-quest-textDim">
                    Forgot password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-quest-primary to-quest-accent py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line text-lg" />
                      Sign In
                      <i className="ri-arrow-right-line ml-1 text-lg" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-quest-border" />
                <span className="text-xs text-quest-textDim">
                  NEW TO IT QUEST?
                </span>
                <div className="h-px flex-1 bg-quest-border" />
              </div>

              <Link
                to="/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-quest-border bg-quest-bg py-3.5 text-sm font-semibold transition hover:border-quest-primary/50 hover:bg-quest-cardHover"
              >
                <i className="ri-user-add-line text-lg text-quest-primary" />
                Create an account
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-quest-textDim">
              IT Quest · Pateros Technological College
            </p>

            <p className="mt-3 text-center text-xs text-quest-textDim">
              <Link
                to="/"
                className="transition hover:text-quest-primary"
              >
                <i className="ri-arrow-left-line mr-1 inline-block" />
                Back to home
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}