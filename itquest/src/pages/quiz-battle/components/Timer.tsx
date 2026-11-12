import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
  questionTimeLimit?: number;
  onQuestionTimeUp?: () => void;
  timeFreeze?: boolean;
}

export default function Timer({ totalSeconds, onTimeUp, isRunning, questionTimeLimit, onQuestionTimeUp, timeFreeze }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [questionRemaining, setQuestionRemaining] = useState(questionTimeLimit || 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onQuestionTimeUpRef = useRef(onQuestionTimeUp);

  // Keep callbacks fresh
  onTimeUpRef.current = onTimeUp;
  onQuestionTimeUpRef.current = onQuestionTimeUp;

  // Reset on totalSeconds change
  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  // Reset question timer
  useEffect(() => {
    setQuestionRemaining(questionTimeLimit || 0);
  }, [questionTimeLimit]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const tickInterval = timeFreeze ? 2 : 1;
      setRemaining((prev) => {
        if (prev <= tickInterval) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - tickInterval;
      });

      if (questionTimeLimit) {
        setQuestionRemaining((prev) => {
          if (prev <= 1) {
            setTimeout(() => onQuestionTimeUpRef.current?.(), 0);
            return questionTimeLimit || 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, questionTimeLimit, timeFreeze]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = (remaining / totalSeconds) * 100;
  const isLow = remaining <= 30;

  const qPercentage = questionTimeLimit ? (questionRemaining / questionTimeLimit) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      {/* Main timer */}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          isLow
            ? 'border-quest-danger bg-quest-danger/10 text-quest-danger'
            : 'border-quest-border bg-quest-card text-quest-text'
        }`}>
          <i className={`${isLow ? 'ri-alert-line animate-pulse' : 'ri-timer-line'} text-sm`} />
        </div>
        <div className="flex flex-col">
          <span className={`text-lg font-mono font-bold tabular-nums ${
            isLow ? 'text-quest-danger' : 'text-quest-text'
          }`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          {/* Progress bar */}
          <div className="w-24 h-1 rounded-full bg-quest-bg overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isLow ? 'bg-quest-danger' : 'bg-quest-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question timer (battle mode) */}
      {questionTimeLimit && (
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-quest-accent/10 border border-quest-accent/30 flex items-center justify-center">
            <span className={`text-[10px] font-mono font-bold tabular-nums ${
              questionRemaining <= 3 ? 'text-quest-danger' : 'text-quest-accent'
            }`}>
              {questionRemaining}
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-quest-bg overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                questionRemaining <= 3 ? 'bg-quest-danger' : 'bg-quest-accent'
              }`}
              style={{ width: `${qPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}