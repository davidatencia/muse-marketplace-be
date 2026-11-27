import PromotionsController from '@controllers/promotions.controller.js';
import authMiddleware from '@middlewares/auth.middleware.js';
import { Router, json } from 'express';

const promotionsRouter = Router();

promotionsRouter.get('/', PromotionsController.getAll);

promotionsRouter.use(json(), authMiddleware);

promotionsRouter.post('/', PromotionsController.create);
promotionsRouter.put('/:id', PromotionsController.update);
promotionsRouter.delete('/:id', PromotionsController.delete);

export default promotionsRouter;
