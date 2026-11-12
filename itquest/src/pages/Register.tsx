import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type AccountRole = 'student' | 'professor';
type StudentProgram = 'BSIT' | 'CCS';

const roles = [
  {
    id: 'student' as const,
    title: 'Student',
    description: 'Learn new skills, complete quests, and earn rewards.',
    icon: 'ri-graduation-cap-line',
    color: 'text-emerald-400',
  },
  {
    id: 'professor' as const,
    title: 'Professor',
    description: 'Support learning and monitor student progress.',
    icon: 'ri-presentation-line',
    color: 'text-cyan-400',
  },
];

const specializations = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Database',
  'Cybersecurity',
  'UI/UX Designer',
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [role, setRole] = useState<AccountRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [program, setProgram] = useState<StudentProgram | ''>('');
  const [yearLevel, setYearLevel] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const yearLevels =
    program === 'BSIT'
      ? ['1st Year', '2nd Year', '3rd Year', '4th Year']
      : program === 'CCS'
        ? ['1st Year', '2nd Year']
        : [];

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#101a20] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10';
  const labelClass = 'mb-2 block text-sm font-medium text-gray-300';

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select an account type.');
      return;
    }
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('Please complete all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (
      role === 'student' &&
      (!program || !yearLevel || !section.trim() || !specialization)
    ) {
      setError('Please complete all student information.');
      return;
    }

    // TOGGLED BACKEND CALL PARA SA PAREHONG STUDENT AT PROFESSOR
    const res = await register({
  email: email.trim(),
  password,
  full_name: fullName.trim(),
  specialization: role === 'student' ? specialization : 'Faculty/Professor',
  program: role === 'student' ? (program as StudentProgram) : undefined,
  year_level: role === 'student' ? yearLevel : undefined,
  section: role === 'student' ? section.trim() : undefined,
  role: role, // Explicitly 'professor' o 'student'
  status: role === 'professor' ? 'pending' : 'active',
});

    if (res.success) {
      if (role === 'professor') {
        // Ipakita ang Request Pending Screen kapag totoong na-save na sa Database
        setApplicationSubmitted(true);
      } else {
        // Kapag Student, rekta agad sa Login
        navigate('/login');
      }
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  if (applicationSubmitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-quest-bg px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#101a20]/95 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
            <i className="ri-time-line text-3xl" />
          </div>
          <h1 className="mb-3 text-2xl font-bold">Request Pending</h1>
          <p className="mb-6 text-sm leading-6 text-gray-400">
            Your professor registration request has been submitted successfully and is waiting for administrator approval.
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#07110e] transition hover:bg-emerald-300"
          >
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-quest-bg px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_45%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl"
      >
        <div className="mb-7 text-center">
          <Link
            to="/login"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
          >
            <i className="ri-arrow-left-line" />
            Back to Sign In
          </Link>
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
              <i className="ri-gamepad-line text-2xl" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">
              IT <span className="text-emerald-400">Quest</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Choose your account type to get started.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101a20]/95 p-5 shadow-2xl sm:p-8">
          <div className="mb-7">
            <label className={labelClass}>I want to register as a...</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {roles.map((item) => {
                const selected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRole(item.id);
                      setError('');
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? 'border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <i className={`${item.icon} ${item.color} text-2xl`} />
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-emerald-400 bg-emerald-400 text-[#07110e]'
                            : 'border-gray-600'
                        }`}
                      >
                        {selected && <i className="ri-check-line text-xs" />}
                      </span>
                    </div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {role && (
              <motion.form
                key={role}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="border-t border-white/10 pt-6">
                  <h2 className="mb-1 text-lg font-semibold">
                    {role === 'student'
                      ? 'Student Information'
                      : 'Professor Information'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {role === 'student'
                      ? 'Enter your details and learning preferences.'
                      : 'Enter your details to request a professor account.'}
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@paterostechnologicalcollege.edu.ph"
                    className={inputClass}
                    required
                  />
                </div>

                {role === 'student' && (
                  <>
                    <div>
                      <label className={labelClass} htmlFor="program">
                        Program
                      </label>
                      <select
                        id="program"
                        value={program}
                        onChange={(e) => {
                          setProgram(e.target.value as StudentProgram | '');
                          setYearLevel('');
                          setSection('');
                        }}
                        className={inputClass}
                        required
                      >
                        <option value="">Select your program</option>
                        <option value="BSIT">
                          BSIT — Bachelor of Science in Information Technology
                        </option>
                        <option value="CCS">
                          CCS — Certificate of Computer Science
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="yearLevel">
                        Year Level
                      </label>
                      <select
                        id="yearLevel"
                        value={yearLevel}
                        onChange={(e) => {
                          setYearLevel(e.target.value);
                          setSection('');
                        }}
                        className={inputClass}
                        disabled={!program}
                        required
                      >
                        <option value="">Select year</option>
                        {yearLevels.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="section">
                        Section
                      </label>
                      <input
                        id="section"
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder={
                          program === 'BSIT'
                            ? 'e.g. BSIT-3C'
                            : program === 'CCS'
                              ? 'e.g. CCS-1A'
                              : 'Enter your section'
                        }
                        className={inputClass}
                        maxLength={30}
                        required
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Type your section as provided by your school.
                      </p>
                    </div>

                    <div>
                      <label
                        className={labelClass}
                        htmlFor="specialization"
                      >
                        Learning Specialization
                      </label>
                      <select
                        id="specialization"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className={inputClass}
                        required
                      >
                        <option value="">Choose your specialization</option>
                        {specializations.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className={labelClass} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={inputClass}
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={inputClass}
                    required
                  />
                </div>

                {role === 'professor' && (
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <div className="flex items-start gap-3">
                      <i className="ri-shield-check-line mt-0.5 text-xl text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium text-cyan-300">
                          Administrator Approval Required
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          Professor accounts require administrator approval before logging in.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                  >
                    <i className="ri-error-warning-line mr-2" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-semibold text-[#07110e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" />
                      Creating Account...
                    </>
                  ) : role === 'student' ? (
                    <>
                      Create Student Account
                      <i className="ri-arrow-right-line" />
                    </>
                  ) : (
                    <>
                      Submit Request for Approval
                      <i className="ri-arrow-right-line" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {!role && (
            <p className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center text-sm text-gray-500">
              Select Student or Professor above to continue.
            </p>
          )}

          <p className="mt-7 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-gray-600">
          IT Quest · Pateros Technological College
        </p>
      </motion.div>
    </div>
  );
}

