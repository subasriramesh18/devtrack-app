'use client';

import React from 'react';
import { Project, Task } from '@/types';
import { ProjectHealthBadge, Badge, StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  X,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  Code,
  User as UserIcon,
  GitBranch,
} from 'lucide-react';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  tasks: Task[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onSelectTask?: (task: Task) => void;
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  tasks,
  onEditProject,
  onDeleteProject,
  onSelectTask,
}: ProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

  const projectId = project.id || (project as any)._id;
  const projectTasks = tasks.filter(
    (t) =>
      t.projectId === projectId ||
      (typeof t.project === 'string' && t.project === projectId) ||
      (typeof t.project === 'object' && ((t.project as any)?.id === projectId || (t.project as any)?._id === projectId))
  );

  const completedCount = projectTasks.filter((t) => t.status === 'done').length;
  const progressPercent =
    projectTasks.length > 0
      ? Math.round((completedCount / projectTasks.length) * 100)
      : project.progress || 0;

  const leadName = (project.lead as any)?.name || (project.owner as any)?.name || 'Unassigned Lead';
  const leadRole = (project.lead as any)?.role || (project.owner as any)?.role || 'Engineering Lead';
  const leadAvatar =
    (project.lead as any)?.avatar ||
    (project.owner as any)?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.name}" and all its associated tasks? This action cannot be undone.`
      )
    ) {
      await onDeleteProject(projectId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d1322] border border-slate-800 shadow-2xl p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[88vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge color="indigo" size="sm">
                {project.category}
              </Badge>
              <ProjectHealthBadge status={project.status} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{project.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditProject(project);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-slate-800 transition-colors"
              title="Edit Project"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              {project.description || 'No description provided for this repository.'}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Progress Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Sprint Completion</span>
                <span className="font-mono text-indigo-300 font-semibold">{progressPercent}%</span>
              </div>
              <ProgressBar progress={progressPercent} color="indigo" size="md" />
              <div className="text-[11px] text-slate-500 font-mono">
                {completedCount} of {projectTasks.length} tasks completed
              </div>
            </div>

            {/* Lead Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <img
                src={leadAvatar}
                alt={leadName}
                className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs text-slate-500 font-medium">Project Lead</div>
                <div className="text-sm font-semibold text-white truncate">{leadName}</div>
                <div className="text-xs text-slate-400 truncate">{leadRole}</div>
              </div>
            </div>
          </div>

          {/* Tech Stack & Repo */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tech Stack & Source
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.repoUrl && (
              <div className="pt-2">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {project.repoUrl}
                </a>
              </div>
            )}
          </div>

          {/* Associated Tasks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sprint Tasks ({projectTasks.length})
              </h4>
            </div>

            {projectTasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 text-center text-xs text-slate-500 italic">
                No tasks assigned to this project yet.
              </div>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((t) => (
                  <div
                    key={t.id || (t as any)._id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          t.status === 'done'
                            ? 'bg-emerald-400'
                            : t.status === 'in-progress' || t.status === 'in_progress'
                            ? 'bg-cyan-400'
                            : 'bg-slate-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium truncate ${
                          t.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
