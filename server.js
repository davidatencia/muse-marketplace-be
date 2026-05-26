import express from 'express';
import accessoriesRouter from './src/routes/accessories.routes.js';
import corsMiddleware from './src/middlewares/cors.middleware.js';
import notFoundMiddleware from './src/middlewares/not-found.middleware.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.disable('x-powered-by');
app.use(corsMiddleware);

app.use('/accessories', accessoriesRouter);

app.use(notFoundMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
