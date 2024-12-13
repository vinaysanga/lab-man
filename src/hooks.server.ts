import { building } from "$app/environment";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "$lib/server/cookies";
import "$lib/server/db/init";
import * as auth from "$lib/server/session";
import type { Handle } from "@sveltejs/kit";
import task from "./jobs/finalize-bookings";


// Start the scheduled job
const startJob = async () => {
  try {
    task.start();
    console.log("Finalize bookings job scheduled");
  } catch (error) {
    console.error("Could not start the scheduler", error);
  }
};

if (!building) {
  await startJob();
}
/**
 * This hook is executed on every request. If the request includes a cookie
 * with the session token, it will validate the session token and set the
 * session data in `event.locals.session`. If the session token is invalid,
 * it will delete the session token cookie.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName) ?? null;
  if (!sessionToken) {
    event.locals.session = null;
    event.locals.username = null;
    event.locals.role = null;
    return resolve(event);
  }

  const { session, username, role } = await auth.validateSessionToken(
    sessionToken
  );
  if (session) {
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  event.locals.session = session;
  event.locals.username = username;
  event.locals.role = role;

  return resolve(event);
};
