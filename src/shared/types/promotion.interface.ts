import { RowDataPacket } from "mysql2";

export interface PromotionRow {
    id: number;
    description: string;
    discount: number;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}

export interface PromotionRowDB extends PromotionRow, RowDataPacket {}
