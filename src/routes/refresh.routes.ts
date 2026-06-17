import UserController from '@controllers/user.controller.js';
import { Router, json } from 'express';

const refreshRouter = Router();
refreshRouter.use(json());

refreshRouter.post('/', UserController.refresh);

export default refreshRouter;
