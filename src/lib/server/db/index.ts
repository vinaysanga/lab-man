import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

// In development, ensure we use the container hostname
const dbUrl = env.NODE_ENV === 'development' 
  ? env.DATABASE_URL.replace('localhost', 'db').replace('127.0.0.1', 'db').replace('::1', 'db')
  : env.DATABASE_URL;

const client = postgres(dbUrl);
export const db = drizzle(client);
