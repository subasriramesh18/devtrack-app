import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Activity,
  Flame,
  User,
  GitBranch,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { ViewTab } from '@/types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  streakDays: number;
  openTasksCount: number;
  activeProjectsCount: number;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  streakDays,
  openTasksCount,
  activeProjectsCount,
}: SidebarProps) {
  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string | number; color?: string }[] = [
    {
      id: 'dashboard',
      label: 'Overview',
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
    <aside className="w-64 border-r border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 shrink-0 hidden lg:flex select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-100 tracking-tight">DevTrack</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-emerald-400" />
              aether-monorepo / main
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-200'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Focus & Streak Widget inside Sidebar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/40 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{streakDays}-Day Streak</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Top 5%</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Keep shipping code daily to unlock the <span className="text-indigo-300 font-medium">HyperFocus</span> badge.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full w-[70%]" />
          </div>
        </div>
      </div>

      {/* Footer Profile / Git Sync info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090d16]/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">Syncing with GitHub</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">v2.4.1</span>
        </div>
      </div>
    </aside>
  );
}
