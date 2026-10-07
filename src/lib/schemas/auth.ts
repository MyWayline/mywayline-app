import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const registerSchema = z
    .object({
        email: z.email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(256, "Password can't be longer than 255 characters.")
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[^A-Za-z0-9]/,
                'Password must contain at least one special character'
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
