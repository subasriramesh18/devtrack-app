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
} from 'lucide-react';
import { Project } from '@/types';
import { ProjectHealthBadge, Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
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

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between group">
      <div>
        {/* Top bar: Category + Health status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge color={getCategoryColor(project.category)} size="sm">
            {project.category}
          </Badge>
          <ProjectHealthBadge status={project.status} />
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {project.name}
            </h3>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
              title="Open GitHub Repository"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech) => (
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
              {project.completedTasks}/{project.totalTasks} Tasks
            </span>
            <span className="font-mono font-semibold text-slate-200">{project.progress}%</span>
          </div>
          <ProgressBar
            progress={project.progress}
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

      {/* Footer: Team Avatars & GitHub Stats */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {/* Avatars */}
        <div className="flex -space-x-2 overflow-hidden">
          {project.members.map((m, idx) => (
            <img
              key={idx}
              src={m.avatar}
              alt={m.name}
              title={`${m.name} (${m.role})`}
              className="inline-block w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover"
            />
          ))}
        </div>

        {/* GitHub Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 hover:text-amber-300 transition-colors">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
            <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
            {project.openPRs}
          </span>
          <span className="flex items-center gap-1 hover:text-rose-300 transition-colors">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            {project.openIssues}
          </span>
        </div>
      </div>
    </div>
  );
}
