import transporter from '@/lib/nodemailer';
import { messageRepository } from '@/repositories/message.repository';
import { ContactForm } from '@/types/form.types';

export const mailService = {
  async sendContactEmail(data: ContactForm) {
    // Save to database
    await messageRepository.create(data);

    // If Gmail credentials are placeholder or missing, log a reminder and return
    const isPlaceholderUser = !process.env.GMAIL_USER || process.env.GMAIL_USER.includes('your-gmail');
    const isPlaceholderPass = !process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD.includes('your-16-char');

    if (isPlaceholderUser || isPlaceholderPass) {
      console.warn('[Tap2Read Contact] Email credentials not configured in .env. Message was saved to database only.');
      return;
    }

    // Send email notification
    try {
      await transporter.sendMail({
        from: `"Tap2Read Contact Form" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
        replyTo: data.senderEmail,
        subject: `New Message from ${data.senderName} — Tap2Read`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4A90D9;">New Message from Tap2Read</h2>
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:8px; font-weight:bold; width:120px;">Name:</td>
                <td style="padding:8px;">${data.senderName}</td>
              </tr>
              <tr style="background:#f5f5f5;">
                <td style="padding:8px; font-weight:bold;">Email:</td>
                <td style="padding:8px;">
                  <a href="mailto:${data.senderEmail}">${data.senderEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:bold; vertical-align:top;">Message:</td>
                <td style="padding:8px;">${data.message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>
            <p style="color:#888; font-size:12px; margin-top:24px;">
              Sent via Tap2Read contact form
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('[Tap2Read Contact] Failed to send email notification:', mailError);
    }
  },

  async getAllMessages() {
    return messageRepository.findAll();
  },

  async deleteMessage(id: number) {
    return messageRepository.delete(id);
  },
};
