import { z, object, string, boolean, number, array } from 'zod';

const accessorySchema = object({
  name: string({ error: 'Name must be a string' }).min(1, 'Name is required'),
  description: string({ error: 'Description must be a string' }).min(1, 'Description is required'),
  img: string({ error: 'Image must be a string' }).min(1, 'Image is required'),
  category_id: number({ error: 'Category must be a number' }).int().nonnegative(),
  handmade: boolean({ error: 'Handmade status must be a boolean' }),
  available: boolean({ error: 'Availability status must be a boolean' }),
  highlighted: boolean({ error: 'Highlighted status must be a boolean' }),
  price: number({ error: 'Price must be a number' }).nonnegative(),
  stock: number({ error: 'Stock must be a number' }).int().nonnegative().min(0).max(999999),
  rating: number().int().min(1).max(5).nullable().optional(),
  materials: array(number().int().positive()).optional(),
});

const accessoriesArraySchema = array(accessorySchema);

export type AccessoryData = z.infer<typeof accessorySchema>;
export type AccessoryArrayData = z.infer<typeof accessoriesArraySchema>;

export function validateAccessoryData(data: unknown) {
  return accessorySchema.safeParse(data);
}

export function validatePartialAccessoryData(data: unknown) {
  return accessorySchema.partial().safeParse(data);
}

export function validateAccessoriesArrayData(data: unknown) {
  return accessoriesArraySchema.safeParse(data);
}
