'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ViewTab, Task, TaskStatus, Project, User, UserProfile, ActivityItem, MetricCardData } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FocusTimer } from '@/components/dashboard/FocusTimer';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { LanguageStats } from '@/components/dashboard/LanguageStats';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ProjectDetailsModal } from '@/components/projects/ProjectDetailsModal';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { AuthModal } from '@/components/auth/AuthModal';
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
  AlertCircle,
  RefreshCw,
  FolderGit2,
  CheckSquare,
  LogIn,
} from 'lucide-react';

export default function DashboardPage() {
  const { user: authUser, isAuthenticated, logout } = useAuth();

  // State management
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Loading & Error States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals & Drawers state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Project Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);

  // Task Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(1420);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Focus Timer interval
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

  // Fetch all live data from backend
  const fetchData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      setApiError(null);

      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        api.projects.getAll().catch(() => ({ success: false, data: [] })),
        api.tasks.getAll().catch(() => ({ success: false, data: [] })),
        api.users.getAll().catch(() => ({ success: false, data: [] })),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (err: any) {
      console.error('Failed to fetch data from backend:', err);
      setApiError(
        'Unable to connect to the DevTrack backend API at http://localhost:5000. Please ensure the backend server is running.'
      );
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Map authenticated user to UserProfile structure
  const activeUserProfile: UserProfile = useMemo(() => {
    if (authUser) {
      return {
        id: authUser.id || authUser._id,
        name: authUser.name,
        email: authUser.email,
        handle: authUser.handle || authUser.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        title: authUser.role || 'Principal Architect',
        company: authUser.company || 'DevTrack Labs',
        location: authUser.location || 'San Francisco, CA',
        avatar:
          authUser.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        statusState: 'coding',
        statusMessage: 'Optimizing high-throughput API endpoints & sprint velocity',
        weeklyFocusHours: 32,
        focusGoalHours: 40,
        streakDays: 14,
        bestStreakDays: 28,
        productivityScore: 94,
        prsMerged: 24,
        codeReviews: 42,
        totalCommits: 186,
        languages: [
          { name: 'TypeScript', percentage: 48, color: '#3178c6', linesOfCode: '34.2k' },
          { name: 'Node.js', percentage: 28, color: '#539e43', linesOfCode: '18.4k' },
          { name: 'Go', percentage: 14, color: '#00add8', linesOfCode: '9.8k' },
          { name: 'Rust', percentage: 10, color: '#dea584', linesOfCode: '6.1k' },
        ],
        weeklyActivity: [
          { day: 'Mon', hours: 7.2, commits: 14, prs: 3 },
          { day: 'Tue', hours: 8.5, commits: 22, prs: 5 },
          { day: 'Wed', hours: 6.8, commits: 18, prs: 2 },
          { day: 'Thu', hours: 9.1, commits: 31, prs: 6 },
          { day: 'Fri', hours: 7.9, commits: 19, prs: 4 },
          { day: 'Sat', hours: 4.2, commits: 8, prs: 1 },
          { day: 'Sun', hours: 3.5, commits: 6, prs: 0 },
        ],
        badges: [
          { id: '1', name: 'Code Architect', icon: '⚡', description: 'Architected 5+ production microservices', dateEarned: '2026-08' },
          { id: '2', name: 'Sprint Master', icon: '🏆', description: '100% sprint task completion in Sprint 33', dateEarned: '2026-08' },
          { id: '3', name: 'Clean Architecture', icon: '💎', description: 'Zero high severity bugs in 30 days', dateEarned: '2026-07' },
          { id: '4', name: 'Deep Work Hero', icon: '🔥', description: 'Logged 40+ hours deep work in one sprint', dateEarned: '2026-06' },
        ],
      };
    }

    // Default fallback profile (Alex Rivera)
    return {
      name: 'Alex Rivera',
      email: 'alex.rivera@devtrack.io',
      handle: 'arivera',
      title: 'Principal Architect',
      company: 'DevTrack Labs',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      statusState: 'focus',
      statusMessage: 'Refactoring telemetry ingestion worker and OAuth JWT flow',
      weeklyFocusHours: 32,
      focusGoalHours: 40,
      streakDays: 14,
      bestStreakDays: 28,
      productivityScore: 94,
      prsMerged: 24,
      codeReviews: 42,
      totalCommits: 186,
      languages: [
        { name: 'TypeScript', percentage: 48, color: '#3178c6', linesOfCode: '34.2k' },
        { name: 'Node.js', percentage: 28, color: '#539e43', linesOfCode: '18.4k' },
        { name: 'Go', percentage: 14, color: '#00add8', linesOfCode: '9.8k' },
        { name: 'Rust', percentage: 10, color: '#dea584', linesOfCode: '6.1k' },
      ],
      weeklyActivity: [
        { day: 'Mon', hours: 7.2, commits: 14, prs: 3 },
        { day: 'Tue', hours: 8.5, commits: 22, prs: 5 },
        { day: 'Wed', hours: 6.8, commits: 18, prs: 2 },
        { day: 'Thu', hours: 9.1, commits: 31, prs: 6 },
        { day: 'Fri', hours: 7.9, commits: 19, prs: 4 },
        { day: 'Sat', hours: 4.2, commits: 8, prs: 1 },
        { day: 'Sun', hours: 3.5, commits: 6, prs: 0 },
      ],
      badges: [
        { id: '1', name: 'Code Architect', icon: '⚡', description: 'Architected 5+ production microservices', dateEarned: '2026-08' },
        { id: '2', name: 'Sprint Master', icon: '🏆', description: '100% sprint task completion in Sprint 33', dateEarned: '2026-08' },
        { id: '3', name: 'Clean Architecture', icon: '💎', description: 'Zero high severity bugs in 30 days', dateEarned: '2026-07' },
        { id: '4', name: 'Deep Work Hero', icon: '🔥', description: 'Logged 40+ hours deep work in one sprint', dateEarned: '2026-06' },
      ],
    };
  }, [authUser]);

  // Dynamic Dashboard Metric Cards computed from live tasks & projects
  const dashboardMetrics: MetricCardData[] = useMemo(() => {
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
    const inProgressCount = tasks.filter(
      (t) => (t.status as string) === 'in-progress' || (t.status as string) === 'in_progress'
    ).length;
    const sprintVelocity = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const totalLoggedHours = tasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);
    const totalEstimatedHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

    const onTrackProjects = projects.filter((p) => p.status === 'on_track').length;

    return [
      {
        id: 'sprint-velocity',
        title: 'Sprint Velocity',
        value: `${sprintVelocity}%`,
        change: `${completedTasksCount}/${totalTasksCount} done`,
        trend: sprintVelocity >= 50 ? 'up' : 'neutral',
        subtext: 'Completed vs total tasks',
        icon: 'zap',
        color: 'indigo',
      },
      {
        id: 'active-projects',
        title: 'Active Services',
        value: projects.length,
        change: `${onTrackProjects} on track`,
        trend: 'up',
        subtext: 'Microservices in production',
        icon: 'git-pull-request',
        color: 'cyan',
      },
      {
        id: 'sprint-hours',
        title: 'Logged Sprint Hours',
        value: `${totalLoggedHours}h`,
        change: `of ${totalEstimatedHours}h est.`,
        trend: 'up',
        subtext: 'Engineering effort invested',
        icon: 'clock',
        color: 'emerald',
      },
      {
        id: 'in-progress',
        title: 'Tasks In Flow',
        value: inProgressCount,
        change: `${tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length} high priority`,
        trend: inProgressCount > 0 ? 'up' : 'neutral',
        subtext: 'Actively in engineering cycle',
        icon: 'check-circle',
        color: 'violet',
      },
    ];
  }, [tasks, projects]);

  // Derived Activity Feed based on real tasks & database updates
  const derivedActivities: ActivityItem[] = useMemo(() => {
    return tasks.slice(0, 6).map((t, index) => {
      const isDone = t.status === 'done';
      const isInProg = (t.status as string) === 'in-progress' || (t.status as string) === 'in_progress';
      const assignee = (t.assignee as any) || {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Engineer',
      };
      const projName =
        t.projectName ||
        (typeof t.project === 'object' ? (t.project as any)?.name : null) ||
        'Core Engine API';

      return {
        id: `act-${t.id || (t as any)._id || index}`,
        type: isDone ? 'task_completed' : isInProg ? 'pr_opened' : 'commit',
        user: {
          name: assignee.name || 'Alex Rivera',
          avatar: assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: assignee.role || 'Engineer',
        },
        action: isDone ? 'completed task' : isInProg ? 'advanced status to In Progress on' : 'created sprint task',
        target: t.title,
        project: projName,
        timestamp: `${(index + 1) * 15}m ago`,
        branch: t.branchName || 'main',
        commitSha: t.commitSha || 'a8f3b2c',
      };
    });
  }, [tasks]);

  // ==========================================
  // PROJECT CRUD HANDLERS
  // ==========================================
  const handleOpenCreateProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleProjectModalSubmit = async (projectData: Partial<Project>): Promise<boolean> => {
    try {
      if (projectToEdit) {
        const projectId = projectToEdit.id || (projectToEdit as any)._id;
        const res = await api.projects.update(projectId, projectData);
        if (res.data) {
          setProjects((prev) =>
            prev.map((p) => ((p.id || (p as any)._id) === projectId ? res.data : p))
          );
          showToast(`Repository "${res.data.name}" updated successfully!`);
          return true;
        }
      } else {
        const res = await api.projects.create(projectData);
        if (res.data) {
          setProjects((prev) => [res.data, ...prev]);
          showToast(`Repository "${res.data.name}" created successfully!`);
          return true;
        }
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to save project', 'error');
      return false;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.projects.delete(projectId);
      setProjects((prev) => prev.filter((p) => (p.id || (p as any)._id) !== projectId));
      setTasks((prev) =>
        prev.filter(
          (t) =>
            t.projectId !== projectId &&
            (typeof t.project === 'string' ? t.project !== projectId : (t.project as any)?.id !== projectId)
        )
      );
      showToast('Project and associated tasks deleted successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  // ==========================================
  // TASK CRUD HANDLERS
  // ==========================================
  const handleOpenCreateTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalSubmit = async (taskData: Partial<Task>): Promise<boolean> => {
    try {
      if (taskToEdit) {
        const taskId = taskToEdit.id || (taskToEdit as any)._id;
        const res = await api.tasks.update(taskId, taskData);
        if (res.data) {
          setTasks((prev) =>
            prev.map((t) => ((t.id || (t as any)._id) === taskId ? res.data : t))
          );
          showToast(`Task "${res.data.title}" updated successfully!`);
          return true;
        }
      } else {
        const res = await api.tasks.create(taskData);
        if (res.data) {
          setTasks((prev) => [res.data, ...prev]);
          showToast(`Task "${res.data.title}" added to active sprint!`);
          return true;
        }
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to save task', 'error');
      return false;
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Convert 'in_progress' to backend format 'in-progress'
    const backendStatus = newStatus === 'in_progress' ? 'in-progress' : newStatus;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        if ((t.id || (t as any)._id) === taskId) {
          return { ...t, status: newStatus };
        }
        return t;
      })
    );

    try {
      await api.tasks.updateStatus(taskId, backendStatus);
      showToast(`Task status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update task status on backend', 'error');
      // Re-fetch to sync
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.tasks.delete(taskId);
        setTasks((prev) => prev.filter((t) => (t.id || (t as any)._id) !== taskId));
        showToast('Task removed from sprint');
      } catch (err: any) {
        showToast(err.message || 'Failed to delete task', 'error');
      }
    }
  };

  const openTasksCount = tasks.filter((t) => t.status !== 'done').length;
  const isLoading = isLoadingData || isSimulatedLoading;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-semibold backdrop-blur-xl ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Navigation Sidebar (Desktop) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          streakDays={activeUserProfile.streakDays}
          openTasksCount={openTasksCount}
          activeProjectsCount={projects.length}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          streakDays={activeUserProfile.streakDays}
          openTasksCount={openTasksCount}
          activeProjectsCount={projects.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <Header
            user={activeUserProfile}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            onOpenProfile={() => setIsProfileDrawerOpen(true)}
            onOpenNewTask={handleOpenCreateTask}
            isLoadingState={isSimulatedLoading}
            onToggleLoadingState={() => setIsSimulatedLoading(!isSimulatedLoading)}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onResetTimer={() => setTimerSeconds(0)}
            isAuthenticated={isAuthenticated}
            onOpenAuthModal={(mode = 'login') => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
            onLogout={logout}
          />

          {/* Backend Connection Error Banner if any */}
          {apiError && (
            <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{apiError}</span>
              </div>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

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
                          • MongoDB Real-time Connected
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-gradient">{activeUserProfile.name.split(' ')[0]}</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                        You have <span className="text-indigo-300 font-semibold">{openTasksCount} sprint tasks</span> pending review across <span className="text-cyan-300 font-semibold">{projects.length} services</span>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleOpenCreateTask}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Create Task
                      </button>
                      <button
                        onClick={handleOpenCreateProject}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4 text-cyan-400" />
                        New Project
                      </button>
                    </div>
                  </div>
                </div>

                {/* KPI Productivity Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {isLoading ? (
                    <>
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                      <MetricCardSkeleton />
                    </>
                  ) : (
                    dashboardMetrics.map((metric) => (
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
                      languages={activeUserProfile.languages}
                      weeklyActivity={activeUserProfile.weeklyActivity}
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
                        <p className="text-xs text-slate-400">High impact items connected to MongoDB</p>
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
                      tasks={tasks.slice(0, 4)}
                      searchQuery={searchQuery}
                      onStatusChange={handleTaskStatusChange}
                      onOpenNewTaskModal={handleOpenCreateTask}
                      onEditTask={handleOpenEditTask}
                      onDeleteTask={handleDeleteTask}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Telemetry & Git Activity Feed */}
                  <div className="lg:col-span-5">
                    <ActivityFeed activities={derivedActivities} />
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
                      Manage repositories, review service health, tech stack, and ownership.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleOpenCreateProject}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Create Project
                    </button>
                  </div>
                </div>

                <ProjectList
                  projects={projects}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  onOpenCreateProject={handleOpenCreateProject}
                  onSelectProject={(project) => setSelectedProjectForDetails(project)}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleDeleteProject}
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
                  <button
                    onClick={handleOpenCreateTask}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 active:scale-95 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </button>
                </div>

                <TaskList
                  tasks={tasks}
                  searchQuery={searchQuery}
                  onStatusChange={handleTaskStatusChange}
                  onOpenNewTaskModal={handleOpenCreateTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  isLoading={isLoading}
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
                      Live audit trail of task transitions, commits, and engineering velocity.
                    </p>
                  </div>
                </div>

                <ActivityFeed activities={derivedActivities} />
              </div>
            )}

            {/* View: Developer Profile */}
            {currentTab === 'profile' && (
              <ProfileView user={activeUserProfile} weeklyActivity={activeUserProfile.weeklyActivity} />
            )}
          </main>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={activeUserProfile}
        onLogout={logout}
        onSwitchAccount={() => {
          setIsProfileDrawerOpen(false);
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Auth Modal (Login / Register / 1-Click Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleProjectModalSubmit}
        projectToEdit={projectToEdit}
        users={users}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={!!selectedProjectForDetails}
        onClose={() => setSelectedProjectForDetails(null)}
        project={selectedProjectForDetails}
        tasks={tasks}
        onEditProject={handleOpenEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskModalSubmit}
        taskToEdit={taskToEdit}
        projects={projects}
        users={users}
      />
    </div>
  );
}
