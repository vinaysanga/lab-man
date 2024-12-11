import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async (event) => {
  if (event.locals.session?.username) {
    return redirect(302, "/dashboard");
  }
  return redirect(302, "/login");
};
