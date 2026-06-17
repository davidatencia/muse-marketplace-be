import { UserLogin, UserRegister } from '@sharedTypes/user.interface.js';
import { z } from 'zod';

const userLoginSchema = z.object({
  email: z
    .email('Invalid email address')
    .trim()
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password cannot exceed 255 characters'),
});

const userRegisterSchema = userLoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(5, 'Valid username is required')
    .max(100, 'Username cannot exceed 100 characters'),
});

export function validateUserLogin(data: UserLogin) {
  return userLoginSchema.safeParse(data);
}

export function validateUserRegister(data: UserRegister) {
  return userRegisterSchema.safeParse(data);
}
