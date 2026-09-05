import React, { useState, useEffect } from 'react';
import {
  Search,
  Command,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Menu,
  Check,
  ChevronDown,
  Moon,
  Zap,
  Flame,
  ShieldCheck,
  Clock,
  Loader2,
  X,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
} from 'lucide-react';
import { UserProfile, DeveloperStatus } from '@/types';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileNav: () => void;
  onOpenProfile: () => void;
  onOpenNewTask: () => void;
  isLoadingState: boolean;
  onToggleLoadingState: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  isAuthenticated?: boolean;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export function Header({
  user,
  searchQuery,
  onSearchChange,
  onOpenMobileNav,
  onOpenProfile,
  onOpenNewTask,
  isLoadingState,
  onToggleLoadingState,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  isAuthenticated = false,
  onOpenAuthModal,
  onLogout,
}: HeaderProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DeveloperStatus>(user.statusState);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statusOptions: { value: DeveloperStatus; label: string; color: string; desc: string }[] = [
    { value: 'focus', label: 'Deep Focus', color: 'bg-violet-400', desc: 'Muted alerts & focus tracker on' },
    { value: 'coding', label: 'In Flow / Coding', color: 'bg-emerald-400', desc: 'Actively building features' },
    { value: 'reviewing', label: 'Reviewing PRs', color: 'bg-cyan-400', desc: 'Inspecting code submissions' },
    { value: 'meeting', label: 'In Sprint Standup', color: 'bg-amber-400', desc: 'Available in 20 mins' },
    { value: 'away', label: 'Away / AFK', color: 'bg-slate-400', desc: 'Stepped away from desk' },
  ];

  const currentStatusObj = statusOptions.find((s) => s.value === currentStatus) || statusOptions[0];

  const notificationsList = [
    {
      id: 1,
      title: 'PR #142 Merged',
      desc: 'Sarah Chen merged token stream compression into main',
      time: '12m ago',
      unread: true,
      color: 'text-emerald-400',
    },
    {
      id: 2,
      title: 'Review Requested',
      desc: 'Marcus Vance requested review on Kubernetes mesh egress policy',
      time: '45m ago',
      unread: true,
      color: 'text-cyan-400',
    },
    {
      id: 3,
      title: 'Benchmark Passed',
      desc: 'Vector similarity search p99 latency dropped to 3.2ms',
      time: '2h ago',
      unread: true,
      color: 'text-indigo-400',
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#080c14]/85 backdrop-blur-xl px-4 lg:px-8 py-3 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-slate-800"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, projects, PRs, or tags... (Press / to focus)"
              className="w-full pl-10 pr-10 py-2 rounded-xl text-sm bg-slate-900/90 text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Focus Timer, Status, Skeletons Toggle, Notifications, User */}
        <div className="flex items-center gap-2.5 md:gap-3.5">
          {/* Quick Focus Timer Widget in Header */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-indigo-400 animate-spin' : 'text-slate-400'}`} />
            <span className="font-mono text-xs font-semibold text-slate-200">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={onToggleTimer}
                title={isTimerRunning ? 'Pause Deep Focus' : 'Start Deep Focus'}
                className={`p-1 rounded-md transition-colors ${
                  isTimerRunning
                    ? 'text-amber-400 hover:bg-amber-400/10'
                    : 'text-emerald-400 hover:bg-emerald-400/10'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onResetTimer}
                title="Reset Stopwatch"
                className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Loading Skeleton Simulation Toggle */}
          <button
            onClick={onToggleLoadingState}
            title="Toggle Skeleton Loaders to test UI Loading States"
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isLoadingState
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            {isLoadingState ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Loading ON</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulate Load</span>
              </>
            )}
          </button>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${currentStatusObj.color}`} />
              <span>{currentStatusObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                  Developer Status
                </div>
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setCurrentStatus(opt.value);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      currentStatus === opt.value
                        ? 'bg-indigo-600/20 text-indigo-200 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                      <div>
                        <div>{opt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{opt.desc}</div>
                      </div>
                    </div>
                    {currentStatus === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadNotifications(0);
              }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#080c14] animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 mb-2">
                  <span className="text-xs font-semibold text-slate-200">Recent Notifications</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    Live Stream
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${notif.color}`}>{notif.title}</span>
                        <span className="text-[10px] text-slate-500">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{notif.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all group"
              >
                <div className="relative">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-400 transition-all"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#080c14] ${currentStatusObj.color}`} />
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white leading-none">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">@{user.handle}</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal?.('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
