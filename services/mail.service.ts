import transporter from '@/lib/nodemailer';
import { messageRepository } from '@/repositories/message.repository';
import { ContactForm } from '@/types/form.types';

export const mailService = {
  async sendContactEmail(data: ContactForm) {
    // 1. Save to local database
    try {
      await messageRepository.create({
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        message: data.subject ? `[Subject: ${data.subject}]\n\n${data.message}` : data.message,
      });
    } catch (dbError) {
      console.warn('[Tap2Read Contact] Could not save message to database:', dbError);
    }

    // 2. Send via FormSubmit.co
    const recipientEmail = process.env.FORMSUBMIT_EMAIL || 'bobis.sb@stud.pnu.edu.ph';
    const formsubmitUrl = `https://formsubmit.co/ajax/${recipientEmail}`;
    try {
      const siteUrl = process.env.NEXTAUTH_URL || 'https://tap2read.vercel.app';
      const response = await fetch(formsubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': siteUrl,
          'Referer': `${siteUrl}/#contact`,
        },
        body: JSON.stringify({
          name: data.senderName,
          email: data.senderEmail,
          subject: data.subject || 'General Inquiry',
          message: data.message,
          _subject: 'New Tap2Read Message!',
          _replyto: data.senderEmail,
        }),
      });

      if (response.ok) {
        return { success: true, provider: 'formsubmit' };
      }
      console.warn('[Tap2Read Contact] FormSubmit responded with non-200 status:', response.status);
    } catch (formsubmitError) {
      console.error('[Tap2Read Contact] Failed to send to FormSubmit:', formsubmitError);
    }

    // 3. Direct Nodemailer Email with the exact key-value document structure
    const hasGmailConfig =
      process.env.GMAIL_USER &&
      !process.env.GMAIL_USER.includes('your-gmail') &&
      process.env.GMAIL_APP_PASSWORD &&
      !process.env.GMAIL_APP_PASSWORD.includes('your-16-char');

    if (hasGmailConfig) {
      try {
        await transporter.sendMail({
          from: `"Tap2Read Contact Form" <${process.env.GMAIL_USER}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
          replyTo: data.senderEmail,
          subject: data.subject ? `[Tap2Read] ${data.subject}` : `[Tap2Read] Message from ${data.senderName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0; padding: 24px; color: #1e293b; line-height: 1.6;">
              <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Sender Name:</strong> ${data.senderName}</p>
              <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Sender Email:</strong> <a href="mailto:${data.senderEmail}" style="color: #2563eb; text-decoration: none;">${data.senderEmail}</a></p>
              <p style="margin: 0 0 16px 0; font-size: 15px;"><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
              
              <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
              
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold;">Message:</p>
              <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('[Tap2Read Contact] Direct email failed:', mailError);
      }
    }
  },

  async getAllMessages() {
    return messageRepository.findAll();
  },

  async deleteMessage(id: number) {
    return messageRepository.delete(id);
  },
};
