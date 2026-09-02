import React, { useState } from 'react';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Rocket,
  MessageSquare,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { ActivityItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const copySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const getEventIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4 text-cyan-400" />;
      case 'pr_merged':
        return <GitPullRequest className="w-4 h-4 text-emerald-400" />;
      case 'review':
        return <MessageSquare className="w-4 h-4 text-violet-400" />;
      case 'deployment':
        return <Rocket className="w-4 h-4 text-amber-400" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    if (filterType === 'commits') return act.type === 'commit';
    if (filterType === 'prs') return act.type === 'pr_merged' || act.type === 'pr_opened' || act.type === 'review';
    if (filterType === 'deployments') return act.type === 'deployment';
    return true;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Git & Telemetry Stream
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time repository events across workspaces</p>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['all', 'commits', 'prs', 'deployments'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 text-xs font-medium capitalize rounded-lg transition-all ${
                filterType === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {filteredActivities.map((act, index) => (
          <div
            key={act.id}
            className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 transition-colors group"
          >
            {/* User Avatar with type badge */}
            <div className="relative shrink-0 mt-0.5">
              <img
                src={act.user.avatar}
                alt={act.user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                {getEventIcon(act.type)}
              </div>
            </div>

            {/* Event Description */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-300">
                <span className="font-semibold text-white">{act.user.name}</span>
                <span className="text-slate-400">{act.action}</span>
                <span className="font-medium text-indigo-300 truncate max-w-xs">{act.target}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span className="text-slate-400 font-medium">{act.project}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {act.timestamp}
                </span>

                {act.commitSha && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => copySha(act.commitSha!)}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-[10px] text-cyan-300 border border-slate-700 transition-colors"
                      title="Copy Commit SHA"
                    >
                      {copiedSha === act.commitSha ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                      {act.commitSha}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
