'use client';

import React from 'react';
import { TaskModal } from './TaskModal';
import { Task, Project, User } from '@/types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  projects: Project[];
  users?: User[];
}

export function NewTaskModal({
  isOpen,
  onClose,
  onAddTask,
  projects,
  users = [],
}: NewTaskModalProps) {
  const handleSubmit = async (taskData: Partial<Task>): Promise<boolean> => {
    onAddTask(taskData as Task);
    return true;
  };

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      projects={projects}
      users={users}
    />
  );
}
