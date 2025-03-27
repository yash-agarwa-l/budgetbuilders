import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Mail transport. The console transport keeps local development and tests
 * free of any external dependency; switching MAIL_TRANSPORT to "smtp" is the
 * only change needed to send real mail.
 */
function createTransport() {
  if (env.MAIL_TRANSPORT === "smtp") {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: (env.SMTP_PORT ?? 587) === 465,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    });
  }

  return {
    async sendMail(message) {
      logger.info(
        { to: message.to, subject: message.subject },
        "mail suppressed (console transport)",
      );
      return { messageId: "console" };
    },
  };
}

const transport = createTransport();

export async function sendMail({ to, subject, text, html }) {
  return transport.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
}

export async function sendOtpMail(email, otp) {
  const minutes = env.OTP_TTL_MINUTES;

  // The code is logged only outside production so a developer can complete a
  // login without a configured mail provider.
  if (env.MAIL_TRANSPORT === "console") {
    logger.info({ email, otp }, "login code issued");
  }

  return sendMail({
    to: email,
    subject: "Your BudgetBuilders login code",
    text: `Your login code is ${otp}. It expires in ${minutes} minutes.`,
    html: `<p>Your BudgetBuilders login code is <strong>${otp}</strong>.</p><p>It expires in ${minutes} minutes. If you did not request it, you can ignore this email.</p>`,
  });
}
