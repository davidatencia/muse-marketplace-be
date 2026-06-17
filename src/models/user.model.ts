import { UserInformation, UserLogin, UserRegister, UserRow } from '@sharedTypes/user.interface.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from '@configFile';
import dbConnection from '@config/db.js';

interface UserRowDB extends UserRow, RowDataPacket {}

export class UserModel {
  static async login(data: UserLogin): Promise<UserInformation | null> {
    const [rows] = await dbConnection.query<UserRowDB[]>(
      `SELECT
        BIN_TO_UUID(id) AS id,
        name,
        email,
        password,
        created_at,
        updated_at,
        is_active
       FROM users
       WHERE email = ?;`,
      [data.email],
    );

    if (!rows.length) return null;

    const user = rows[0];
    const isValid = await compare(data.password, user.password);
    if (!isValid) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async register(data: UserRegister): Promise<void> {
    const passwordHash = await hash(data.password, SALT_ROUNDS);

    await dbConnection.query<ResultSetHeader>(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`,
      [data.name, data.email, passwordHash],
    );
  }
}
