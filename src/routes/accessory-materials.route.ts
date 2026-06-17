import AccessoryMaterialsController from '@controllers/accessory-materials.controller.js';
import { Router, json } from 'express';

const accessoryMaterialsRouter = Router();

accessoryMaterialsRouter.get('/', AccessoryMaterialsController.getAll);

accessoryMaterialsRouter.use(json());

accessoryMaterialsRouter.post('/', AccessoryMaterialsController.create);
accessoryMaterialsRouter.put('/:id', AccessoryMaterialsController.update);
accessoryMaterialsRouter.delete('/:id', AccessoryMaterialsController.delete);

export default accessoryMaterialsRouter;
