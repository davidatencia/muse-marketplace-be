import AccessoryMaterialsController from '@controllers/accessory-materials.controller.js';
import authMiddleware from '@middlewares/auth.middleware.js';
import { Router, json } from 'express';

const accessoryMaterialsRouter = Router();

accessoryMaterialsRouter.use(authMiddleware);

accessoryMaterialsRouter.get('/', AccessoryMaterialsController.getAll);

accessoryMaterialsRouter.use(json());

accessoryMaterialsRouter.post('/', AccessoryMaterialsController.create);
accessoryMaterialsRouter.put('/:id', AccessoryMaterialsController.update);
accessoryMaterialsRouter.delete('/:id', AccessoryMaterialsController.delete);

export default accessoryMaterialsRouter;
