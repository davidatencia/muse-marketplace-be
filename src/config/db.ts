import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@configFile';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default connection;
