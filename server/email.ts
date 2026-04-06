/**
 * DIMI Email Service — Resend integration for transactional emails
 */

const RESEND_API_URL = "https://api.resend.com/emails";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend REST API.
 * Returns true on success, false on failure (does not throw).
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email send");
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `DIMI <${fromEmail}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email (${response.status}): ${detail}`
      );
      return false;
    }

    console.log(`[Email] Confirmation sent to ${options.to}`);
    return true;
  } catch (error) {
    console.warn("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Send the DIMI waitlist confirmation email.
 * Dark background, DIMI Green #2EE62E accent, Fraunces headline.
 */
export async function sendWaitlistConfirmation(email: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the DIMI waitlist.</title>
</head>
<body style="margin:0;padding:0;background-color:#080806;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#080806;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-family:'Courier New',monospace;font-size:28px;font-weight:700;color:#E8EDE8;letter-spacing:2px;">dimi</span>
            </td>
          </tr>
          
          <!-- Headline -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:900;color:#E8EDE8;line-height:1.2;">
                You're <span style="color:#2EE62E;font-style:italic;">in.</span>
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#9A9E90;">
                We'll notify you when the FL Studio plugin drops. Stay close.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="height:1px;background:linear-gradient(to right,#2EE62E,transparent);"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              <p style="margin:0;font-size:12px;color:#5A5E50;letter-spacing:1px;text-transform:uppercase;">
                DIMI — Where Music Gets Made Live
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#5A5E50;">
                You received this because you signed up at dimi.app
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject: "You're on the DIMI waitlist.",
    html,
  });
}

/**
 * Validate the Resend API key by attempting a send to a test address.
 * The key is "sending-only" restricted, so we validate by checking
 * that the API responds with a non-401 status when we try to send.
 * We use a dry-run approach: send to a known test address.
 */
export async function validateResendApiKey(): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    // Resend's sending-only keys return 401 on /domains but work on /emails.
    // We validate by sending a test email to the Resend test address.
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DIMI <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "API Key Validation Test",
        html: "<p>Test</p>",
      }),
    });

    // 200 = sent successfully, key is valid
    // 422 = validation error but key is valid
    // 401/403 = key is invalid
    return response.status === 200 || response.status === 422;
  } catch {
    return false;
  }
}
