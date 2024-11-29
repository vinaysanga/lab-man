import * as query from "$lib/server/db/query";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const username = event.locals.session?.username;
  if (!username) {
    return redirect(302, "/login");
  }
  const upcomingUnconfirmedBookings =
    await query.getUpcomingUnconfirmedBookingsForUser(username);
  const upcomingConfirmedBookings =
    await query.getUpcomingConfirmedBookingsForUser(username);
  return { upcomingUnconfirmedBookings, upcomingConfirmedBookings, username};
};
