import express from 'express';
import logger from 'morgan';
import accessoriesRouter from './routes/accessories.routes.js';
import accessoryCategoriesRouter from './routes/accessory-categories.routes.js';
import accessoryMaterialsRouter from './routes/accessory-materials.route.js';
import corsMiddleware from './middlewares/cors.middleware.js';
import notFoundMiddleware from './middlewares/errors.middleware.js';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(corsMiddleware);

app.use('/accessories', accessoriesRouter);
app.use('/accessory-categories', accessoryCategoriesRouter);
app.use('/accessory-materials', accessoryMaterialsRouter);
app.use(notFoundMiddleware);

export default app;
