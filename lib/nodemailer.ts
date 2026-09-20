import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export function getMailCredentials() {
  let user = process.env.GMAIL_USER;
  let pass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL__APP_PASSWORD;

  // Fallback to reading directly from .env if in-memory process.env is stale or un-restarted
  if (!pass || pass.includes('your-16-char')) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const userMatch = content.match(/^GMAIL_USER=["']?([^"'\r\n]+)["']?/m);
        const passMatch = content.match(/^GMAIL_APP_PASSWORD=["']?([^"'\r\n]+)["']?/m);
        if (userMatch && userMatch[1]) user = userMatch[1].trim();
        if (passMatch && passMatch[1]) pass = passMatch[1].trim();
      }
    } catch (err) {
      console.warn('[Nodemailer] Could not read .env file directly:', err);
    }
  }

  return {
    user: user || 'tap2read26@gmail.com',
    pass: (pass || '').replace(/\s+/g, ''),
  };
}

export function getTransporter() {
  const { user, pass } = getMailCredentials();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

const transporter = {
  sendMail: (options: any) => getTransporter().sendMail(options),
  verify: (cb: any) => getTransporter().verify(cb),
};

export default transporter;

