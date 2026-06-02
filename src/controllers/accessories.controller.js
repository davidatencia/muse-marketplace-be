import AccessoryModel from '../models/accessories.model.js';
import {
  validateAccessoriesArrayData,
  validateAccessoryData,
  validatePartialAccessoryData,
} from '../schemas/accessory.schema.js';

export default class AccessoriesController {
  static async getAllAccessories(req, res) {
    try {
      res.json(await AccessoryModel.getAll());
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving accessories', error: error.code });
    }
  }

  static async getAccessoryById({ params: { id } }, res) {
    try {
      const accessory = await AccessoryModel.getById(id);
      if (!accessory.length) {
        return res.status(404).json({ message: 'Accessory not found' });
      }
      res.json(accessory);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving accessories', error: error.code });
    }
  }

  static async createAccessory({ body }, res) {
    try {
      const { error } = validateAccessoriesArrayData(body);

      if (error) {
        return res
          .status(400)
          .json({ message: 'Invalid accessory data', details: error.issues });
      }

      res.status(201).json(await AccessoryModel.create(body));
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error creating accessory', error: error });
    }
  }

  static async updateAccessory({ params: { id }, body }, res) {
    try {
      const { error } = validateAccessoryData(body);
      if (error) {
        return res
          .status(400)
          .json({ message: 'Invalid accessory data', details: error.issues });
      }

      if (!(await AccessoriesController.validateAccessoryExistence(id, res)))
        return;

      res.status(200).json(await AccessoryModel.update(id, body));
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error updating accessory', error: error.code });
    }
  }

  static async updateAccessoryPartial({ params: { id }, body }, res) {
    try {
      const { error } = validatePartialAccessoryData(body);
      if (error) {
        return res
          .status(400)
          .json({ message: 'Invalid accessory data', details: error.issues });
      }

      if (!(await AccessoriesController.validateAccessoryExistence(id, res)))
        return;

      res.status(200).json(await AccessoryModel.partialUpdate(id, body));
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error updating accessory', error: error });
    }
  }

  static async deleteAccessory({ params: { id } }, res) {
    try {
      if (!(await AccessoriesController.validateAccessoryExistence(id, res)))
        return;

      await AccessoryModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error deleting accessory', error: error.code });
    }
  }

  static async validateAccessoryExistence(id, res) {
    const existing = await AccessoryModel.getById(id);
    if (!existing.length) {
      res.status(404).json({ message: 'Accessory not found' });
      return false;
    }
    return true;
  }
}
