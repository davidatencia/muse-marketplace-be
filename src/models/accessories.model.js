import { readJSON } from '../utils/readJSON.js';
import dbConnection from '../config/db.js';

export default class AccessoryModel {
  static async getAll() {
    const [accessories] = await dbConnection.query(
      `SELECT
          BIN_TO_UUID(a.id) AS id,
          a.name,
          a.description,
          a.img,
          a.handmade,
          a.highlighted,
          a.price,
          a.stock,
          a.rating,
          c.name AS category,
      IF(COUNT(m.id) > 0, JSON_ARRAYAGG(m.name), JSON_ARRAY()) AS materials
      FROM accessories a
      LEFT JOIN accessory_materials am
          ON a.id = am.accessory_id
      LEFT JOIN materials m
          ON am.material_id = m.id
      JOIN categories c
          ON a.category_id = c.id
      GROUP BY
          a.id,
          a.name,
          a.description,
          a.img,
          a.handmade,
          a.highlighted,
          a.price,
          a.stock,
          a.rating,
          c.name
      ORDER BY a.name;`,
    );

    return accessories || [];
  }

  static async getById(id) {
    const [accessories] = await dbConnection.query(
      `SELECT
          BIN_TO_UUID(a.id) AS id,
          a.name,
          a.description,
          a.img,
          a.handmade,
          a.highlighted,
          a.price,
          a.stock,
          a.rating,
          c.name AS category,
      IF(COUNT(m.id) > 0, JSON_ARRAYAGG(m.name), JSON_ARRAY()) AS materials
      FROM accessories a
      LEFT JOIN accessory_materials am
          ON a.id = am.accessory_id
      LEFT JOIN materials m
          ON am.material_id = m.id
      JOIN categories c
          ON a.category_id = c.id
      WHERE a.id = UUID_TO_BIN(?)
      GROUP BY
          a.id,
          a.name,
          a.description,
          a.img,
          a.handmade,
          a.highlighted,
          a.price,
          a.stock,
          a.rating,
          c.name
      ORDER BY a.name;`,
      [id],
    );
    return accessories;
  }

  static async create(data) {
    const items = await Promise.all(
      data.map(async (item) => {
        const [[{ uuid }]] = await dbConnection.query('SELECT UUID() AS uuid;');
        return { id: uuid, ...item };
      }),
    );

    const accessoryPlaceholders = items
      .map(() => '(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');

    const accessoryValues = items.flatMap(
      ({
        id,
        category_id,
        name,
        description,
        img,
        handmade,
        available,
        highlighted,
        price,
        stock,
        rating,
      }) => [
        id,
        category_id,
        name,
        description,
        img,
        handmade,
        available,
        highlighted,
        price,
        stock,
        rating ?? null,
      ],
    );

    const materialRows = items.flatMap(({ id, materials = [] }) =>
      materials.map((materialId) => [id, materialId]),
    );

    await dbConnection.beginTransaction();
    try {
      await dbConnection.query(
        `INSERT INTO accessories (id, category_id, name, description, img, handmade, available, highlighted, price, stock, rating) VALUES ${accessoryPlaceholders}`,
        accessoryValues,
      );

      if (materialRows.length > 0) {
        const materialPlaceholders = materialRows
          .map(() => '(UUID_TO_BIN(?), ?)')
          .join(', ');
        await dbConnection.query(
          `INSERT INTO accessory_materials (accessory_id, material_id) VALUES ${materialPlaceholders}`,
          materialRows.flat(),
        );
      }

      await dbConnection.commit();
    } catch (error) {
      await dbConnection.rollback();
      throw error;
    }

    return items;
  }

  static async update(id, data) {
    const {
      category_id,
      name,
      description,
      img,
      handmade,
      available,
      highlighted,
      price,
      stock,
      rating,
    } = data;

    const [result] = await dbConnection.query(
      'UPDATE accessories SET category_id = ?, name = ?, description = ?, img = ?, handmade = ?, available = ?, highlighted = ?, price = ?, stock = ?, rating = ? WHERE id = UUID_TO_BIN(?)',
      [
        category_id,
        name,
        description,
        img,
        handmade,
        available,
        highlighted,
        price,
        stock,
        rating ?? null,
        id,
      ],
    );

    return data;
  }

  static async partialUpdate(id, data) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(data).map((value) =>
      value === undefined ? null : value,
    );

    values.push(id);

    const [result] = await dbConnection.query(
      `UPDATE accessories SET ${fields} WHERE id = UUID_TO_BIN(?)`,
      values,
    );

    return data;
  }

  static async delete(id) {
    const [result] = await dbConnection.query(
      'DELETE FROM accessories WHERE id = UUID_TO_BIN(?)',
      [id],
    );

    return true;
  }
}
