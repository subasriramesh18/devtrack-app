const { z } = require('zod');

const generateTasksSchema = z
  .object({
    goal: z.string().trim().min(3, 'Goal or prompt must be at least 3 characters').optional(),
    prompt: z.string().trim().min(3, 'Goal or prompt must be at least 3 characters').optional(),
    description: z.string().trim().min(3, 'Goal or prompt must be at least 3 characters').optional(),
    topic: z.string().trim().min(3, 'Goal or prompt must be at least 3 characters').optional(),
    projectName: z.string().trim().optional(),
    count: z.number().int().min(1).max(10).optional().default(5),
  })
  .refine((data) => data.goal || data.prompt || data.description || data.topic, {
    message: 'Please provide a project goal or description (e.g. goal, prompt, or description)',
    path: ['goal'],
  });

module.exports = {
  generateTasksSchema,
};
