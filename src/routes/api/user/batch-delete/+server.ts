import * as query from "$lib/server/db/query";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
export const DELETE = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  const { from, to } = await event.request.json();
  const usernames = await query.fetchStudentsFromTo(from, to);
  for (const { username } of usernames) {
    await query.deleteStudent(username);
    await query.deleteUser(username);
  }
  return json({ message: "User deleted" }, { status: 200 });
};
