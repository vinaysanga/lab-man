import * as query from "$lib/server/db/query";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, "/login");
  }
  const username = event.locals.session.username;
  const unconfirmedBookings = await query.getUnconfirmedBookingsForUser(
    username
  );
  const confirmedBookings = await query.getConfirmedBookingsForUser(username);

  return { username, unconfirmedBookings, confirmedBookings };
};
