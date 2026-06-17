import AccessoriesController from '@controllers/accessories.controller.js';
import { Router, json } from 'express';

const accessoriesRouter = Router();

accessoriesRouter.get('/', AccessoriesController.getAllAccessories);
accessoriesRouter.get('/:id', AccessoriesController.getAccessoryById);

accessoriesRouter.use(json());

accessoriesRouter.post('/', AccessoriesController.createAccessory);
accessoriesRouter.put('/:id', AccessoriesController.updateAccessory);
accessoriesRouter.patch('/:id', AccessoriesController.updateAccessoryPartial);
accessoriesRouter.delete('/:id', AccessoriesController.deleteAccessory);

export default accessoriesRouter;
