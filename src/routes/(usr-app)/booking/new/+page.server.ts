import * as query from "$lib/server/db/query";
import { fail } from "@sveltejs/kit";
import type { PostgresError } from "postgres";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const blockedSlots = await query.getAllBlockedSlots();
  return {
    blockedSlots,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const username = event.locals.session?.username;
    const bookingDate = formData.get("bookingDate")
      ? new Date(formData.get("bookingDate") as string)
      : undefined;
    const timeSlot = formData.get("timeSlot");
    const startTime = (timeSlot as string).split("-")[0];
    const endTime = (timeSlot as string).split("-")[1];
    if (!username) {
      return fail(400, { error: "No user logged in" });
    }

    try {
      const response = await query.createUnconfirmedBooking(
        username,
        bookingDate as Date,
        startTime,
        endTime
      );
      if ("blocked" in response && response.blocked) {
        return fail(400, { error: "Slot is unavailable for booking" });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "PostgresError" &&
        (error as PostgresError).code === "23505"
      ) {
        return fail(400, { error: "Already requested this slot" });
      }
      throw error;
    }
    return { success: "Booking requested successfully" };
  },
};
