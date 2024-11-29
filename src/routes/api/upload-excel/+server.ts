import { Role } from "$lib/enums/role";
import * as query from "$lib/server/db/query";
import { generatePassword, hashPassword } from "$lib/utils/password";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export const POST = async (event: RequestEvent) => {
  if (!event.locals.session) {
    return json({ message: "Not logged in" }, { status: 401 });
  }
  const { data } = await event.request.json();
  const rows = data.slice(1);
  try {
    for (const row of rows) {
      const matriculationNumber = row[0];
      const name = row[1];
      const surname = row[2];
      const yearFrom = row[3];
      const yearTo = row[4];
      const email = row[5];
      const username = `${name}.${surname}`.toLowerCase();
      const password = generatePassword(username);
      const passwordHash = await hashPassword(password);
      await query.createStudent(
        matriculationNumber as string,
        name as string,
        surname as string,
        yearFrom as string,
        yearTo as string,
        email as string,
        username
      );
      await query.createUser(username, passwordHash, Role.STUDENT);
      await query.createUserPriority(username);
      console.log(username, password);
      await event.fetch("/api/send-mail", {
        method: "POST",
        body: JSON.stringify({
          to: email as string,
          subject: "Welcome",
          text: 
`
Hello ${name as string},

Welcome to the Lab Management System!

With our system, you can easily book lab slots, manage your bookings, and much more. 

Below are your login credentials:

Username: ${username}
Password: ${password}

Please note that your password cannot be changed, so make sure to keep it secure. In case you really lose it, contact us below.

If you have any questions, feel free to reach out to vinay.sanga@student.univaq.it or henry.muccini@univaq.it.

Best regards,
The Lab Man Team
`,
        }),
      });
    }
  } catch (error) {
    console.error(error);
    return json({ message: error }, { status: 400 });
  }
  return json({ message: "Users created" }, { status: 200 });
};
