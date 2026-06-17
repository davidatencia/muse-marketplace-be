import { z, object, string } from 'zod';

const accessoryMaterialSchema = object({
  name: string({ error: 'Name must be a string' }).min(1, 'Name is required'),
});

export type MaterialData = z.infer<typeof accessoryMaterialSchema>;

export function validateAccessoryMaterialData(data: unknown) {
  return accessoryMaterialSchema.safeParse(data);
}
