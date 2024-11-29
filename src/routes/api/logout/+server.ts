import { deleteSessionTokenCookie } from "$lib/server/cookies";
import * as auth from "$lib/server/session";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  await auth.invalidateSession(event.locals.session.id);
  deleteSessionTokenCookie(event);

  return json({ message: "Logged out" }, { status: 200 });
};
