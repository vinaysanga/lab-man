import * as query from "$lib/server/db/query";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, "/login");
  }
  const isCaptain = await query.isCaptainToday(event.locals.session.username);
  return (isCaptain)
    ? redirect(302, "/captain/dashboard/")
    : redirect(302, "/login");
};
