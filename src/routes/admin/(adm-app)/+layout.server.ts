import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const username = event.locals.session?.username;
  if (!username) {
    return redirect(302, "/admin/login");
  }
  if (username !== "admin") {
    return redirect(302, "/login");
  }
  return { username };
};