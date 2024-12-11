import { setSessionTokenCookie } from "$lib/server/cookies";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import * as auth from "$lib/server/session";
import { verify } from "@node-rs/argon2";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async (event) => {
  if (event.locals.session) {
    return redirect(302, "/dashboard");
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, { message: "Invalid username" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Invalid password" });
    }

    const results = await db
      .select()
      .from(table.appUser)
      .where(eq(table.appUser.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: "Incorrect username or password" });
    }
    const isUserRestricted = await db
      .select({
        isRestricted: table.student.restricted,
      })
      .from(table.student)
      .where(eq(table.student.username, username));

    if (isUserRestricted.at(0)?.isRestricted) {
      return fail(400, { message: "User is restricted" });
    }
    
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(
      sessionToken,
      existingUser.username
    );
    setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, "/dashboard");
  },
};

function validateUsername(username: unknown): username is string {
  return (
    typeof username === "string" &&
    username.length >= 3 &&
    username.length <= 31
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= 255
  );
}
