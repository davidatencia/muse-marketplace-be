import { Request, Response } from 'express';
import PromotionsModel from '@models/promotions.model.js';
import { validatePromotionData } from '@schemas/promotion.schema.js';

export default class PromotionsController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      res.json(await PromotionsModel.getAll());
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving promotions',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async create(
    { body }: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validatePromotionData(body);

      if (error) {
        res.status(400).json({
          message: 'Invalid promotion data',
          details: error.issues[0].message,
        });
        return;
      }

      res.status(201).json(await PromotionsModel.create(body));
    } catch (error) {
      res.status(500).json({
        message: 'Error creating promotion',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async update(
    { params: { id }, body }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const { error } = validatePromotionData(body);

      if (error) {
        res.status(400).json({
          message: 'Invalid promotion data',
          details: error.issues[0].message,
        });
        return;
      }

      const updatedPromotion = await PromotionsModel.update(
        id,
        body,
      );

      if (!updatedPromotion) {
        res.status(404).json({ message: 'Promotion not found' });
        return;
      }

      res.json({ message: 'Promotion updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating promotion',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }

  static async delete(
    { params: { id } }: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const deletedPromotion = await PromotionsModel.delete(id);

      if (!deletedPromotion) {
        res.status(404).json({ message: 'Promotion not found' });
        return;
      }

      res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting promotion',
        error: (error as NodeJS.ErrnoException).code,
      });
    }
  }
}
