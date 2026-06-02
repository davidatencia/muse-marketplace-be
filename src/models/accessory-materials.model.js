import dbConnection from '../config/db.js';

export default class AccessoryMaterialsModel {
  static async getAll() {
    const [materials] = await dbConnection.query(
      `SELECT
            id,
            name
        FROM materials
        ORDER BY name;`,
    );
    return materials || [];
  }

  static async getById(id) {
    const [material] = await dbConnection.query(
      `SELECT
            id,
            name
        FROM materials
        WHERE id = ?;`,
      [id],
    );
    return material;
  }

  static async create(name) {
    const [result] = await dbConnection.query(
      `INSERT INTO materials (name) VALUES (?);`,
      [name],
    );
    return { id: result.insertId, name };
  }

  static async update(id, name) {
    await dbConnection.query(`UPDATE materials SET name = ? WHERE id = ?;`, [
      name,
      id,
    ]);
  }

  static async materialInUse(id) {
    const [[{ count }]] = await dbConnection.query(
      `SELECT COUNT(*) AS count FROM accessories WHERE material_id = ?;`,
      [id],
    );
    return count > 0;
  }

  static delete(id) {
    return dbConnection.query(`DELETE FROM materials WHERE id = ?;`, [id]);
  }
}
