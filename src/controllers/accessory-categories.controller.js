import AccessoryCategoriesModel from '../models/accessory-categories.model.js';
import { validateAccessoryCategoryData } from '../schemas/accessory-category.schema.js';

export default class AccessoryCategoriesController {
  static async getAllCategories(req, res) {
    try {
      res.json(await AccessoryCategoriesModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessory categories',
        error: error.code,
      });
    }
  }

  static async createCategory({ body: { name } }, res) {
    try {
      const { error } = validateAccessoryCategoryData({ name });

      if (error) {
        return res.status(400).json({
          message: 'Invalid accessory category data',
          details: error.issues,
        });
      }

      res.status(201).json(await AccessoryCategoriesModel.create(name));
    } catch (error) {
      res.status(500).json({
        message: 'Error creating accessory category',
        error: error.code,
      });
    }
  }

  static async updateCategory({ params: { id }, body: { name } }, res) {
    try {
      const { error } = validateAccessoryCategoryData({ name });

      if (error) {
        return res.status(400).json({
          message: 'Invalid accessory category data',
          details: error.issues,
        });
      }

      if (
        !(await AccessoryCategoriesController.validateCategoryExistence(
          id,
          res,
        ))
      )
        return;

      await AccessoryCategoriesModel.update(id, name);
      res.json({ message: 'Accessory category updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating accessory category',
        error: error.code,
      });
    }
  }

  static async deleteCategory({ params: { id } }, res) {
    try {
      if (
        !(await AccessoryCategoriesController.validateCategoryExistence(
          id,
          res,
        ))
      )
        return;

      if (await AccessoryCategoriesModel.categoryInUse(id)) {
        return res.status(409).json({
          message: 'Cannot delete category with associated accessories',
        });
      }

      await AccessoryCategoriesModel.delete(id);
      res
        .status(204)
        .json({ message: 'Accessory category deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory category',
        error: error.code,
      });
    }
  }

  static async validateCategoryExistence(id, res) {
    const existing = await AccessoryCategoriesModel.getById(id);
    if (!existing) {
      res.status(404).json({ message: 'Accessory category not found' });
      return false;
    }
    return true;
  }
}
