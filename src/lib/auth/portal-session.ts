// Stateless, signed-cookie session handling for public visitor accounts --
// mirrors session.ts (the admin login) but under its own cookie name, so a
// signed-in admin and a signed-in visitor account are entirely independent.
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "portal_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random string of at least 32 characters in your environment (see .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

export type PortalSessionPayload = {
  accountId: string;
  email: string;
  name: string;
};

export async function encryptPortalSession(payload: PortalSessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

export async function decryptPortalSession(
  token: string | undefined,
): Promise<PortalSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as PortalSessionPayload;
  } catch {
    return null;
  }
}

export async function createPortalSessionCookie(payload: PortalSessionPayload) {
  const session = await encryptPortalSession(payload);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const store = await cookies();
  store.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function readPortalSessionCookie(): Promise<PortalSessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return decryptPortalSession(token);
}

export async function clearPortalSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
