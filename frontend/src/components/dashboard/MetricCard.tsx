import React from 'react';
import {
  Clock,
  GitPullRequest,
  GitCommit,
  Zap,
  CheckCircle,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { MetricCardData } from '@/types';

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="w-5 h-5" />;
      case 'git-pull-request':
        return <GitPullRequest className="w-5 h-5" />;
      case 'git-commit':
        return <GitCommit className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'check-circle':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/90 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div
        className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${metric.color} pointer-events-none group-hover:opacity-40 transition-opacity`}
      />

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {metric.title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border bg-gradient-to-br ${metric.color}`}
        >
          {getIcon(metric.icon)}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {metric.value}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {getTrendIcon(metric.trend)}
          <span
            className={
              metric.trend === 'up'
                ? 'text-emerald-400 font-medium'
                : metric.trend === 'down'
                ? 'text-rose-400 font-medium'
                : 'text-slate-400'
            }
          >
            {metric.change}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{metric.subtext}</span>
      </div>
    </div>
  );
}
