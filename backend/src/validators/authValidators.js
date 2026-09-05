const { z } = require('zod');

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  handle: z.string().trim().min(2, 'Handle must be at least 2 characters').optional(),
  role: z.string().trim().min(2, 'Role must be at least 2 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  company: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
