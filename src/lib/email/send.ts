// Minimal Resend wrapper -- deliberately not the `resend` npm package,
// since a plain fetch to their HTTP API is all we need and keeps this
// dependency-free (see schema.ts comment style for the project's general
// preference for fewer moving parts).
//
// IMPORTANT CAVEAT: Resend accounts without a verified sending domain can
// only deliver to the email address the Resend account itself was signed
// up with. Until a domain is verified in Resend, password-reset emails to
// anyone other than that one address will silently fail to arrive (we log
// the failure server-side but never surface it to the person requesting
// the reset, so we don't leak which emails have accounts).
import "server-only";

const FROM_ADDRESS = "Kickoff Rugby <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set -- skipping send to", to);
    return { ok: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend send to ${to} failed (${res.status}): ${body}`);
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[email] Resend send to ${to} threw:`, err);
    return { ok: false };
  }
}
