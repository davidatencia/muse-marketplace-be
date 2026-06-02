import { object, string, boolean, number, array } from 'zod';

const accessoryCategorySchema = object({
  name: string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
});

export function validateAccessoryCategoryData(data) {
  return accessoryCategorySchema.safeParse(data);
}
