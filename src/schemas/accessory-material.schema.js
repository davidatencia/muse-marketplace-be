import { object, string, boolean, number, array } from 'zod';

const accessoryMaterialSchema = object({
  name: string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
});

export function validateAccessoryMaterialData(data) {
  return accessoryMaterialSchema.safeParse(data);
}
