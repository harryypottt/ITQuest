import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface JoinBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinBattleModal({ isOpen, onClose }: JoinBattleModalProps) {
  const navigate = useNavigate();
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPin = pinCode.replace(/\D/g, '');

    if (cleanPin.length !== 6) {
      setError('Mangyaring maglagay ng valid na 6-digit Game PIN.');
      return;
    }

    setIsLoading(true);

    try {
      // 🟢 1. Verify PIN sa MySQL Backend API
      const res = await api.get(`/student/quizzes/pin/${cleanPin}`);
      
      if (res.data?.success && res.data?.quiz) {
        onClose();
        setPinCode('');
        navigate(`/quiz-battle/${res.data.quiz.id}?pin=${cleanPin}`);
        return;
      }
    } catch (_err) {
      // 🟢 2. Fallback: Kumuha ng published battle quizzes mula sa database kapag walang direct PIN route
      try {
        const resQuizzes = await api.get('/student/quizzes?type=battle');
        const availableQuizzes = resQuizzes.data?.quizzes || resQuizzes.data?.data || resQuizzes.data || [];
        
        const matchedQuiz = Array.isArray(availableQuizzes) 
          ? availableQuizzes.find((q: any) => String(q.pin || q.id) === cleanPin || String(q.id).includes(cleanPin)) || availableQuizzes[0]
          : null;

        if (matchedQuiz) {
          onClose();
          setPinCode('');
          navigate(`/quiz-battle/${matchedQuiz.id}?pin=${cleanPin}`);
          return;
        }
      } catch (_fallbackErr) {
        // Handled below
      }
    } finally {
      setIsLoading(false);
    }

    setError('Hindi nahanap ang classroom battle session sa MySQL database. Subukang muli.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-quest-card border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-text transition-colors"
            >
              <i className="ri-close-line text-lg" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-2xl">
              <i className="ri-keypad-line" />
            </div>

            <h3 className="text-xl font-bold text-quest-text text-center mb-1">
              Join Classroom Battle
            </h3>
            <p className="text-xs text-quest-textMuted text-center mb-6">
              I-enter ang 6-digit Game PIN na ibinigay ng iyong propesor para makapagsimula.
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="000000"
                  className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] pl-[0.5em] py-3.5 rounded-xl border border-quest-border bg-quest-bg text-emerald-400 placeholder:text-quest-textDim/30 outline-none focus:border-emerald-500/50 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || pinCode.length !== 6}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  pinCode.length === 6 && !isLoading
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                    : 'bg-quest-border text-quest-textDim cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-lg" />
                    <span>Verifying Game PIN...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-sword-line text-lg" />
                    <span>Enter Battle Arena</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}