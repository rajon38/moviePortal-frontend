import {z} from 'zod'

export const loginZodSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
})

export type ILoginPayload = z.infer<typeof loginZodSchema>

export const registerZodSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name is too long'),
    email: z.email('Invalid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string()
        .min(1, 'Confirm password is required')
        .min(8, 'Confirm password must be at least 8 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export type IRegisterPayload = z.infer<typeof registerZodSchema>

export const forgotPasswordZodSchema = z.object({
    email: z.email('Invalid email address'),
})

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>

export const verifyEmailZodSchema = z.object({
    email: z.email('Invalid email address'),
    otp: z.string()
        .min(6, 'OTP must be 6 characters')
        .max(6, 'OTP must be 6 characters'),
})

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>

export const resetPasswordZodSchema = z.object({
    email: z.email('Invalid email address'),
    otp: z.string()
        .min(6, 'OTP must be 6 characters')
        .max(6, 'OTP must be 6 characters'),
    newPassword: z.string()
        .min(1, 'New password is required')
        .min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string()
        .min(1, 'Confirm password is required')
        .min(8, 'Confirm password must be at least 8 characters long'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>

export const changePasswordZodSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required')
        .min(8, 'Current password must be at least 8 characters long'),
    newPassword: z.string()
        .min(1, 'New password is required')
        .min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string()
        .min(1, 'Confirm password is required')
        .min(8, 'Confirm password must be at least 8 characters long'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>

export const updateProfileZodSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    image: z.string().url('Image URL must be valid').optional().or(z.literal('')),
})

export type IUpdateProfilePayload = z.infer<typeof updateProfileZodSchema>