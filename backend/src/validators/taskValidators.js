const { z } = require('zod');

const taskStatusEnum = z.enum(
  ['todo', 'in-progress', 'in_progress', 'done'],
  {
    errorMap: () => ({ message: "Status must be one of: 'todo', 'in-progress', or 'done'" }),
  }
);

const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent'], {
  errorMap: () => ({ message: "Priority must be one of: 'low', 'medium', 'high', 'urgent'" }),
});

const createTaskSchema = z.object({
  title: z.string({ required_error: 'Task title is required' }).trim().min(2, 'Title must be at least 2 characters'),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional().default(''),
  status: taskStatusEnum.optional().default('todo'),
  priority: taskPriorityEnum.optional().default('medium'),
  project: z.string().trim().min(1).optional(),
  projectId: z.string().trim().min(1).optional(),
  assignee: z.string().trim().nullable().optional(),
  assigneeId: z.string().trim().nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be in YYYY-MM-DD format').optional(),
  tags: z.array(z.string().trim()).optional().default([]),
  estimatedHours: z.number().min(0, 'estimatedHours must be a non-negative number').optional().default(0),
  loggedHours: z.number().min(0, 'loggedHours must be a non-negative number').optional().default(0),
  branchName: z.string().trim().optional(),
  commitSha: z.string().trim().optional(),
}).refine((data) => data.project || data.projectId, {
  message: 'projectId or project is required',
  path: ['projectId'],
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').optional(),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  project: z.string().trim().min(1).optional(),
  projectId: z.string().trim().min(1).optional(),
  assignee: z.string().trim().nullable().optional(),
  assigneeId: z.string().trim().nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be in YYYY-MM-DD format').optional(),
  tags: z.array(z.string().trim()).optional(),
  estimatedHours: z.number().min(0, 'estimatedHours must be a non-negative number').optional(),
  loggedHours: z.number().min(0, 'loggedHours must be a non-negative number').optional(),
  branchName: z.string().trim().optional(),
  commitSha: z.string().trim().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Request body must contain at least one field to update',
});

const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
};
