import { Request, Response } from 'express';
import AccessoryMaterialsModel from '@models/accessory-materials.model.js';
import { validateAccessoryMaterialData } from '@schemas/accessory-material.schema.js';

export default class AccessoryMaterialsController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      res.json(await AccessoryMaterialsModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessory materials',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async create({ body: { name } }: Request, res: Response): Promise<void> {
    try {
      const { error } = validateAccessoryMaterialData({ name });

      if (error) {
        res.status(400).json({
          message: 'Invalid accessory material data',
          details: error.issues,
        });
        return;
      }

      await AccessoryMaterialsModel.create(name);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error creating accessory material',
        error,
      });
    }
  }

  static async update(
    { params: { id }, body: { name } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validateAccessoryMaterialData({ name });

      if (error) {
        res.status(400).json({
          message: 'Invalid accessory material data',
          details: error.issues,
        });
        return;
      }

      if (!(await AccessoryMaterialsController.validateMaterialExistence(id, res))) return;

      await AccessoryMaterialsModel.update(id, name);
      res.json({ message: 'Accessory material updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating accessory material',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async delete(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      if (!(await AccessoryMaterialsController.validateMaterialExistence(id, res))) return;

      if (await AccessoryMaterialsModel.materialInUse(id)) {
        console.log('Material is in use by accessories, cannot delete');
        res.status(400).json({
          message: 'Cannot delete material in use by accessories',
        });
        return;
      }

        console.log('Material is not in use, proceeding with deletion');
      await AccessoryMaterialsModel.delete(id);
      res.json({ message: 'Accessory material deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory material',
        error,
      });
    }
  }

  static async validateMaterialExistence(id: string, res: Response): Promise<boolean> {
    const material = await AccessoryMaterialsModel.getById(id);
    if (!material.length) {
      res.status(404).json({ message: 'Accessory material not found' });
      return false;
    }
    return true;
  }
}
