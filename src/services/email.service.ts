import { CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO, RESEND_API_KEY } from '@configFile';
import { ContactData } from '@schemas/contact.schema.js';
import { Resend } from 'resend';

export class EmailService {
  static async sendContactMessage({ name, email, message }: ContactData): Promise<void> {
    if (!RESEND_API_KEY) throw new Error('Resend API key is not defined');
    if (!CONTACT_EMAIL_FROM) throw new Error('Contact email sender is not defined');
    if (!CONTACT_EMAIL_TO) throw new Error('Contact email recipient is not defined');

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: CONTACT_EMAIL_FROM,
      to: CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) throw new Error(error.message);
  }
}
