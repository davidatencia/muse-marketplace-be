import { randomUUID } from 'node:crypto';
import { readJSON } from '../utils/readJSON.js';

const accessories = readJSON('../utils/accessories.json');

export default class AccessoryModel {
  static async getAll() {
    return await accessories;
  }

  static async getById(id) {
    return await accessories.find((accessory) => accessory.id === id);
  }

  static async create(data) {
    const newAccessories = data.map((item) => ({
      id: randomUUID(),
      ...item,
    }));

    return await newAccessories;
  }

  static async update(id, data) {
    const index = accessories.findIndex(
      (accessory) => accessory.id === id,
    );

    if (index === -1) {
      return null;
    }

    accessories[index] = { ...accessories[index], ...data };

    return await accessories[index];
  }

  static async delete(id) {
    const index = accessories.findIndex(
      (accessory) => accessory.id === id,
    );

    if (index === -1) {
      return false;
    }

    const deletedAccessory = accessories.splice(index, 1);

    return true;
  }
}
