import nodemailer from "nodemailer";

// Gmail SMTP transporter.
// GMAIL_USER and GMAIL_APP_PASSWORD are read from environment variables.
// NOTE: These may be placeholder values during Phase 1 while the client's
// Google App Password becomes active. Do NOT invoke sendMail calls from
// Phase 1 code — email dispatch is wired in Phase 4.
//
// To generate a Gmail App Password:
//   1. Enable 2-Step Verification on the Google account.
//   2. Visit https://myaccount.google.com/apppasswords
//   3. Generate a password for "Mail" / "Other (custom name)".
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
  message?: string | null;
}): Promise<void> {
  const safeName = sanitizeForSubject(inquiry.name);
  const safeCompany = inquiry.company ? sanitizeForSubject(inquiry.company) : null;

  await transporter.sendMail({
    from: `"MH Global Attire" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New Inquiry from ${safeName}${safeCompany ? ` — ${safeCompany}` : ""}`,
    text: [
      `New inquiry received on MH Global Attire.`,
      ``,
      `Name:    ${inquiry.name}`,
      `Email:   ${inquiry.email}`,
      `Company: ${inquiry.company ?? "—"}`,
      `Country: ${inquiry.country ?? "—"}`,
      ``,
      `Message:`,
      inquiry.message ?? "(no message provided)",
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
    from: `"MH Global Attire" <${process.env.GMAIL_USER}>`,
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
