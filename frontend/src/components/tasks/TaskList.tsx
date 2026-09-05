import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Plus,
  Filter,
  CheckCircle2,
  Kanban,
  List as ListIcon,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onOpenNewTaskModal: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  searchQuery,
  onStatusChange,
  onOpenNewTaskModal,
  onEditTask,
  onDeleteTask,
  isLoading = false,
}: TaskListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const q = searchQuery.toLowerCase().trim();
    const projName =
      task.projectName ||
      (typeof task.project === 'object' ? (task.project as any)?.name : '') ||
      '';

    const matchesSearch =
      q === '' ||
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q)) ||
      projName.toLowerCase().includes(q) ||
      (task.tags && task.tags.some((t) => t.toLowerCase().includes(q)));

    const normalizedTaskStatus =
      (task.status as string) === 'in-progress' ? 'in_progress' : task.status;
    const matchesStatus =
      selectedStatus === 'all' ||
      normalizedTaskStatus === selectedStatus ||
      (selectedStatus === 'in_progress' && (task.status as string) === 'in-progress');

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter(
    (t) => (t.status as string) === 'in_progress' || (t.status as string) === 'in-progress'
  ).length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const sprintProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'todo', label: 'To Do', count: todoCount },
    { id: 'in_progress', label: 'In Progress', count: inProgressCount },
    { id: 'done', label: 'Done', count: completedCount },
  ];

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'border-cyan-500/40' },
    { id: 'done', label: 'Completed', color: 'border-emerald-500/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Sprint Progress Summary Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Active Sprint Velocity Progress
            </span>
            <span className="font-mono text-indigo-300">
              {completedCount} of {tasks.length} tasks completed ({sprintProgress}%)
            </span>
          </div>
          <ProgressBar progress={sprintProgress} color="indigo" size="sm" />
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs & Priority Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel rounded-2xl p-3 sm:p-4 border border-slate-800">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedStatus === tab.id ? 'bg-indigo-800/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Priority:
          </span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔥 Urgent</option>
            <option value="high">⚡ High</option>
            <option value="medium">🔷 Medium</option>
            <option value="low">☕ Low</option>
          </select>
        </div>
      </div>

      {/* Main Task View: Skeleton, Kanban, List, or Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          type="tasks"
          title="No tasks match your filters"
          description="Try clearing your status or priority filters to view more tasks, or create a new sprint task."
          actionText="Create New Task"
          onAction={onOpenNewTaskModal}
          secondaryActionText="Reset Filters"
          onSecondaryAction={() => {
            setSelectedStatus('all');
            setSelectedPriority('all');
          }}
        />
      ) : viewMode === 'kanban' ? (
        /* Kanban Column View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter(
              (t) =>
                (t.status as string) === col.id ||
                (col.id === 'in_progress' && (t.status as string) === 'in-progress')
            );
            return (
              <div
                key={col.id}
                className={`glass-panel rounded-2xl p-4 border ${col.color} bg-slate-950/40 flex flex-col`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-200">{col.label}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px]">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 italic">
                      No tasks in this column
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id || (task as any)._id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Standard List View */
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id || (task as any)._id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
