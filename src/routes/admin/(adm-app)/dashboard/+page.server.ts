import * as query from "$lib/server/db/query";
import type { PageServerLoad } from "../$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const username = event.locals.session?.username;
  if (!username) {
    return redirect(302, "/admin/login");
  }
  const allConfirmedBookingsForToday =
    await query.getAllConfirmedBookingsForToday();
  const allConfirmedBookingsForTomorrow =
    await query.getAllConfirmedBookingsForTomorrow();
  return {
    username,
    allConfirmedBookingsForToday,
    allConfirmedBookingsForTomorrow,
  };
};
