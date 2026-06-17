import UserController from '@controllers/user.controller.js';
import { Router, json } from 'express';

const registerRouter = Router();
registerRouter.use(json());

registerRouter.post('/', UserController.register);

export default registerRouter;
