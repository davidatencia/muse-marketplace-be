import { RowDataPacket } from 'mysql2/promise';

export interface NamedRow {
  id: number;
  name: string;
}

export interface NamedRowDB extends NamedRow, RowDataPacket {}
