import ContactController from '@controllers/contact.controller.js';
import { Router, json } from 'express';

const contactRouter = Router();
contactRouter.use(json());

contactRouter.post('/', ContactController.send);

export default contactRouter;
