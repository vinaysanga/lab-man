// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { SessionValidationResult } from "$lib/server/session";
declare global {
  namespace App {
    interface Locals {
      session: SessionValidationResult["session"] | null;
      username: SessionValidationResult["username"] | null;
      role: SessionValidationResult["role"] | null;
    }
  }
}

export {};
