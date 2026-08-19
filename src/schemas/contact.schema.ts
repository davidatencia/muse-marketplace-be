import { z, object, string, email } from 'zod';

const contactSchema = object({
  name: string({ error: 'Name must be a string' }).trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  email: email('Invalid email address').trim().max(255, 'Email cannot exceed 255 characters'),
  message: string({ error: 'Message must be a string' }).trim().min(1, 'Message is required').max(2000, 'Message cannot exceed 2000 characters'),
});

export type ContactData = z.infer<typeof contactSchema>;

export function validateContactData(data: unknown) {
  return contactSchema.safeParse(data);
}
