import * as query from "$lib/server/db/query";
import type { PostgresError } from "postgres";
import type { Actions, PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";
import { Recurrence } from "$lib/enums/recurrence";

export const load: PageServerLoad = async (event) => {
  const allBlockedSlots = await query.getAllBlockedSlots();
  return { allBlockedSlots };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const startDate = formData.get("startDate")
      ? new Date(formData.get("startDate") as string)
      : undefined;
    const endDate = formData.get("endDate")
      ? new Date(formData.get("endDate") as string)
      : undefined;
    const recurrence = formData.get("recurrence") as string;
    const timeSlots = formData.getAll("timeSlot") as string[];

    if (!startDate) {
      return fail(400, { error: "Start date is required" });
    }

    if (!timeSlots.length) {
      return fail(400, { error: "At least one time slot must be selected" });
    }

    try {
      for (const timeSlot of timeSlots) {
        const [startTime, endTime] = timeSlot.split("-");
        
        if (recurrence === Recurrence.oneTime) {
          // For one-time blocks
          await query.createBlockedSlot(startDate, startTime, endTime, recurrence);
        } else {
          // For recurring blocks (weekly or daily)
          if (!endDate) {
            return fail(400, { error: "End date is required for recurring blocks" });
          }

          await query.createBlockedSlot(startDate, startTime, endTime, recurrence, endDate);
        }
      }

      return {
        success: "Slots blocked successfully",
      };
    } catch (error) {
      console.error("Error blocking slots:", error);
      return fail(500, { error: "Failed to block slots" });
    }
  },
};
