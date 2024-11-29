import * as query from "$lib/server/db/query";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
export const PATCH = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  const { username, restricted } = await event.request.json(); 
  await query.updateStudentRestricted(username, restricted);
  if (restricted) {
    await query.forceLogout(username);
  }
  return json({ message: "User restricted" }, { status: 200 });
};
