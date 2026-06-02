import AccessoryMaterialsModel from '../models/accessory-materials.model.js';
import { validateAccessoryMaterialData } from '../schemas/accessory-material.schema.js';

export default class AccessoryMaterialsController {
  static async getAll(req, res) {
    try {
      res.json(await AccessoryMaterialsModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving accessory materials',
        error: error.code,
      });
    }
  }

  static async create({ body: { name } }, res) {
    try {
      const { error } = validateAccessoryMaterialData({ name });

      if (error) {
        return res.status(400).json({
          message: 'Invalid accessory material data',
          details: error.issues,
        });
      }

      await AccessoryMaterialsModel.create(name);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error creating accessory material',
        error: error.code,
      });
    }
  }

  static async update({ params: { id }, body: { name } }, res) {
    try {
      const { error } = validateAccessoryMaterialData({ name });

      if (error) {
        return res.status(400).json({
          message: 'Invalid accessory material data',
          details: error.issues,
        });
      }

      if (
        !(await AccessoryMaterialsController.validateMaterialExistence(id, res))
      )
        return;

      await AccessoryMaterialsModel.update(id, name);
      res.json({ message: 'Accessory material updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating accessory material',
        error: error.code,
      });
    }
  }

  static async delete({ params: { id } }, res) {
    try {
      if (
        !(await AccessoryMaterialsController.validateMaterialExistence(id, res))
      )
        return;

      if (await AccessoryMaterialsModel.materialInUse(id)) {
        return res.status(400).json({
          message: 'Cannot delete material in use by accessories',
        });
      }

      await AccessoryMaterialsModel.delete(id);
      res.json({ message: 'Accessory material deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting accessory material',
        error: error.code,
      });
    }
  }

  static async validateMaterialExistence(id, res) {
    const material = await AccessoryMaterialsModel.getById(id);
    if (!material.length) {
      res.status(404).json({ message: 'Accessory material not found' });
      return false;
    }

    return true;
  }
}
