import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Building2,
  Flame,
  Zap,
  GitPullRequest,
  CheckCircle2,
  Award,
  Calendar,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, DeveloperStatus } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export function ProfileDrawer({ isOpen, onClose, user }: ProfileDrawerProps) {
  const [statusMsg, setStatusMsg] = useState(user.statusMessage);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#0b0f19] border-l border-slate-800 p-6 flex flex-col justify-between h-full z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Developer Profile</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Bio Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center mb-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-full mx-auto p-[2px] bg-gradient-to-tr from-indigo-500 via-cyan-400 to-violet-500 mb-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs font-mono text-indigo-300">@{user.handle}</p>
            <p className="text-xs text-slate-400 mt-1">{user.title}</p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {user.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {user.location}
              </span>
            </div>

            {/* Status Message pill */}
            <div className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs text-slate-300">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold mb-1">
                Current Focus
              </div>
              <p className="text-slate-200">{statusMsg}</p>
            </div>
          </div>

          {/* KPI Mini Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <Flame className="w-4 h-4" />
                <span>Streak</span>
              </div>
              <div className="text-xl font-bold text-white">{user.streakDays} Days</div>
              <div className="text-[11px] text-slate-500">Record: {user.bestStreakDays} days</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
                <Zap className="w-4 h-4" />
                <span>Prod. Score</span>
              </div>
              <div className="text-xl font-bold text-white">{user.productivityScore}/100</div>
              <div className="text-[11px] text-emerald-400">Top 5% Engineering</div>
            </div>
          </div>

          {/* Weekly Focus Goal */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-6">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                Weekly Deep Work Target
              </span>
              <span className="font-mono text-indigo-300 font-semibold">
                {user.weeklyFocusHours}h / {user.focusGoalHours}h
              </span>
            </div>
            <ProgressBar
              progress={(user.weeklyFocusHours / user.focusGoalHours) * 100}
              color="indigo"
              size="sm"
            />
          </div>

          {/* Engineering Badges */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Achievements & Badges
              </h4>
              <span className="text-xs text-indigo-400 font-mono">4 Earned</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5 hover:border-slate-700 transition-colors"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{badge.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
