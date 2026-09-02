const { z } = require('zod');

const projectCategoryEnum = z.enum(['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI / ML'], {
  errorMap: () => ({ message: 'Category must be one of: Frontend, Backend, Fullstack, DevOps, Mobile, AI / ML' }),
});

const projectStatusEnum = z.enum(['on_track', 'at_risk', 'delayed', 'completed'], {
  errorMap: () => ({ message: 'Status must be one of: on_track, at_risk, delayed, completed' }),
});

const createProjectSchema = z.object({
  name: z.string({ required_error: 'Project name is required' }).trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
  category: projectCategoryEnum.default('Backend'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Color must be a valid hex code (e.g. #6366f1)').optional().default('#6366f1'),
  status: projectStatusEnum.default('on_track'),
  leadId: z.string().trim().nullable().optional(),
  repoUrl: z.string().url('repoUrl must be a valid URL').optional().or(z.literal('')),
  techStack: z.array(z.string().trim().min(1)).optional().default([]),
});

const updateProjectSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
  category: projectCategoryEnum.optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Color must be a valid hex code (e.g. #6366f1)').optional(),
  status: projectStatusEnum.optional(),
  leadId: z.string().trim().nullable().optional(),
  repoUrl: z.string().url('repoUrl must be a valid URL').optional().or(z.literal('')),
  techStack: z.array(z.string().trim().min(1)).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Request body must contain at least one field to update',
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
