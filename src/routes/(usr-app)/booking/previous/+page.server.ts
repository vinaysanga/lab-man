import * as query from "$lib/server/db/query";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const username = event.locals.session?.username;
  if (!username) {
    return redirect(302, "/login");
  }
  const previousUnconfirmedBookings =
    await query.getPreviousUnconfirmedBookingsForUser(username);
  const previousConfirmedBookings =
    await query.getPreviousConfirmedBookingsForUser(username);
  return { previousUnconfirmedBookings, previousConfirmedBookings };
};
