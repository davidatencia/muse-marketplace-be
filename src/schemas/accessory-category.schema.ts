import { z, object, string } from 'zod';

const accessoryCategorySchema = object({
  name: string({ error: 'Name must be a string' }).min(1, 'Name is required'),
});

export type CategoryData = z.infer<typeof accessoryCategorySchema>;

export function validateAccessoryCategoryData(data: unknown) {
  return accessoryCategorySchema.safeParse(data);
}
