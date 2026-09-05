'use client';

import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus, User } from '@/types';
import {
  X,
  Plus,
  Edit2,
  FolderGit2,
  Code,
  Tag,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Partial<Project>) => Promise<boolean>;
  projectToEdit?: Project | null;
  users: User[];
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
  users,
}: ProjectModalProps) {
  const isEditing = !!projectToEdit;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Backend');
  const [status, setStatus] = useState<ProjectStatus>('on_track');
  const [color, setColor] = useState('#6366f1');
  const [repoUrl, setRepoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      setCategory(projectToEdit.category || 'Backend');
      setStatus(projectToEdit.status || 'on_track');
      setColor(projectToEdit.color || '#6366f1');
      setRepoUrl(projectToEdit.repoUrl || '');
      setTechStackInput(projectToEdit.techStack?.join(', ') || '');
      const currentOwnerId =
        (projectToEdit.lead as any)?.id ||
        (projectToEdit.lead as any)?._id ||
        (projectToEdit.owner as any)?.id ||
        (projectToEdit.owner as any)?._id ||
        projectToEdit.leadId ||
        '';
      setOwnerId(currentOwnerId || (users[0]?.id || users[0]?._id || ''));
    } else {
      setName('');
      setDescription('');
      setCategory('Backend');
      setStatus('on_track');
      setColor('#6366f1');
      setRepoUrl('');
      setTechStackInput('Node.js, Express, TypeScript');
      setOwnerId(users[0]?.id || users[0]?._id || '');
    }
    setFormError(null);
  }, [projectToEdit, isOpen, users]);

  if (!isOpen) return null;

  const colorPresets = [
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Amber', value: '#f59e0b' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Project name is required');
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<Project> = {
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      color,
      repoUrl: repoUrl.trim() || undefined,
      techStack: techStack.length > 0 ? techStack : ['TypeScript'],
      owner: ownerId ? (ownerId as any) : undefined,
    };

    setIsSubmitting(true);
    setFormError(null);
    try {
      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1322] border border-slate-800 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Repository Project' : 'Create Engineering Project'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update repository configuration & lead ownership'
                  : 'Add a new service or monorepo workspace to DevTrack'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vector Search Engine"
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
              placeholder="Brief synopsis of what this service or repository builds..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Health Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="on_track">🟢 On Track</option>
                <option value="at_risk">🟡 At Risk</option>
                <option value="delayed">🔴 Delayed</option>
                <option value="completed">🟣 Completed</option>
              </select>
            </div>
          </div>

          {/* Color & Project Lead row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Theme Tint</label>
              <div className="flex items-center gap-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c.value ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Lead / Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-indigo-500 outline-none"
              >
                {users.map((u) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name} ({u.role || 'Engineer'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Repo URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub / GitLab URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/devtrack/vector-engine"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="e.g. Go, Rust, gRPC, Docker, Redis"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Footer Actions */}
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
                  <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
