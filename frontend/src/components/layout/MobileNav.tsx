import React from 'react';
import {
  X,
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Activity,
  User,
  Sparkles,
  GitBranch,
  Flame,
} from 'lucide-react';
import { ViewTab } from '@/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  streakDays: number;
  openTasksCount: number;
  activeProjectsCount: number;
}

export function MobileNav({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  streakDays,
  openTasksCount,
  activeProjectsCount,
}: MobileNavProps) {
  if (!isOpen) return null;

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Overview & Metrics',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'projects',
      label: 'Repositories & Hub',
      icon: <FolderGit2 className="w-5 h-5" />,
      badge: activeProjectsCount,
    },
    {
      id: 'tasks',
      label: 'Sprint Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: openTasksCount,
    },
    {
      id: 'activity',
      label: 'Telemetry & Git Feed',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Developer Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-72 max-w-[80vw] bg-[#090d16] border-r border-slate-800 p-5 flex flex-col justify-between h-full z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0d1322] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-slate-100">DevTrack Pro</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Streak card in mobile */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{streakDays}-Day Streak Active</span>
          </div>
          <p className="text-xs text-slate-400">14 days consecutive commits.</p>
        </div>
      </div>
    </div>
  );
}
