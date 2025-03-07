import type { RequestEvent } from "@sveltejs/kit";
import { sessionCookieName } from "./session";


/**
 * Sets the session token cookie. It is set to be httpOnly, to prevent access from JavaScript.
 * The cookie is set to expire at the specified date, and to be accessible only from the root path.
 * @param event The event object.
 * @param token The session token.
 * @param expiresAt The date at which the cookie will expire.
 */
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		expires: expiresAt,
		path: "/"
	});
}

/**
 * Deletes the session token cookie.
 *
 * @param event The event object.
 */
export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set(sessionCookieName, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		maxAge: 0,
		path: "/"
	});
}