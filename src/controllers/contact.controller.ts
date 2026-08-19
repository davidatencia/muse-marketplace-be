import { validateContactData } from '@schemas/contact.schema.js';
import { EmailService } from '@services/email.service.js';
import { Request, Response } from 'express';

export default class ContactController {
  static async send({ body }: Request, res: Response): Promise<void> {
    try {
      const { data, error } = validateContactData(body);

      if (error) {
        res.status(400).json({
          message: 'Invalid contact data',
          details: error.issues[0].message,
        });
        return;
      }

      await EmailService.sendContactMessage(data);
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending contact message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  }
}
