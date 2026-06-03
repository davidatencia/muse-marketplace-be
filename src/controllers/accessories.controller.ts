import { Request, Response } from 'express';
import AccessoryModel from '@models/accessories.model.js';
import AccessoryCategoriesModel from '@models/accessory-categories.model.js';
import AccessoryMaterialsModel from '@models/accessory-materials.model.js';
import {
  validateAccessoriesArrayData,
  validateAccessoryData,
  validatePartialAccessoryData,
} from '@schemas/accessory.schema.js';

export default class AccessoriesController {
  static async getAllAccessories(req: Request, res: Response): Promise<void> {
    try {
      res.json(await AccessoryModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessories',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async getAccessoryById(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const accessory = await AccessoryModel.getById(id);
      if (!accessory.length) {
        res.status(404).json({ message: 'Accessory not found' });
        return;
      }
      res.json(accessory);
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessories',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async createAccessory({ body }: Request, res: Response): Promise<void> {
    try {
      const { error } = validateAccessoriesArrayData(body);

      if (error) {
        res.status(400).json({ message: 'Invalid accessory data', details: error.issues });
        return;
      }

      const categoryIds = [...new Set<number>(body.map((item: { category_id: number }) => item.category_id))];
      for (const categoryId of categoryIds) {
        const category = await AccessoryCategoriesModel.getById(categoryId);
        if (!category.length) {
          res.status(422).json({ message: `Category with id ${categoryId} not found` });
          return;
        }
      }

      const materialIds = [...new Set(body.flatMap((item: { materials?: number[] }) => item.materials ?? []))] as number[];
      if (materialIds.length > 0) {
        const missing = await AccessoryMaterialsModel.getMissingMaterials(materialIds);
        if (missing.length > 0) {
          res.status(422).json({ message: 'Some materials were not found', details: missing });
          return;
        }
      }

      res.status(201).json(await AccessoryModel.create(body));
    } catch (error) {
      res.status(500).json({ message: 'Error creating accessory', error });
    }
  }

  static async updateAccessory(
    { params: { id }, body }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validateAccessoryData(body);
      if (error) {
        res.status(400).json({ message: 'Invalid accessory data', details: error.issues });
        return;
      }

      if (!(await AccessoriesController.validateAccessoryExistence(id, res))) return;

      res.status(200).json(await AccessoryModel.update(id, body));
    } catch (error) {
      res.status(500).json({
        message: 'Error updating accessory',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async updateAccessoryPartial(
    { params: { id }, body }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validatePartialAccessoryData(body);
      if (error) {
        res.status(400).json({ message: 'Invalid accessory data', details: error.issues });
        return;
      }

      if (!(await AccessoriesController.validateAccessoryExistence(id, res))) return;

      res.status(200).json(await AccessoryModel.partialUpdate(id, body));
    } catch (error) {
      res.status(500).json({ message: 'Error updating accessory', error });
    }
  }

  static async deleteAccessory(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      if (!(await AccessoriesController.validateAccessoryExistence(id, res))) return;

      await AccessoryModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async validateAccessoryExistence(id: string, res: Response): Promise<boolean> {
    const existing = await AccessoryModel.getById(id);
    if (!existing.length) {
      res.status(404).json({ message: 'Accessory not found' });
      return false;
    }
    return true;
  }
}
