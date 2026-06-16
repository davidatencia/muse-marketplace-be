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

      const result = await AccessoryCategoriesModel.update(id, name);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Accessory category not found' });
        return;
      }

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
      if (await AccessoryCategoriesModel.hasAccessories(id)) {
        res.status(409).json({
          message: 'Cannot delete category with associated accessories',
        });
        return;
      }

      const [result] = await AccessoryCategoriesModel.delete(id);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Accessory category not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory category',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }
}
