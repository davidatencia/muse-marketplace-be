import { ResultSetHeader, RowDataPacket } from 'mysql2';
import dbConnection from '@config/db.js';
import { AccessoryData } from '@schemas/accessory.schema.js';
import { AccessoryRow, AccessoryWithId, AccessoryRowDB } from '@sharedTypes/accessory.interface.js';

const ACCESSORY_SELECT = `
  SELECT
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
  LEFT JOIN accessory_materials am ON a.id = am.accessory_id
  LEFT JOIN materials m ON am.material_id = m.id
  JOIN categories c ON a.category_id = c.id`;

const ACCESSORY_GROUP_BY = `
  GROUP BY
      a.id, a.name, a.description, a.img, a.handmade,
      a.highlighted, a.price, a.stock, a.rating, c.name`;

export default class AccessoryModel {
  static async getAll(): Promise<AccessoryRow[]> {
    const [accessories] = await dbConnection.query<AccessoryRowDB[]>(
      `${ACCESSORY_SELECT} ${ACCESSORY_GROUP_BY} ORDER BY a.name;`,
    );
    return accessories;
  }

  static async getById(id: string): Promise<AccessoryRow[]> {
    const [accessories] = await dbConnection.query<AccessoryRowDB[]>(
      `${ACCESSORY_SELECT}
      WHERE a.id = UUID_TO_BIN(?)
      ${ACCESSORY_GROUP_BY}
      ORDER BY a.name;`,
      [id],
    );
    return accessories;
  }

  static async create(data: AccessoryData[]): Promise<AccessoryWithId[]> {
    const items: AccessoryWithId[] = await Promise.all(
      data.map(async (item) => {
        const [rows] = await dbConnection.query<(RowDataPacket & { uuid: string })[]>(
          'SELECT UUID() AS uuid;',
        );
        return { id: rows[0].uuid, ...item };
      }),
    );

    const accessoryPlaceholders = items
      .map(() => '(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ');

    const accessoryValues = items.flatMap(
      ({ id, category_id, name, description, img, handmade, available, highlighted, price, stock, rating }) =>
        [id, category_id, name, description, img, handmade, available, highlighted, price, stock, rating ?? null],
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

  static async update(id: string, data: AccessoryData): Promise<boolean> {
    const { category_id, name, description, img, handmade, available, highlighted, price, stock, rating, materials } = data;

    await dbConnection.beginTransaction();
    try {
      const [result] = await dbConnection.query<ResultSetHeader>(
        'UPDATE accessories SET category_id = ?, name = ?, description = ?, img = ?, handmade = ?, available = ?, highlighted = ?, price = ?, stock = ?, rating = ? WHERE id = UUID_TO_BIN(?)',
        [category_id, name, description, img, handmade, available, highlighted, price, stock, rating ?? null, id],
      );

      if (result.affectedRows > 0 && materials !== undefined) {
        await AccessoryModel.syncMaterials(id, materials);
      }

      await dbConnection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await dbConnection.rollback();
      throw error;
    }
  }

  static async partialUpdate(id: string, data: Partial<AccessoryData>): Promise<boolean> {
    const { materials, ...scalarFields } = data;
    const keys = Object.keys(scalarFields) as (keyof typeof scalarFields)[];

    await dbConnection.beginTransaction();
    try {
      let updated: boolean;

      if (keys.length > 0) {
        const fields = keys.map((key) => `${key} = ?`).join(', ');
        const values = [
          ...keys.map((key) => (scalarFields[key] === undefined ? null : scalarFields[key])),
          id,
        ];

        const [result] = await dbConnection.query<ResultSetHeader>(
          `UPDATE accessories SET ${fields} WHERE id = UUID_TO_BIN(?)`,
          values,
        );
        updated = result.affectedRows > 0;
      } else {
        const [rows] = await dbConnection.query<RowDataPacket[]>(
          'SELECT 1 FROM accessories WHERE id = UUID_TO_BIN(?)',
          [id],
        );
        updated = rows.length > 0;
      }

      if (updated && materials !== undefined) {
        await AccessoryModel.syncMaterials(id, materials);
      }

      await dbConnection.commit();
      return updated;
    } catch (error) {
      await dbConnection.rollback();
      throw error;
    }
  }

  private static async syncMaterials(id: string, materials: number[]): Promise<void> {
    await dbConnection.query('DELETE FROM accessory_materials WHERE accessory_id = UUID_TO_BIN(?)', [id]);

    if (materials.length > 0) {
      const placeholders = materials.map(() => '(UUID_TO_BIN(?), ?)').join(', ');
      const values = materials.flatMap((materialId) => [id, materialId]);
      await dbConnection.query(
        `INSERT INTO accessory_materials (accessory_id, material_id) VALUES ${placeholders}`,
        values,
      );
    }
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      'DELETE FROM accessories WHERE id = UUID_TO_BIN(?)',
      [id],
    );
    return result.affectedRows > 0;
  }
}
