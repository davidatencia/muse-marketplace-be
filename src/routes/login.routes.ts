import UserController from '@controllers/user.controller.js';
import { Router, json } from 'express';

const loginRouter = Router();
loginRouter.use(json());

loginRouter.post('/', UserController.login);

export default loginRouter;
