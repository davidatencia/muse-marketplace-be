import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnection from '@config/db.js';
import { NamedRow, NamedRowDB } from '@sharedTypes/named-row.interface.js';

export default class AccessoryCategoriesModel {
  static async getAll(): Promise<NamedRow[]> {
    const [categories] = await dbConnection.query<NamedRowDB[]>(
      `SELECT id, name FROM categories ORDER BY name;`,
    );
    return categories;
  }

  static async getById(id: number | string): Promise<NamedRow[]> {
    const [rows] = await dbConnection.query<NamedRowDB[]>(
      `SELECT id, name FROM categories WHERE id = ?;`,
      [id],
    );
    return rows;
  }

  static async create(name: string): Promise<string> {
    await dbConnection.query<ResultSetHeader>(
      `INSERT INTO categories (name) VALUES (?);`,
      [name],
    );
    return name;
  }

  static async update(id: number | string, name: string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `UPDATE categories SET name = ? WHERE id = ?;`,
      [name, id],
    );
    return result.affectedRows > 0;
  }

  static async hasAccessories(id: number | string): Promise<boolean> {
    const [[{ count }]] = await dbConnection.query<
      (RowDataPacket & { count: number })[]
    >(`SELECT COUNT(*) AS count FROM accessories WHERE category_id = ?;`, [id]);
    return Number(count) > 0;
  }

  static async delete(id: number | string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `DELETE FROM categories WHERE id = ?;`,
      [id],
    );
    return result.affectedRows > 0;
  }
}
