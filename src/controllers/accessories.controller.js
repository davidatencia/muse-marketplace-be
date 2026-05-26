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
      res.status(500).json({ message: 'Error retrieving accessories', error });
    }
  }

  static async getAccessoryById({ params: { id } }, res) {
    try {
      const accessory = await AccessoryModel.getById(id);
      if (!accessory) {
        return res.status(404).json({ message: 'Accessory not found' });
      }
      res.json(accessory);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving accessories', error });
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
      res.status(500).json({ message: 'Error creating accessory', error });
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

      const accessoryToUpdate = await AccessoryModel.update(id, body);

      if (!accessoryToUpdate) {
        return res.status(404).json({ message: 'Accessory not found' });
      }

      res.status(200).json(accessoryToUpdate);
    } catch (error) {
      res.status(500).json({ message: 'Error updating accessory', error });
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

      const accessoryToUpdate = await AccessoryModel.update(id, body);

      if (!accessoryToUpdate) {
        return res.status(404).json({ message: 'Accessory not found' });
      }

      res.status(200).json(accessoryToUpdate);
    } catch (error) {
      res.status(500).json({ message: 'Error updating accessory', error });
    }
  }

  static async deleteAccessory({ params: { id } }, res) {
    try {
      const accessoryToDelete = await AccessoryModel.delete(id);

      if (!accessoryToDelete) {
        return res.status(404).json({ message: 'Accessory not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting accessory', error });
    }
  }
}
