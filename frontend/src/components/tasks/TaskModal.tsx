'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Sparkles,
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Project, User, AiSuggestedTask } from '@/types';
import { AiTaskSuggester } from './AiTaskSuggester';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => Promise<boolean>;
  taskToEdit?: Task | null;
  projects: Project[];
  users: User[];
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  projects,
  users,
}: TaskModalProps) {
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [loggedHours, setLoggedHours] = useState(0);
  const [tagInput, setTagInput] = useState('Frontend, React');
  const [branchName, setBranchName] = useState('feat/sprint-feature');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // AI Suggester state
  const [showAiSuggester, setShowAiSuggester] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');

      const currentProjId =
        taskToEdit.projectId ||
        (typeof taskToEdit.project === 'string'
          ? taskToEdit.project
          : (taskToEdit.project as any)?.id || (taskToEdit.project as any)?._id) ||
        (projects[0]?.id || (projects[0] as any)?._id || '');
      setProjectId(currentProjId);

      const currentAssigneeId =
        taskToEdit.assigneeId ||
        (taskToEdit.assignee as any)?.id ||
        (taskToEdit.assignee as any)?._id ||
        '';
      setAssigneeId(currentAssigneeId);

      // Normalize status
      const normStatus = (taskToEdit.status as string) === 'in-progress' ? 'in_progress' : taskToEdit.status;
      setStatus(normStatus || 'todo');
      setPriority(taskToEdit.priority || 'high');
      setDueDate(taskToEdit.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setEstimatedHours(taskToEdit.estimatedHours ?? 4);
      setLoggedHours(taskToEdit.loggedHours ?? 0);
      setTagInput(taskToEdit.tags?.join(', ') || '');
      setBranchName(taskToEdit.branchName || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || (projects[0] as any)?._id || '');
      setAssigneeId(users[0]?.id || (users[0] as any)?._id || '');
      setPriority('high');
      setStatus('todo');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setEstimatedHours(4);
      setLoggedHours(0);
      setTagInput('Frontend, Feature');
      setBranchName('feat/new-sprint-issue');
    }
    setFormError(null);
    setShowAiSuggester(false);
  }, [taskToEdit, isOpen, projects, users]);

  if (!isOpen) return null;

  /** Pre-fill form from AI suggestion */
  const handleAiSelectTask = (suggestion: AiSuggestedTask) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
    setPriority(suggestion.priority || 'medium');
    setEstimatedHours(suggestion.estimatedHours || 4);
    setTagInput(suggestion.tags?.join(', ') || '');
    setShowAiSuggester(false);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }

    if (!projectId) {
      setFormError('Please select a project');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Normalize status for backend ('in_progress' -> 'in-progress')
    const backendStatus = status === 'in_progress' ? 'in-progress' : status;

    const payload: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      project: projectId,
      projectId: projectId,
      assignee: assigneeId ? (assigneeId as any) : null,
      assigneeId: assigneeId || null,
      status: backendStatus as TaskStatus,
      priority,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      tags: tags.length > 0 ? tags : ['Sprint'],
      estimatedHours: Number(estimatedHours) || 0,
      loggedHours: Number(loggedHours) || 0,
      branchName: branchName.trim() || undefined,
    };

    setIsSubmitting(true);
    setFormError(null);
    try {
      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected project name for AI context
  const selectedProject = projects.find(
    (p) => (p.id || (p as any)._id) === projectId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card — wider when AI suggester is open */}
      <div
        className={`relative w-full rounded-3xl bg-[#0d1322] border border-slate-800 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150 transition-all ${
          showAiSuggester ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Sprint Task' : 'Create Sprint Task'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update task specifications, assignee, or priority'
                  : 'Add an engineering issue or task to the active sprint'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Suggest Button — only show when creating */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setShowAiSuggester((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showAiSuggester
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 hover:bg-violet-600/30'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-violet-300 hover:border-violet-500/40 hover:bg-violet-600/10'
                }`}
                title="AI Task Suggestions"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Suggest with AI</span>
                {showAiSuggester ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: side-by-side layout when AI panel is open */}
        <div className={`flex gap-0 ${showAiSuggester ? 'divide-x divide-slate-800' : ''}`}>
          {/* AI Task Suggester Panel */}
          {showAiSuggester && (
            <div className="w-[52%] p-5 overflow-y-auto max-h-[80vh]">
              <AiTaskSuggester
                onSelectTask={handleAiSelectTask}
                onClose={() => setShowAiSuggester(false)}
                projectName={selectedProject?.name}
              />
            </div>
          )}

          {/* Task Form */}
          <div className={`p-6 ${showAiSuggester ? 'flex-1 overflow-y-auto max-h-[80vh]' : 'w-full'}`}>
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {formError}
              </div>
            )}

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
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
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

              {/* Project & Assignee row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Project <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id || (p as any)._id} value={p.id || (p as any)._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assignee</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id || (u as any)._id} value={u.id || (u as any)._id}>
                        {u.name} ({u.role || 'Engineer'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Status row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sprint Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="todo">📋 To Do</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Branch row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

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
              </div>

              {/* Estimated & Logged Hours row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Logged Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={loggedHours}
                    onChange={(e) => setLoggedHours(Number(e.target.value))}
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
                  placeholder="e.g. Auth, Security, Backend"
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Save Changes' : 'Add Task to Sprint'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
