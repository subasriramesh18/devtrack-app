import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg bg-slate-800/60 ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3.5 w-36 mb-3" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
        <div className="flex -space-x-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
