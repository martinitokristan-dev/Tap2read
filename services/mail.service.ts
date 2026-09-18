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

    // 2. Send via Formspree
    const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/xrpbgnbj';
    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: data.senderName,
          email: data.senderEmail,
          subject: data.subject || 'Tap2Read Inquiry',
          message: data.message,
        }),
      });

      if (response.ok) {
        return { success: true, provider: 'formspree' };
      }
      console.warn('[Tap2Read Contact] Formspree responded with non-200 status:', response.status);
    } catch (formspreeError) {
      console.error('[Tap2Read Contact] Failed to send to Formspree:', formspreeError);
    }

    // 3. Fallback to Gmail/Nodemailer if credentials exist
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
          subject: data.subject ? `${data.subject} — Tap2Read` : `New Message from ${data.senderName} — Tap2Read`,
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
                ${data.subject ? `<tr><td style="padding:8px; font-weight:bold;">Subject:</td><td style="padding:8px;">${data.subject}</td></tr>` : ''}
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
        console.error('[Tap2Read Contact] Nodemailer fallback failed:', mailError);
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
