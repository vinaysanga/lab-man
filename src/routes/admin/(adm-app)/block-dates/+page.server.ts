import * as query from "$lib/server/db/query";
import type { PostgresError } from "postgres";
import type { Actions, PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const allBlockedSlots = await query.getAllBlockedSlots();
  return { allBlockedSlots };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const bookingDate = formData.get("bookingDate")
      ? new Date(formData.get("bookingDate") as string)
      : undefined;
    const timeSlot = formData.get("timeSlot");
    const startTime = (timeSlot as string).split("-")[0];
    const endTime = (timeSlot as string).split("-")[1];
    try {
      const response = await query.createBlockedSlot(
        bookingDate as Date,
        startTime,
        endTime
      );
    } catch (error) {
      if (error instanceof Error && error.name === "PostgresError" && (error as PostgresError).code === "23505") {
        return fail(400, { error: "Already blocked" });
      }
      throw error;
    }
    return { success: "Blocked successfully" };
  },
};
