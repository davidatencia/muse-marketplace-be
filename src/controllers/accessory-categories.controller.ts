import { Request, Response } from 'express';
import AccessoryCategoriesModel from '@models/accessory-categories.model.js';
import { validateAccessoryCategoryData } from '@schemas/accessory-category.schema.js';

export default class AccessoryCategoriesController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      res.json(await AccessoryCategoriesModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessory categories',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async createCategory(
    { body: { name } }: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validateAccessoryCategoryData({ name });

      if (error) {
        res.status(400).json({
          message: 'Invalid accessory category data',
          details: error.issues,
        });
        return;
      }

      res.status(201).json(await AccessoryCategoriesModel.create(name));
    } catch (error) {
      res.status(500).json({
        message: 'Error creating accessory category',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async updateCategory(
    { params: { id }, body: { name } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validateAccessoryCategoryData({ name });

      if (error) {
        res.status(400).json({
          message: 'Invalid accessory category data',
          details: error.issues,
        });
        return;
      }

      if (!(await AccessoryCategoriesController.validateCategoryExistence(id, res))) return;

      await AccessoryCategoriesModel.update(id, name);
      res.json({ message: 'Accessory category updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating accessory category',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async deleteCategory(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      if (!(await AccessoryCategoriesController.validateCategoryExistence(id, res))) return;

      if (await AccessoryCategoriesModel.hasAccessories(id)) {
        res.status(409).json({
          message: 'Cannot delete category with associated accessories',
        });
        return;
      }

      await AccessoryCategoriesModel.delete(id);
      res.status(204).json({ message: 'Accessory category deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory category',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async validateCategoryExistence(id: string, res: Response): Promise<boolean> {
    const existing = await AccessoryCategoriesModel.getById(id);
    if (!existing.length) {
      res.status(404).json({ message: 'Accessory category not found' });
      return false;
    }
    return true;
  }
}
