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
  // Filter out rows where any required field is empty
  const rows = data.slice(1).filter((row: any[]) => {
    if (!row || row.length < 5) return false;
    // Check if all required fields have non-empty values
    return row.slice(0, 5).every(cell => 
      cell !== null && 
      cell !== undefined && 
      cell.toString().trim() !== ''
    );
  });
  
  try {
    for (const row of rows) {
      // At this point, we know the row has all required fields
      const matriculationNumber = row[0].toString().trim();
      const name = row[1].toString().trim();
      const surname = row[2].toString().trim();
      const yearRange = row[3];
      
      if (!yearRange || typeof yearRange !== 'string') {
        throw new Error(`Invalid year range format for student ${name} ${surname}. Expected a string in format 'YYYY-YYYY'`);
      }
      
      const yearParts = yearRange.split('-');
      if (yearParts.length !== 2) {
        throw new Error(`Invalid year range format for student ${name} ${surname}. Expected format 'YYYY-YYYY' but got '${yearRange}'`);
      }
      
      const [yearFrom, yearTo] = yearParts.map((year: string) => year.trim());
      const email = row[4];
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
      
      // Send email asynchronously without waiting
      console.log("Sending email to", email);
      event.fetch("/api/send-mail", {
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
      }).catch(error => {
        console.error('Failed to send email - Error details:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });
    }
  } catch (error) {
    console.error(error);
    return json({ message: error }, { status: 400 });
  }
  return json({ message: "Users created" }, { status: 200 });
};
