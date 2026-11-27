import z, { number, object, string, boolean } from 'zod';

const PromotionSchema = object({
  description: string({ error: 'Description must be a string' })
    .trim()
    .min(1, 'Description is required')
    .max(255, 'Description cannot exceed 255 characters'),
  discount: number({ error: 'Discount  must be a number' })
    .nonnegative().min(0, 'Discount must be between 0 and 100').max(100, 'Discount must be between 0 and 100'),
  is_active: boolean({
    error: 'Availability status must be a boolean',
  }).optional(),
});

export type PromotionData = z.infer<typeof PromotionSchema>;

export function validatePromotionData(data: unknown) {
  return PromotionSchema.safeParse(data);
}
