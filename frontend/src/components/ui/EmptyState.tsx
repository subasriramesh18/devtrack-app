import React from 'react';
import { Search, FolderGit2, CheckSquare, RefreshCw, Plus } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'tasks' | 'projects' | 'activity';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  type = 'search',
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'tasks':
        return <CheckSquare className="w-10 h-10 text-indigo-400" />;
      case 'projects':
        return <FolderGit2 className="w-10 h-10 text-cyan-400" />;
      case 'activity':
        return <RefreshCw className="w-10 h-10 text-emerald-400" />;
      case 'search':
      default:
        return <Search className="w-10 h-10 text-amber-400" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'tasks':
        return 'No tasks found';
      case 'projects':
        return 'No projects match filters';
      case 'activity':
        return 'No recent activity recorded';
      case 'search':
      default:
        return 'No results matching your query';
    }
  };

  const getDefaultDesc = () => {
    switch (type) {
      case 'tasks':
        return 'Try adjusting your search criteria, clearing your priority filters, or create a new sprint task.';
      case 'projects':
        return 'There are currently no engineering repositories matching the selected tech stack or status.';
      case 'activity':
        return 'Git commits and pull request updates will stream here automatically.';
      case 'search':
      default:
        return 'We couldn\'t find any items matching your keywords. Check your spelling or reset the active filters.';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800/80 flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-20 h-20 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-5 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title || getDefaultTitle()}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description || getDefaultDesc()}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {actionText ? (
              <>
                <Plus className="w-4 h-4" />
                {actionText}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </>
            )}
          </button>
        )}
        {onSecondaryAction && secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all border border-slate-700"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}
