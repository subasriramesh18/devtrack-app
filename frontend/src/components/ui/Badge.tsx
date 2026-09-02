import React from 'react';
import { TaskPriority, TaskStatus, ProjectStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'glow' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'violet' | 'slate';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  color = 'indigo',
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-medium rounded-lg',
    lg: 'text-sm px-3 py-1.5 font-semibold rounded-lg',
  };

  const colorClasses = {
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border transition-colors ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case 'urgent':
      return (
        <Badge color="rose" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Urgent
        </Badge>
      );
    case 'high':
      return (
        <Badge color="amber" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          High
        </Badge>
      );
    case 'medium':
      return (
        <Badge color="cyan" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Medium
        </Badge>
      );
    case 'low':
      return (
        <Badge color="slate" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </Badge>
      );
  }
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'todo':
      return (
        <Badge color="slate" size="sm">
          To Do
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge color="cyan" size="sm">
          In Progress
        </Badge>
      );
    case 'in_review':
      return (
        <Badge color="violet" size="sm">
          In Review
        </Badge>
      );
    case 'done':
      return (
        <Badge color="emerald" size="sm">
          Completed
        </Badge>
      );
  }
}

export function ProjectHealthBadge({ status }: { status: ProjectStatus }) {
  switch (status) {
    case 'on_track':
      return (
        <Badge color="emerald" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          On Track
        </Badge>
      );
    case 'at_risk':
      return (
        <Badge color="amber" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          At Risk
        </Badge>
      );
    case 'delayed':
      return (
        <Badge color="rose" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Delayed
        </Badge>
      );
    case 'completed':
      return (
        <Badge color="indigo" size="sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Completed
        </Badge>
      );
  }
}
