import React from 'react';
import { Code2, BarChart3, Sparkles } from 'lucide-react';
import { LanguageStat, DailyActivity } from '@/types';

interface LanguageStatsProps {
  languages: LanguageStat[];
  weeklyActivity: DailyActivity[];
}

export function LanguageStats({ languages, weeklyActivity }: LanguageStatsProps) {
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours), 8);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Language Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Tech Stack Distribution</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">77.4k LoC total</span>
        </div>

        {/* Multi-segment Progress bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800/80 p-0.5 border border-slate-700/50 mb-3">
          {languages.map((lang) => (
            <div
              key={lang.name}
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
              title={`${lang.name}: ${lang.percentage}% (${lang.linesOfCode})`}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-80"
            />
          ))}
        </div>

        {/* Language Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="text-xs font-medium text-slate-200">{lang.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Histogram */}
      <div className="pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Weekly Focus Velocity</h3>
          </div>
          <span className="text-xs font-semibold text-indigo-300">36.7 total hrs</span>
        </div>

        {/* Bar Chart Columns */}
        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
          {weeklyActivity.map((day) => {
            const heightPercent = Math.round((day.hours / maxHours) * 100);
            return (
              <div key={day.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.hours}h
                </div>
                <div className="w-full max-w-[28px] bg-slate-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 border border-slate-700/50 h-full">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
