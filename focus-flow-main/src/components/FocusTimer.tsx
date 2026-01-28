import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addSession, getTodayStats } from '@/lib/storage';

const FocusTimer: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    const stats = getTodayStats();
    setSessions(stats.sessions);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session complete
      const duration = mode === 'focus' ? focusDuration : breakDuration;
      addSession(duration, mode);
      
      if (mode === 'focus') {
        setSessions((prev) => prev + 1);
        setMode('break');
        setTimeLeft(breakDuration);
      } else {
        setMode('focus');
        setTimeLeft(focusDuration);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration : breakDuration);
  };

  const switchMode = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      setMode('focus');
      setTimeLeft(focusDuration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'focus' ? focusDuration : breakDuration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center fade-in">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={mode === 'focus' ? 'accent' : 'outline'}
          onClick={() => { setMode('focus'); setTimeLeft(focusDuration); setIsRunning(false); }}
          className="min-w-28"
        >
          Focus
        </Button>
        <Button
          variant={mode === 'break' ? 'accent' : 'outline'}
          onClick={() => { setMode('break'); setTimeLeft(breakDuration); setIsRunning(false); }}
          className="min-w-28"
        >
          <Coffee className="w-4 h-4 mr-2" />
          Break
        </Button>
      </div>

      {/* Timer Circle */}
      <div className="relative w-80 h-80 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            strokeWidth="12"
            className="timer-ring-bg"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            strokeWidth="12"
            className={`timer-ring ${isRunning ? 'pulse-ring' : ''}`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-foreground mb-2">
            {formatTime(timeLeft)}
          </span>
          <span className="text-lg text-muted-foreground capitalize">
            {mode} {mode === 'focus' ? 'Time' : 'Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <Button
          size="lg"
          variant="outline"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          size="xl"
          variant="accent"
          onClick={toggleTimer}
          className="min-w-40"
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-6 h-6 mr-2" />
              Start
            </>
          )}
        </Button>
      </div>

      {/* Sessions Counter */}
      <div className="glass-card text-center px-8 py-4">
        <p className="text-sm text-muted-foreground mb-1">Today's Sessions</p>
        <p className="text-3xl font-bold text-foreground">{sessions}</p>
      </div>
    </div>
  );
};

export default FocusTimer;
