import { object, string, boolean, number, array } from 'zod';

const accessorySchema = object({
  name: string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  img: string({
    required_error: 'Image is required',
    invalid_type_error: 'Image must be a string',
  }),
  category: string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  handmade: boolean({
    required_error: 'Handmade status is required',
    invalid_type_error: 'Handmade status must be a boolean',
  }),
  available: boolean({
    required_error: 'Availability status is required',
    invalid_type_error: 'Availability status must be a boolean',
  }),
  highlighted: boolean({
    required_error: 'Highlighted status is required',
    invalid_type_error: 'Highlighted status must be a boolean',
  }),
  price: number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }).nonnegative(),
  stock: number({
    required_error: 'Stock is required',
    invalid_type_error: 'Stock must be a number',
  })
    .int()
    .nonnegative()
    .min(0)
    .max(999999),
  rating: number().int().min(1).max(5).nullable().optional(),
});

const accessoriesArraySchema = array(accessorySchema);

export function validateAccessoryData(data) {
  return accessorySchema.safeParse(data);
}

export function validatePartialAccessoryData(data) {
  return accessorySchema.partial().safeParse(data);
}

export function validateAccessoriesArrayData(data) {
  return accessoriesArraySchema.safeParse(data);
}
