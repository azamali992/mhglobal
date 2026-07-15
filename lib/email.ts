import nodemailer from "nodemailer";

// Mail transporter.
//
// Preferred: authenticate against the company's own domain mailbox (e.g. the
// Hostinger inbox for info@mhglobalattire.com) so outgoing mail is genuinely
// *from* the company address. This requires the domain SMTP credentials:
//
//   SMTP_HOST      e.g. smtp.hostinger.com
//   SMTP_PORT      465 (SSL) or 587 (STARTTLS)
//   SMTP_USER      info@mhglobalattire.com   (the full mailbox address)
//   SMTP_PASSWORD  the mailbox password
//   MAIL_FROM      optional; defaults to SMTP_USER
//
// Fallback (legacy): if SMTP_HOST is not configured, fall back to Gmail using
// GMAIL_USER / GMAIL_APP_PASSWORD. Note that Gmail rewrites the visible sender
// to the authenticated Gmail account unless it is a verified "send as" alias,
// which is why domain SMTP above is preferred.
const smtpHost = process.env.SMTP_HOST;

export const transporter = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 465),
      // Port 465 is implicit SSL; anything else (e.g. 587) uses STARTTLS.
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

// The address mail is sent *from*. Prefer an explicit MAIL_FROM, then the
// authenticated domain mailbox (SMTP_USER), and only fall back to the Gmail
// account when no domain SMTP is configured.
const fromAddress =
  process.env.MAIL_FROM ||
  process.env.SMTP_USER ||
  process.env.GMAIL_USER ||
  "info@mhglobalattire.com";

/**
 * Sends an internal notification to the admin inbox when a new inquiry is
 * submitted via the contact/quote form.
 *
 * Phase 4 fills the full HTML template body. The basic implementation below
 * ensures the function is callable without error once credentials are live.
 *
 * @param inquiry - Key fields from the submitted Inquiry record.
 */
/**
 * Strips CR/LF (and other control characters) from a value before it's
 * interpolated into an email subject line — subject lines are effectively
 * SMTP header content, so unsanitized newlines from buyer-submitted input
 * (name, company) could otherwise be used for header/content injection.
 */
function sanitizeForSubject(value: string): string {
  return value.replace(/[\r\n\t\0]+/g, " ").trim();
}

export async function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  company?: string | null;
  country?: string | null;
  phone?: string | null;
  productInterest?: string | null;
  quantity?: string | null;
  fabric?: string | null;
  gsm?: string | null;
  customization?: string | null;
  message?: string | null;
  fileUrls?: string[];
}): Promise<void> {
  const safeName = sanitizeForSubject(inquiry.name);
  const safeCompany = inquiry.company ? sanitizeForSubject(inquiry.company) : null;

  // Inquiry notifications always go to the company inbox — hard-locked so no
  // environment override can redirect them. The sender is the authenticated
  // mail account (see `fromAddress` above).
  const notifyTo = "info@mhglobalattire.com";

  const dash = "—";
  const files = inquiry.fileUrls ?? [];

  await transporter.sendMail({
    from: `"MH Global Attire" <${fromAddress}>`,
    to: notifyTo,
    replyTo: inquiry.email,
    subject: `New Inquiry from ${safeName}${safeCompany ? ` — ${safeCompany}` : ""}`,
    text: [
      `New inquiry received on MH Global Attire.`,
      ``,
      `— CONTACT —`,
      `Name:            ${inquiry.name}`,
      `Email:           ${inquiry.email}`,
      `Phone:           ${inquiry.phone ?? dash}`,
      `Company:         ${inquiry.company ?? dash}`,
      `Country:         ${inquiry.country ?? dash}`,
      ``,
      `— REQUIREMENTS —`,
      `Product Interest: ${inquiry.productInterest ?? dash}`,
      `Quantity:         ${inquiry.quantity ?? dash}`,
      `Fabric:           ${inquiry.fabric ?? dash}`,
      `GSM:              ${inquiry.gsm ?? dash}`,
      `Customization:    ${inquiry.customization ?? dash}`,
      ``,
      `— MESSAGE —`,
      inquiry.message ?? "(no message provided)",
      ``,
      `— ATTACHMENTS —`,
      files.length > 0 ? files.join("\n") : "(none)",
      ``,
      `Reply directly to this email to respond to the buyer.`,
    ].join("\n"),
  });
}

/**
 * Sends an acknowledgement email to the buyer confirming their inquiry was
 * received. Phase 4 replaces this stub with a branded HTML template.
 *
 * @param to   - The buyer's email address.
 * @param name - The buyer's name, used in the salutation.
 */
export async function sendBuyerAcknowledgement(
  to: string,
  name: string
): Promise<void> {
  await transporter.sendMail({
    from: `"MH Global Attire" <${fromAddress}>`,
    to,
    subject: "We received your inquiry — MH Global Attire",
    text: [
      `Dear ${name},`,
      ``,
      `Thank you for reaching out to MH Global Attire.`,
      `We have received your inquiry and our team will review it and respond with the next steps.`,
      ``,
      `Best regards,`,
      `Ahmad Hassan`,
      `Founder & Managing Director`,
      `MH Global Attire`,
      `info@mhglobalattire.com`,
    ].join("\n"),
  });
}
