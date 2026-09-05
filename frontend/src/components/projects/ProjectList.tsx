import React, { useState } from 'react';
import { Project, ProjectCategory } from '@/types';
import { ProjectCard } from './ProjectCard';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Filter, Plus, Sparkles, LayoutGrid, List } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  searchQuery: string;
  isLoading?: boolean;
  onOpenCreateProject?: () => void;
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export function ProjectList({
  projects,
  searchQuery,
  isLoading = false,
  onOpenCreateProject,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = ['All', 'Backend', 'Frontend', 'DevOps', 'AI / ML', 'Mobile'];

  const filteredProjects = projects.filter((project) => {
    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      project.name.toLowerCase().includes(q) ||
      (project.description && project.description.toLowerCase().includes(q)) ||
      (project.techStack && project.techStack.some((tech) => tech.toLowerCase().includes(q)));

    // Category filter
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

    // Status filter
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right side: Status Dropdown & Create Project button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Health:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:border-indigo-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="on_track">🟢 On Track</option>
              <option value="at_risk">🟡 At Risk</option>
              <option value="delayed">🔴 Delayed</option>
              <option value="completed">🟣 Completed</option>
            </select>
          </div>

          {onOpenCreateProject && (
            <button
              onClick={onOpenCreateProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Content: Skeletons, Projects Grid, or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type="projects"
          title="No projects match your criteria"
          description="We couldn't find any repositories matching your active category or health filter."
          actionText={onOpenCreateProject ? "Create New Project" : "Reset All Filters"}
          onAction={onOpenCreateProject ? onOpenCreateProject : () => {
            setSelectedCategory('All');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || (project as any)._id}
              project={project}
              onSelect={onSelectProject}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

