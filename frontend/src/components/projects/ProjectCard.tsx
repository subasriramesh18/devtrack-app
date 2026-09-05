import React from 'react';
import {
  Star,
  GitFork,
  GitPullRequest,
  AlertCircle,
  ExternalLink,
  Users,
  Code,
  Calendar,
  CheckCircle,
  Edit2,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Project } from '@/types';
import { ProjectHealthBadge, Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onEdit, onDelete }: ProjectCardProps) {
  const getCategoryColor = (cat: Project['category']) => {
    switch (cat) {
      case 'Backend':
        return 'emerald';
      case 'Frontend':
        return 'indigo';
      case 'DevOps':
        return 'cyan';
      case 'AI / ML':
        return 'violet';
      case 'Mobile':
        return 'rose';
      default:
        return 'slate';
    }
  };

  const lead = project.lead || project.owner;
  const leadName = (lead as any)?.name || 'Lead Architect';
  const leadAvatar =
    (lead as any)?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const totalTasks = project.totalTasks ?? 0;
  const completedTasks = project.completedTasks ?? 0;
  const progress =
    project.progress ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  return (
    <div
      onClick={() => onSelect?.(project)}
      className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700/90 transition-all duration-200 cursor-pointer relative"
    >
      <div>
        {/* Top bar: Category + Health status + Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge color={getCategoryColor(project.category)} size="sm">
              {project.category}
            </Badge>
            <ProjectHealthBadge status={project.status} />
          </div>

          <div
            className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project.id || (project as any)._id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
                title="Open GitHub Repository"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
            {project.name}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              {completedTasks}/{totalTasks} Tasks
            </span>
            <span className="font-mono font-semibold text-slate-200">{progress}%</span>
          </div>
          <ProgressBar
            progress={progress}
            color={
              project.status === 'on_track'
                ? 'emerald'
                : project.status === 'at_risk'
                ? 'amber'
                : project.status === 'delayed'
                ? 'rose'
                : 'indigo'
            }
          />
        </div>
      </div>

      {/* Footer: Lead info & Details button */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {/* Lead Avatar + Name */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={leadAvatar}
            alt={leadName}
            title={`Lead: ${leadName}`}
            className="inline-block w-7 h-7 rounded-full ring-1 ring-slate-700 object-cover shrink-0"
          />
          <span className="text-xs text-slate-400 truncate max-w-[120px]">{leadName}</span>
        </div>

        {/* Action Link */}
        <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
          View details
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}

