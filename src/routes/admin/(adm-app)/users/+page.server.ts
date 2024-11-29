import { Role } from "$lib/enums/role";
import * as query from "$lib/server/db/query";
import { hash } from "@node-rs/argon2";
import type { Actions } from "@sveltejs/kit";
import { hash as cryptoHash } from "crypto";
import type { PostgresError } from "postgres";
import type { PageServerLoad } from "../$types";
import { generatePassword, hashPassword } from "$lib/utils/password";
export const load: PageServerLoad = async (event) => {
  return { students: await query.getAllStudents() };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const matriculationNumber = formData.get("matriculationNumber");
    const name = formData.get("name");
    const surname = formData.get("surname");
    const [ yearFrom, yearTo ] = (formData.get("yearOfStudy") as string).replace(/\s*-\s*/, "-").split("-");
    const email = formData.get("email");
    const username = `${name}.${surname}`.toLowerCase();
    const password = generatePassword(username);
    const passwordHash = await hashPassword(password);
    try {
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
    } catch (error) {
      console.error(error);
      return { message: (error as PostgresError).detail };
    }
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
    return { message: "User created" };
  },
};