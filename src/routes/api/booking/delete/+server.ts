import * as query from "$lib/server/db/query";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
export const POST = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  const { id } = await event.request.json(); 
  await query.deleteUnconfirmedBooking(id);
  return json({ message: "Booking deleted" }, { status: 200 });
};
