import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles, Coffee, Target, Volume2, VolumeX } from 'lucide-react';
import { CircularProgress } from '@/components/ui/ProgressBar';

interface FocusTimerProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSetDuration?: (seconds: number) => void;
}

export function FocusTimer({
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
}: FocusTimerProps) {
  const [mode, setMode] = useState<'deep_work' | 'pomodoro' | 'quick_fix' | 'short_break'>('deep_work');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modeTargets = {
    deep_work: 50 * 60, // 50 mins
    pomodoro: 25 * 60,  // 25 mins
    quick_fix: 15 * 60, // 15 mins
    short_break: 5 * 60, // 5 mins
  };

  const currentTargetSeconds = modeTargets[mode];
  const progress = Math.min(100, (timerSeconds / currentTargetSeconds) * 100);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Deep Work Focus Chamber</h3>
              <p className="text-xs text-slate-400">Flow state tracker & timer</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors"
            title={soundEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Mode selector pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => setMode('deep_work')}
            className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'deep_work'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50m Flow
          </button>
          <button
            onClick={() => setMode('pomodoro')}
            className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'pomodoro'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            25m Sprint
          </button>
          <button
            onClick={() => setMode('short_break')}
            className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'short_break'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5m Break
          </button>
        </div>

        {/* Radial Progress & Clock Display */}
        <div className="flex flex-col items-center justify-center my-2">
          <CircularProgress
            progress={progress}
            size={160}
            strokeWidth={10}
            color={progress >= 100 ? '#10b981' : '#6366f1'}
          >
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-white tracking-tight">
                {formatTime(timerSeconds)}
              </div>
              <div className="text-[11px] font-mono text-indigo-300 mt-0.5">
                Target: {formatTime(currentTargetSeconds)}
              </div>
            </div>
          </CircularProgress>
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={onResetTimer}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          onClick={onToggleTimer}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg active:scale-95 ${
            isTimerRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
          }`}
        >
          {isTimerRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Start Focus Session
            </>
          )}
        </button>
      </div>
    </div>
  );
}
