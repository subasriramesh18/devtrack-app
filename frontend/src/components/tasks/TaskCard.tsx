import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  GitBranch,
  MoreVertical,
  Calendar,
  Sparkles,
  Tag,
  Check,
} from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { PriorityBadge, StatusBadge, Badge } from '@/components/ui/Badge';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'done';

  const cycleStatus = () => {
    const sequence: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];
    const currentIndex = sequence.indexOf(task.status);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];
    onStatusChange(task.id, nextStatus);
  };

  const getProjectBadgeColor = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'emerald';
      case 'indigo':
        return 'indigo';
      case 'cyan':
        return 'cyan';
      case 'violet':
        return 'violet';
      case 'rose':
        return 'rose';
      default:
        return 'slate';
    }
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 border transition-all duration-200 group ${
        isCompleted
          ? 'border-emerald-500/20 bg-emerald-950/10'
          : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/40'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Interactive Status Toggle Checkbox */}
        <button
          onClick={cycleStatus}
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
            isCompleted
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
              : task.status === 'in_progress'
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
              : task.status === 'in_review'
              ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
              : 'border-slate-700 hover:border-slate-500 text-transparent hover:text-slate-500'
          }`}
          title={`Status: ${task.status.replace('_', ' ')}. Click to advance.`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : task.status === 'in_progress' ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Header tags: Project name + Priority */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge color={getProjectBadgeColor(task.projectColor)} size="sm">
                {task.projectName}
              </Badge>
              <StatusBadge status={task.status} />
            </div>
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Title */}
          <h4
            onClick={cycleStatus}
            className={`text-sm font-semibold cursor-pointer transition-colors ${
              isCompleted
                ? 'line-through text-slate-500'
                : 'text-slate-100 group-hover:text-indigo-200'
            }`}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags & Git branch info */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {task.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/40"
              >
                #{t}
              </span>
            ))}
            {task.branchName && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <GitBranch className="w-2.5 h-2.5" />
                {task.branchName}
              </span>
            )}
          </div>

          {/* Footer: Due date, Logged hours, Assignee */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {task.dueDate}
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {task.loggedHours}/{task.estimatedHours}h
              </span>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                title={`Assigned to ${task.assignee.name}`}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
