import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async (event) => {
  const username = event.locals.session?.username;
  if (!username) {
    return redirect(302, "/admin/login");
  }
  return redirect(302, "/admin/dashboard");
};