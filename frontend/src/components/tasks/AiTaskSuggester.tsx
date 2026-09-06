'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Clock,
  Tag,
  X,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { AiSuggestedTask, TaskPriority } from '@/types';
import { api } from '@/lib/api';

interface AiTaskSuggesterProps {
  onSelectTask: (task: AiSuggestedTask) => void;
  onClose: () => void;
  projectName?: string;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  urgent: {
    label: '🔥 Urgent',
    color: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
  high: {
    label: '⚡ High',
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  medium: {
    label: '🔷 Medium',
    color: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
  },
  low: {
    label: '☕ Low',
    color: 'text-slate-400',
    bg: 'bg-slate-700/30',
    border: 'border-slate-600/40',
    dot: 'bg-slate-500',
  },
};

const QUICK_PROMPTS = [
  'User authentication with JWT & OAuth',
  'Stripe payment & subscription checkout',
  'Real-time notifications with WebSockets',
  'Redis caching layer for API responses',
  'CI/CD pipeline with Docker & GitHub Actions',
  'REST API rate limiting & security hardening',
];

export function AiTaskSuggester({ onSelectTask, onClose, projectName }: AiTaskSuggesterProps) {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState<AiSuggestedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    const trimmed = goal.trim();
    if (!trimmed || trimmed.length < 3) {
      setError('Please enter a project goal (at least 3 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setSelectedIdx(null);

    try {
      const res = await api.ai.generateTasks(trimmed, projectName);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setSuggestions(res.data);
        setHasGenerated(true);
      } else {
        setError('No tasks were returned. Try rephrasing your goal.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to generate tasks';
      if (msg.includes('API key') || msg.includes('GEMINI_API_KEY')) {
        setError(
          'Gemini API key is not configured or invalid. Check GEMINI_API_KEY in backend/.env'
        );
      } else if (msg.includes('quota') || msg.includes('rate limit') || err?.status === 429) {
        setError('Gemini rate limit reached. Please wait a moment and try again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSelectTask = (task: AiSuggestedTask, idx: number) => {
    setSelectedIdx(idx);
    setTimeout(() => {
      onSelectTask(task);
    }, 180);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Task Suggestions</h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Powered by Google Gemini · Describe your project goal
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/70 transition-colors"
          title="Close AI Suggester"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Goal Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "Build a user authentication system with JWT and OAuth"'
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl text-sm bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all disabled:opacity-50"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || goal.trim().length < 3}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Prompt Chips */}
        {!hasGenerated && !isLoading && (
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setGoal(prompt)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-slate-400 bg-slate-800/70 hover:bg-slate-700/80 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
          <button
            onClick={handleGenerate}
            className="shrink-0 p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
            title="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="h-3.5 bg-slate-700/70 rounded-lg w-2/3" />
                <div className="h-5 w-14 bg-slate-700/50 rounded-lg shrink-0" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 bg-slate-700/50 rounded w-full" />
                <div className="h-2.5 bg-slate-700/50 rounded w-4/5" />
              </div>
              <div className="flex gap-1.5 mt-2.5">
                <div className="h-4 w-12 bg-slate-700/40 rounded" />
                <div className="h-4 w-16 bg-slate-700/40 rounded" />
              </div>
            </div>
          ))}
          <p className="text-center text-[10px] text-slate-500 animate-pulse">
            ✨ Gemini is analyzing your project goal…
          </p>
        </div>
      )}

      {/* Task Suggestion Cards */}
      {!isLoading && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {suggestions.length} tasks suggested — click any to pre-fill the form
          </p>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scroll-smooth">
            {suggestions.map((task, idx) => {
              const priority = (task.priority || 'medium') as TaskPriority;
              // Guard against non-standard priority values
              const cfg = priorityConfig[priority] || priorityConfig.medium;
              const isSelected = selectedIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectTask(task, idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 group ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500/60 scale-[0.99]'
                      : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/60 hover:scale-[1.005]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex-1 min-w-0">
                      {/* Title + Priority badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p
                          className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isSelected ? 'text-violet-200' : 'text-slate-100 group-hover:text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.color} ${cfg.border} border`}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-2">
                        {task.description}
                      </p>

                      {/* Meta row: hours + tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          {task.estimatedHours}h est.
                        </span>
                        {task.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow hint */}
                    <div
                      className={`shrink-0 mt-1 transition-all ${
                        isSelected ? 'text-violet-400 scale-110' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
