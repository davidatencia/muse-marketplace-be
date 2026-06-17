import { AccessoryData } from '@schemas/accessory.schema.js';
import {  RowDataPacket } from 'mysql2';

export interface AccessoryRow {
  id: string;
  name: string;
  description: string;
  img: string;
  handmade: number;
  highlighted: number;
  available: number;
  price: number;
  stock: number;
  rating?: number;
  category: string;
  materials: string[];
}

export type AccessoryWithId = AccessoryData & { id: string };

export interface AccessoryRowDB extends AccessoryRow, RowDataPacket {}
