import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = 'indigo',
  size = 'sm',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const gradientColors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-400',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
    violet: 'bg-gradient-to-r from-violet-500 to-purple-400',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/40 ${heightClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${gradientColors[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  progress,
  size = 72,
  strokeWidth = 6,
  color = '#6366f1',
  children,
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {children || <span className="text-xs font-bold text-slate-200">{Math.round(clamped)}%</span>}
      </div>
    </div>
  );
}
