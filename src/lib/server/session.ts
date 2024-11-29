import * as query from "$lib/server/db/query";
import * as table from "$lib/server/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = "auth-session";

/**
 * Generates a session token as a base64url-encoded 18-byte random number.
 */
export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return encodeBase64url(bytes);
}

/**
 * Creates a new session and persists it in the database. The session is valid for 15 days.
 *
 * @param token The session token, which is used to identify the session. It is stored on client side as a cookie.
 * @param username The username associated with the session.
 * @returns The newly created session. It is stored on the server side in the database.
 */
export async function createSession(token: string, username: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: table.Session = {
    id: sessionId,
    username,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 15),
  };
  await query.createSession(session);
  return session;
}

/**
 * Validates a session token.
 *
 * @param token The session token to be validated. It is a base64url-encoded 18-byte random number.
 * @returns An object with a `session` property, which is `null` if the session token is invalid or has expired.
 *          If the session token is valid, the `session` property is an object with the following properties:
 *          - `id`: The ID of the session. It is a lowercase hexadecimal representation of the SHA-256 hash of the session token.
 *          - `username`: The username associated with the session.
 *          - `expiresAt`: The expiration date of the session. It is a JavaScript Date object.
 */
export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await query.getSessionUsernameAndRole(sessionId);

  if (!result) {
    return { session: null, username: null, role: null };
  }

  const { session, username, role } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    invalidateSession(sessionId);
    return { session: null, username: null, role: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 8) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 15);
    await query.updateSession(session);
  }

  return { session, username, role };
}

/**
 * Invalidates a session, deleting it from the database. This is used to log out users.
 *
 * @param sessionId The ID of the session to be invalidated. It is a lowercase hexadecimal representation of the SHA-256 hash of the session token.
 */
export async function invalidateSession(sessionId: string) {
  await query.deleteSession(sessionId);
}

export type SessionValidationResult =
  | { session: table.Session; username: string; role: string }
  | { session: null; username: null; role: null };
