import dbConnection from '../config/db.js';

export default class AccessoryCategoriesModel {
  static async getAll() {
    const [categories] = await dbConnection.query(
      `SELECT
            id,
            name
        FROM categories
        ORDER BY name;`,
    );
    return categories || [];
  }

  static async getById(id) {
    const [category] = await dbConnection.query(
      `SELECT
            id,
            name
        FROM categories
        WHERE id = ?;`,
      [id],
    );
    return category;
  }

  static async create(name) {
    const [result] = await dbConnection.query(
      `INSERT INTO categories (name) VALUES (?);`,
      [name],
    );
    return result;
  }

  static async update(id, name) {
    await dbConnection.query(`UPDATE categories SET name = ? WHERE id = ?;`, [
      name,
      id,
    ]);
  }

  static async categoryInUse(id) {
    const [[{ count }]] = await dbConnection.query(
      `SELECT COUNT(*) AS count FROM accessories WHERE category_id = ?;`,
      [id],
    );
    return count > 0;
  }

  static delete(id) {
    return dbConnection.query(`DELETE FROM categories WHERE id = ?;`, [id]);
  }
}
