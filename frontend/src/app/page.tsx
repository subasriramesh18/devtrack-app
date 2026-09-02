'use client';

import React, { useState, useEffect } from 'react';
import {
  mockUserProfile,
  mockMetrics,
  mockProjects,
  mockTasks,
  mockActivity,
} from '@/data/mockData';
import { ViewTab, Task, TaskStatus, Project } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FocusTimer } from '@/components/dashboard/FocusTimer';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { LanguageStats } from '@/components/dashboard/LanguageStats';
import { ProjectList } from '@/components/projects/ProjectList';
import { TaskList } from '@/components/tasks/TaskList';
import { NewTaskModal } from '@/components/tasks/NewTaskModal';
import { ProfileDrawer } from '@/components/profile/ProfileDrawer';
import { ProfileView } from '@/components/profile/ProfileView';
import { MetricCardSkeleton } from '@/components/ui/Skeleton';
import {
  Sparkles,
  Layers,
  ArrowRight,
  GitBranch,
  Flame,
  Plus,
  Rocket,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';

export default function DashboardPage() {
  // State management
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activities, setActivities] = useState(mockActivity);
  const [user, setUser] = useState(mockUserProfile);

  // UI Modals & Drawers state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Loading skeleton toggle
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(1420); // starts at ~23:40 into session
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Task status updater
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Add new task
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const openTasksCount = tasks.filter((t) => t.status !== 'done').length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Navigation Sidebar (Desktop) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          streakDays={user.streakDays}
          openTasksCount={openTasksCount}
          activeProjectsCount={projects.length}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          streakDays={user.streakDays}
          openTasksCount={openTasksCount}
          activeProjectsCount={projects.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <Header
            user={user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            onOpenProfile={() => setIsProfileDrawerOpen(true)}
            onOpenNewTask={() => setIsNewTaskModalOpen(true)}
            isLoadingState={isLoadingState}
            onToggleLoadingState={() => setIsLoadingState(!isLoadingState)}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onResetTimer={() => setTimerSeconds(0)}
          />

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {/* View: Overview Dashboard */}
            {currentTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Hero Greeting & Quick Stats */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-indigo-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          SPRINT 34 ACTIVE
                        </span>
                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                          • 4 days remaining
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                        You have <span className="text-indigo-300 font-semibold">{openTasksCount} sprint tasks</span> pending review and your deep-work streak is on day <span className="text-amber-300 font-semibold">{user.streakDays}</span>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setIsNewTaskModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Create Task
                      </button>
                      <button
                        onClick={() => setCurrentTab('projects')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Explore Repos
                      </button>
                    </div>
                  </div>
                </div>

                {/* KPI Productivity Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {isLoadingState ? (
                    <>
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                    </>
                  ) : (
                    mockMetrics.map((metric) => (
                      <MetricCard key={metric.id} metric={metric} />
                    ))
                  )}
                </div>

                {/* Focus Timer & Language Stats Double-Column */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 flex">
                    <FocusTimer
                      timerSeconds={timerSeconds}
                      isTimerRunning={isTimerRunning}
                      onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
                      onResetTimer={() => setTimerSeconds(0)}
                    />
                  </div>
                  <div className="lg:col-span-7 flex">
                    <LanguageStats
                      languages={user.languages}
                      weeklyActivity={user.weeklyActivity}
                    />
                  </div>
                </div>

                {/* Live Activity & Sprint Tasks Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Active Sprint Tasks Overview */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          Priority Sprint Tasks
                        </h2>
                        <p className="text-xs text-slate-400">High impact items due this sprint</p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('tasks')}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        View all tasks ({tasks.length})
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <TaskList
                      tasks={tasks.slice(0, 3)}
                      searchQuery={searchQuery}
                      onStatusChange={handleTaskStatusChange}
                      onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
                      isLoading={isLoadingState}
                    />
                  </div>

                  {/* Telemetry & Git Activity Feed */}
                  <div className="lg:col-span-5">
                    <ActivityFeed activities={activities} />
                  </div>
                </div>
              </div>
            )}

            {/* View: Projects & Repositories */}
            {currentTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Engineering Repositories</h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Monitor repository health, test suite coverage, and pull request velocity.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
                    {projects.length} Active Services
                  </span>
                </div>

                <ProjectList
                  projects={projects}
                  searchQuery={searchQuery}
                  isLoading={isLoadingState}
                />
              </div>
            )}

            {/* View: Sprint Tasks */}
            {currentTab === 'tasks' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Sprint Tasks & Backlog</h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Track issues, cycle task statuses, and organize workflow in List or Kanban view.
                    </p>
                  </div>
                </div>

                <TaskList
                  tasks={tasks}
                  searchQuery={searchQuery}
                  onStatusChange={handleTaskStatusChange}
                  onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
                  isLoading={isLoadingState}
                />
              </div>
            )}

            {/* View: Git Activity Stream */}
            {currentTab === 'activity' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Git Activity & Telemetry</h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Audit trail of merged pull requests, commit pushes, canary deployments, and code reviews.
                    </p>
                  </div>
                </div>

                <ActivityFeed activities={activities} />
              </div>
            )}

            {/* View: Developer Profile */}
            {currentTab === 'profile' && (
              <ProfileView user={user} weeklyActivity={user.weeklyActivity} />
            )}
          </main>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={user}
      />

      {/* Create New Sprint Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        projects={projects}
      />
    </div>
  );
}
