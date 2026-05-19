import { createTransport, type Transporter } from 'nodemailer';
import { loadConfig } from '@rental-platform/config';

/**
 * Generic SMTP transport for Better Auth hooks (verification, invitations).
 * Local/dev points at Mailpit (infra/docker-compose.yml, UI on :8025); prod
 * points SMTP_* at the deployment's provider — switching is config, not code.
 */
let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const { host, port, user, pass } = loadConfig().smtp;
    transporter = createTransport({
      host,
      port,
      secure: port === 465,
      ...(user && pass ? { auth: { user, pass } } : {}),
    });
  }
  return transporter;
}

export interface SendEmailArgs {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailArgs): Promise<void> {
  await getTransporter().sendMail({ from: loadConfig().smtp.from, to, subject, text });
}
