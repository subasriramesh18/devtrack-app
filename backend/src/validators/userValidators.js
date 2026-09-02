const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address format'),
  handle: z.string().trim().min(2, 'Handle must be at least 2 characters').optional(),
  role: z.string().trim().min(2, 'Role must be at least 2 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  company: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
});

const updateUserSchema = createUserSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Request body must contain at least one field to update' }
);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
