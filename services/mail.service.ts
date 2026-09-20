import transporter, { getMailCredentials } from '@/lib/nodemailer';
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

    // 2. Send via FormSubmit.co directly to Tap2Read (tap2read26@gmail.com)
    const FORMSUBMIT_TOKEN = process.env.FORMSUBMIT_TOKEN || 'f28e37af4550bda3f6ab38f03794426a';
    const formsubmitUrl = `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`;
    try {
      const siteUrl = process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost')
        ? process.env.NEXTAUTH_URL
        : 'https://tap2read.vercel.app';
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

      const responseData = await response.json().catch(() => null);
      if (response.ok && (responseData?.success === 'true' || responseData?.success === true)) {
        return { success: true, provider: 'formsubmit' };
      }
      console.warn('[Tap2Read Contact] FormSubmit responded with:', responseData || response.status);
    } catch (formsubmitError) {
      console.error('[Tap2Read Contact] Failed to send to FormSubmit:', formsubmitError);
    }

    // 3. Direct Nodemailer Email with the exact key-value document structure
    const { user: mailUser, pass: mailPass } = getMailCredentials();
    const hasGmailConfig =
      mailUser &&
      !mailUser.includes('your-gmail') &&
      mailPass &&
      !mailPass.includes('your-16-char');

    if (hasGmailConfig) {
      try {
        const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'tap2read26@gmail.com';

        await transporter.sendMail({
          from: `"Tap2Read Contact Form" <${mailUser}>`,
          to: receiver,
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

  async sendReplyEmail(data: {
    messageId?: number;
    to: string;
    toName?: string;
    subject: string;
    replyMessage: string;
    originalMessage?: string;
    senderName?: string;
  }) {
    const { user: senderEmail, pass: senderPass } = getMailCredentials();
    const hasGmailConfig =
      senderEmail &&
      !senderEmail.includes('your-gmail') &&
      senderPass &&
      !senderPass.includes('your-16-char');

    if (!hasGmailConfig) {
      throw new Error(
        'Email sender credentials not configured. Please set GMAIL_APP_PASSWORD in your .env file.'
      );
    }

    const mailSubject = data.subject.startsWith('Re:') ? data.subject : `Re: ${data.subject}`;
    const plainText = `${data.replyMessage}\n\n---\nBest regards,\nThe Tap2Read Teaching & Research Team\n${senderEmail}\n\n${data.originalMessage ? `Original Inquiry:\n${data.originalMessage}` : ''}`;

    const sendResult = await transporter.sendMail({
      from: `"Tap2Read Learning" <${senderEmail}>`,
      to: data.to,
      replyTo: senderEmail,
      subject: mailSubject,
      text: plainText,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);" cellspacing="0" cellpadding="0">
          
          <!-- Top Accent Line -->
          <tr>
            <td style="background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%); height: 4px; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 24px 28px 18px 28px; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">Tap2Read</span>
                    <span style="font-size: 12px; color: #64748b; margin-left: 8px; font-weight: 500;">| &nbsp;Learning &amp; Literacy Support</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #4f46e5; background-color: #eef2ff; padding: 3px 9px; border-radius: 9999px;">Official Response</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #0f172a; font-weight: 600;">
                Dear ${data.toName || 'Sir/Ma\'am'},
              </p>

              <div style="font-size: 15px; color: #334155; line-height: 1.7; white-space: pre-wrap; margin-bottom: 24px;">${data.replyMessage}</div>

              <!-- Signature Block -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 18px; width: 100%;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; color: #475569; font-weight: 500;">Warm regards,</p>
                    <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 700; color: #0f172a;">The Tap2Read Teaching &amp; Research Team</p>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #64748b;">Early Reading Pedagogical Research Initiative</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">
                      <a href="mailto:${senderEmail}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${senderEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quoted Previous Inquiry -->
              ${data.originalMessage ? `
                <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Previous Inquiry:</p>
                  <div style="border-left: 3px solid #cbd5e1; padding: 4px 0 4px 12px; font-size: 13px; color: #64748b; line-height: 1.6; white-space: pre-wrap;">${data.originalMessage}</div>
                </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                &copy; 2026 Tap2Read. Early Childhood Literacy &amp; Multimedia Reading Program.<br />
                This email was sent in direct response to your inquiry submitted on <a href="https://tap2read.vercel.app" style="color: #64748b; text-decoration: underline;">tap2read.vercel.app</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    // If linked to an existing message thread, persist reply to database and mark thread as read
    if (data.messageId) {
      try {
        await messageRepository.createReply({
          messageId: data.messageId,
          senderType: 'TEACHER',
          senderName: data.senderName || 'Tap2Read Team',
          senderEmail: senderEmail,
          content: data.replyMessage,
        });
        await messageRepository.markAsRead(data.messageId);
      } catch (dbErr) {
        console.error('[Tap2Read Reply] Failed to persist reply in database:', dbErr);
      }
    }

    return sendResult;
  },

  async getAllMessages() {
    return messageRepository.findAll();
  },

  async markAsRead(id: number) {
    return messageRepository.markAsRead(id);
  },

  async markAsUnread(id: number) {
    return messageRepository.markAsUnread(id);
  },

  async getUnreadCount() {
    return messageRepository.getUnreadCount();
  },

  async deleteMessage(id: number) {
    return messageRepository.delete(id);
  },
};
