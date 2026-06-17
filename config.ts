export const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SECRET_JWT_KEY,
} = process.env;

export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DEFAULT_PORT = Number(process.env.DEFAULT_PORT) || 3000;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;