import AccessoryCategoriesController from '@controllers/accessory-categories.controller.js';
import authMiddleware from '@middlewares/auth.middleware.js';
import { Router, json } from 'express';

const accessoryCategoriesRouter = Router();

accessoryCategoriesRouter.get('/', AccessoryCategoriesController.getAll);

accessoryCategoriesRouter.use(json(), authMiddleware);

accessoryCategoriesRouter.post('/', AccessoryCategoriesController.create);
accessoryCategoriesRouter.put('/:id', AccessoryCategoriesController.update);
accessoryCategoriesRouter.delete('/:id', AccessoryCategoriesController.delete);

export default accessoryCategoriesRouter;
