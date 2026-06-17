import authMiddleware from '@middlewares/auth.middleware.js';
import corsMiddleware from '@middlewares/cors.middleware.js';
import notFoundMiddleware from '@middlewares/errors.middleware.js';
import accessoriesRouter from '@routes/accessories.routes.js';
import accessoryCategoriesRouter from '@routes/accessory-categories.routes.js';
import accessoryMaterialsRouter from '@routes/accessory-materials.route.js';
import loginRouter from '@routes/login.routes.js';
import refreshRouter from '@routes/refresh.routes.js';
import registerRouter from '@routes/register.routes.js';
import express from 'express';
import logger from 'morgan';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(corsMiddleware);

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/refresh', refreshRouter);

app.use(authMiddleware)

app.use('/accessories', accessoriesRouter);
app.use('/accessory-categories', accessoryCategoriesRouter);
app.use('/accessory-materials', accessoryMaterialsRouter);
app.use(notFoundMiddleware);

export default app;
