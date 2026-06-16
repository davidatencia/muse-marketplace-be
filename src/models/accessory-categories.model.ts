import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dbConnection from '@config/db.js';

interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
}

export default class AccessoryCategoriesModel {
  static async getAll(): Promise<CategoryRow[]> {
    const [categories] = await dbConnection.query<CategoryRow[]>(
      `SELECT id, name FROM categories ORDER BY name;`,
    );
    return categories;
  }

  static async getById(id: number | string): Promise<CategoryRow[]> {
    const [rows] = await dbConnection.query<CategoryRow[]>(
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

  static async update(id: number | string, name: string): Promise<ResultSetHeader> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `UPDATE categories SET name = ? WHERE id = ?;`,
      [name, id],
    );

    return result;
  }

  static async hasAccessories(id: number | string): Promise<boolean> {
    const [[{ count }]] = await dbConnection.query<
      (RowDataPacket & { count: number })[]
    >(`SELECT COUNT(*) AS count FROM accessories WHERE category_id = ?;`, [id]);
    return Number(count) > 0;
  }

  static async delete(id: number | string): Promise<[ResultSetHeader, any]> {
    return await dbConnection.query(`DELETE FROM categories WHERE id = ?;`, [id]);
  }
}
