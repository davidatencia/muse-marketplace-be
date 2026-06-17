import AccessoryCategoriesController from '@controllers/accessory-categories.controller.js';
import { Router, json } from 'express';

const accessoryCategoriesRouter = Router();

accessoryCategoriesRouter.get('/', AccessoryCategoriesController.getAllCategories);

accessoryCategoriesRouter.use(json());

accessoryCategoriesRouter.post('/', AccessoryCategoriesController.createCategory);
accessoryCategoriesRouter.put('/:id', AccessoryCategoriesController.updateCategory);
accessoryCategoriesRouter.delete('/:id', AccessoryCategoriesController.deleteCategory);

export default accessoryCategoriesRouter;
