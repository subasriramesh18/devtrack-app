import React, { useState } from 'react';
import {
  User,
  Building2,
  MapPin,
  Flame,
  Zap,
  GitPullRequest,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  Code2,
  TrendingUp,
  Share2,
  Edit3,
  Check,
  Globe,
  Mail,
  GitBranch,
} from 'lucide-react';
import { UserProfile, DailyActivity } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProfileViewProps {
  user: UserProfile;
  weeklyActivity: DailyActivity[];
}

export function ProfileView({ user, weeklyActivity }: ProfileViewProps) {
  const [statusText, setStatusText] = useState(user.statusMessage);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveStatus = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Profile Overview */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 relative overflow-hidden">
        {/* Background gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-cyan-900/50 pointer-events-none" />

        <div className="relative pt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-[3px] bg-gradient-to-tr from-indigo-500 via-cyan-400 to-violet-500 shadow-2xl relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[13px] object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#080c14]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{user.name}</h1>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  STAFF ARCHITECT
                </span>
              </div>
              <p className="text-sm font-mono text-indigo-300">@{user.handle}</p>
              <p className="text-xs text-slate-400 max-w-md">{user.title}</p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub Connected
            </a>
          </div>
        </div>

        {/* Status Message Editor */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Live Focus Status
            </span>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Updated successfully
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-indigo-500 text-white outline-none"
              />
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer group transition-colors"
            >
              <p className="text-xs text-slate-200">{statusText}</p>
              <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </div>
          )}
        </div>
      </div>

      {/* Grid: Stats & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Flame className="w-4 h-4" />
            <span>Coding Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">{user.streakDays} Days</div>
          <p className="text-xs text-slate-400 mt-1">All-time record: {user.bestStreakDays} days</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            <Zap className="w-4 h-4" />
            <span>Productivity Index</span>
          </div>
          <div className="text-3xl font-bold text-white">{user.productivityScore}/100</div>
          <p className="text-xs text-emerald-400 mt-1">Top 5% Engineering Velocity</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <GitPullRequest className="w-4 h-4" />
            <span>PRs Merged</span>
          </div>
          <div className="text-3xl font-bold text-white">{user.prsMerged} PRs</div>
          <p className="text-xs text-slate-400 mt-1">24 Code reviews completed</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-2">
            <Clock className="w-4 h-4" />
            <span>Weekly Focus Hours</span>
          </div>
          <div className="text-3xl font-bold text-white">{user.weeklyFocusHours} hrs</div>
          <p className="text-xs text-slate-400 mt-1">Target: {user.focusGoalHours} hrs / week</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Engineering Recognition & Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3.5 hover:border-slate-700 transition-colors"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{badge.description}</p>
                <span className="inline-block text-[10px] font-mono text-slate-500 mt-2">
                  Unlocked: {badge.dateEarned}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
