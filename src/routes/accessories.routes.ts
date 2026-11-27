import AccessoriesController from '@controllers/accessories.controller.js';
import authMiddleware from '@middlewares/auth.middleware.js';
import { Router, json } from 'express';

const accessoriesRouter = Router();

accessoriesRouter.get('/', AccessoriesController.getAll);
accessoriesRouter.get('/:id', AccessoriesController.getById);

accessoriesRouter.use(json(), authMiddleware);

accessoriesRouter.post('/', AccessoriesController.create);
accessoriesRouter.put('/:id', AccessoriesController.update);
accessoriesRouter.patch('/:id', AccessoriesController.updatePartial);
accessoriesRouter.delete('/:id', AccessoriesController.delete);

export default accessoriesRouter;
