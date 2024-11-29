// insertData.ts
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

export default async () => {
  return await db.insert(table.appUser).values({
    username: "admin",
    passwordHash:
      "$argon2id$v=19$m=19456,t=2,p=1$WHV2UEx1cW5uN3ZGeXV5Zg$PtzZyZYRXxiDzr77shHBNVQeR77VWp/REc87mG+JhvU",
    role: "admin",
  });
};
