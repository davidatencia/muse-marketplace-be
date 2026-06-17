import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnection from '@config/db.js';
import { NamedRow, NamedRowDB } from '@sharedTypes/named-row.interface.js';

export default class AccessoryMaterialsModel {
  static async getAll(): Promise<NamedRow[]> {
    const [materials] = await dbConnection.query<NamedRowDB[]>(
      `SELECT id, name FROM materials ORDER BY name;`,
    );
    return materials;
  }

  static async create(name: string): Promise<{ id: number; name: string }> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `INSERT INTO materials (name) VALUES (?);`,
      [name],
    );
    return { id: result.insertId, name };
  }

  static async update(id: number | string, name: string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `UPDATE materials SET name = ? WHERE id = ?;`,
      [name, id],
    );
    return result.affectedRows > 0;
  }

  static async getMissingMaterials(ids: number[]): Promise<number[]> {
    const placeholders = ids.map(() => '?').join(', ');
    const [found] = await dbConnection.query<(RowDataPacket & { id: number })[]>(
      `SELECT id FROM materials WHERE id IN (${placeholders});`,
      ids,
    );
    const foundIds = found.map((m) => m.id);
    return ids.filter((id) => !foundIds.includes(id));
  }

  static async materialInUse(id: number | string): Promise<boolean> {
    const [[{ count }]] = await dbConnection.query<
      (RowDataPacket & { count: number })[]
    >(`SELECT COUNT(*) AS count FROM accessory_materials WHERE material_id = ?;`, [id]);
    return Number(count) > 0;
  }

  static async delete(id: number | string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `DELETE FROM materials WHERE id = ?;`,
      [id],
    );
    return result.affectedRows > 0;
  }
}
