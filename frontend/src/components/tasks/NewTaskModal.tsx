import React, { useState } from 'react';
import { X, Plus, Sparkles, CheckSquare, Tag, Calendar, User, Clock } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Project } from '@/types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  projects: Project[];
}

export function NewTaskModal({ isOpen, onClose, onAddTask, projects }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [tagInput, setTagInput] = useState('Frontend, React');
  const [branchName, setBranchName] = useState('feat/new-sprint-feature');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedProj = projects.find((p) => p.id === projectId) || projects[0];

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId: selectedProj?.id || 'proj-1',
      projectName: selectedProj?.name || 'Aether Analytics Engine',
      projectColor: selectedProj?.color || 'indigo',
      assignee: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Architect',
      },
      dueDate: 'Sep 8, 2026',
      tags: tags.length > 0 ? tags : ['Sprint', 'Feature'],
      estimatedHours: Number(estimatedHours) || 4,
      loggedHours: 0,
      branchName: branchName.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-800 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create Sprint Task</h3>
              <p className="text-xs text-slate-400">Add an issue or engineering task to the board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement resilient WebSocket reconnect algorithm"
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical context, acceptance criteria, or PR references..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Project & Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Repository / Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="urgent">🔥 Urgent</option>
                <option value="high">⚡ High</option>
                <option value="medium">🔷 Medium</option>
                <option value="low">☕ Low</option>
              </select>
            </div>
          </div>

          {/* Branch & Estimated Hours row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Git Branch Name</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="feat/my-branch"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Est. Hours</label>
              <input
                type="number"
                min="1"
                max="80"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. Rust, Performance, SIMD"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task to Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
