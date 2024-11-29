import * as query from "$lib/server/db/query";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
export const POST = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  const { id, username } = await event.request.json();
  const res = await query.checkInUser(id, username);
  return json({ message: "Checked in" }, { status: 200 });
};
