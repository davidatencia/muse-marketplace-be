import dbConnection from '@config/db.js';
import { PromotionData } from '@schemas/promotion.schema.js';
import {
  PromotionRow,
  PromotionRowDB,
} from '@sharedTypes/promotion.interface.js';
import { ResultSetHeader } from 'mysql2';

export default class PromotionsModel {
  static async getAll(): Promise<PromotionRow[]> {
    const [promotions] = await dbConnection.query<PromotionRowDB[]>(
      `SELECT * FROM promotions ORDER BY is_active DESC;`,
    );
    return promotions;
  }

  static async create(
    data: PromotionData,
  ): Promise<{ id: number; description: string }> {
    const { description, discount, is_active } = data;
    const [result] = await dbConnection.query<ResultSetHeader>(
      `INSERT INTO promotions (description, discount, is_active) VALUES (?, ?, ?);`,
      [description, discount, is_active],
    );

    return { id: result.insertId, description: description };
  }

  static async update(
    id: number | string,
    data: PromotionData,
  ): Promise<boolean> {
    const { description, discount, is_active } = data;
    const [result] = await dbConnection.query<ResultSetHeader>(
      `UPDATE promotions SET description = ?, discount = ?, is_active = ? WHERE id = ?;`,
      [description, discount, is_active, id],
    );

    return result.affectedRows > 0;
  }

  static async delete(id: number | string): Promise<boolean> {
    const [result] = await dbConnection.query<ResultSetHeader>(
      `DELETE FROM promotions WHERE id = ?;`,
      [id],
    );
    return result.affectedRows > 0;
  }
}
