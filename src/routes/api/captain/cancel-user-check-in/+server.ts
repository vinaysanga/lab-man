import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import * as query from "$lib/server/db/query";
export const DELETE = async (event: RequestEvent) => {
    if (!event.locals.session) {
      return json({ message: "Not logged in" }, { status: 401 });
    }
    const {id, username} = await event.request.json();
    await query.cancelUserCheckIn(id, username);
    return json({ message: "User check in cancelled" }, { status: 200 });
  };
  