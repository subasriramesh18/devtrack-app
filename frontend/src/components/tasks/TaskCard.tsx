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
  Edit2,
  Trash2,
} from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { PriorityBadge, StatusBadge, Badge } from '@/components/ui/Badge';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const taskId = task.id || (task as any)._id;
  const normalizedStatus =
    (task.status as string) === 'in-progress' ? 'in_progress' : task.status;
  const isCompleted = normalizedStatus === 'done';

  const cycleStatus = () => {
    const sequence: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const currentIndex = sequence.indexOf(normalizedStatus as TaskStatus);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];
    onStatusChange(taskId, nextStatus);
  };

  const getProjectBadgeColor = (color?: string) => {
    switch (color) {
      case 'emerald':
      case '#10b981':
        return 'emerald';
      case 'indigo':
      case '#6366f1':
        return 'indigo';
      case 'cyan':
      case '#06b6d4':
        return 'cyan';
      case 'violet':
      case '#8b5cf6':
        return 'violet';
      case 'rose':
      case '#f43f5e':
        return 'rose';
      case 'amber':
      case '#f59e0b':
        return 'amber';
      default:
        return 'indigo';
    }
  };

  // Resolve project info
  const projectName =
    task.projectName ||
    (typeof task.project === 'object' ? (task.project as any)?.name : null) ||
    'General Project';
  const projectColor =
    task.projectColor ||
    (typeof task.project === 'object' ? (task.project as any)?.color : null) ||
    'indigo';

  // Resolve assignee info
  const assigneeName = (task.assignee as any)?.name || 'Unassigned';
  const assigneeAvatar =
    (task.assignee as any)?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 border transition-all duration-200 group relative ${
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
              : normalizedStatus === 'in_progress'
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
              : 'border-slate-700 hover:border-slate-500 text-transparent hover:text-slate-500'
          }`}
          title={`Current Status: ${normalizedStatus.replace('_', ' ')}. Click to advance.`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : normalizedStatus === 'in_progress' ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Header tags: Project name + Priority + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge color={getProjectBadgeColor(projectColor)} size="sm">
                {projectName}
              </Badge>
              <StatusBadge status={normalizedStatus} />
            </div>

            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(taskId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
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
            {task.tags?.map((t) => (
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
                {task.loggedHours ?? 0}/{task.estimatedHours ?? 0}h
              </span>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={assigneeAvatar}
                alt={assigneeName}
                title={`Assigned to ${assigneeName}`}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
              />
              <span className="text-[11px] text-slate-400 hidden sm:inline">{assigneeName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

