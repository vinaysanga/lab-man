import { sendMail } from "$lib/mailer";
import * as query from "$lib/server/db/query";
import { CronJob } from "cron";
const cronTime = "00 20 * * *";

  /**
   * This function runs on the scheduled time.
   * It is responsible for:
   * 1. Getting all unconfirmed bookings for the next day
   * 2. Getting the top 20 interested users for each slot
   * 3. Selecting two captains for each slot
   * 4. Creating confirmed bookings and setting the captains
   * 5. Sending emails to the interested users and the captains
   * 6. Deleting the unconfirmed bookings
   */
const onTick = async () => {
  console.log("Cron job executed at " + new Date());

  // Get all required data
  const slotWiseBookingsMap = await getSlotWiseBookingsMap();

  slotWiseBookingsMap.forEach(async (slotDetails) => {
    const { bookingDate, startTime, endTime } = slotDetails[0];

    const idsForDeletion = slotDetails.map((booking) => booking.id);
    const interestedUsers = getInterestedUsers(slotDetails);
    const finalUsers = await query.getTop20UserPriorities(interestedUsers);
    const twoCaptains = await getCaptains(
      finalUsers.map((user) => user.username)
    );
    const finalUsersWithoutCaptains = finalUsers.filter(
      (user) => !twoCaptains.includes(user.username)
    );
    // Make the final bookings
    await query.createConfirmedBooking(
      bookingDate,
      startTime,
      endTime,
      interestedUsers,
      twoCaptains
    );
    finalUsersWithoutCaptains.map(async (user) => {
      await query.decrementUserPriority(user.username);
      const email = await query.getStudentEmail(user.username);
      const res = await sendMail(
        email[0].email,
        "Your study slot booking has been confirmed",
`
Ciao,

Your booking for ${bookingDate.toLocaleDateString()} from ${startTime} to ${endTime} has been confirmed.

Please make sure to check-in within 15 minutes of the start of the slot.

Find your check-in QR code Under Bookings > Upcoming.

Best regards,
The Lab Man Team
`
      );
      console.log(res);
    });
      twoCaptains.map(async (captain) => {
        if (!captain) return;
        await query.decrementUserPriority(captain);
        const email = await query.getStudentEmail(captain);
        await sendMail(
          email[0].email,
          "Your study slot booking has been confirmed",
`
Ciao,

Your booking for ${bookingDate.toLocaleDateString()} from ${startTime} to ${endTime} has been confirmed.

Additionaly, the captain role is assigned to you.

Please make sure to check-in others within 15 minutes of the start of the slot.

To access you captain dashboard, first login to your account and then go to TODO/captain

Remember to hand over the keys to the subsequent captain or back to the admins.

Best regards,
The Lab Man Team
`
        );
      });
      
    // Delete the unconfirmed bookings
    await query.deleteUnconfirmedBookings(idsForDeletion);
  });
};

const onComplete = () => {};

const timeZone = "Europe/Rome";

export default new CronJob(
  cronTime,
  onTick,
  onComplete,
  false, // start: do not start immediately
  timeZone
);

/**
 * Retrieves all eligible bookings and groups them by startTime.
 * @returns A Map where each key is a startTime and the value is an array of bookings for that startTime.
 */
const getSlotWiseBookingsMap = async () => {
  const allEligibleBookings = await query.getAllEligibleBookings();
  return allEligibleBookings.reduce(
    (map, booking) =>
      map.set(booking.startTime, [
        ...(map.get(booking.startTime) || []),
        booking,
      ]),
    new Map<string, typeof allEligibleBookings>()
  );
};

/**
 * Given a list of booking details, returns the list of unique usernames
 * who expressed interest in the given booking.
 * @param slotDetails The list of booking details.
 * @returns A list of unique usernames.
 */
const getInterestedUsers = (
  slotDetails: {
    username: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
  }[]
) => Array.from(new Set(slotDetails.flat().map((booking) => booking.username)));

/**
 * Returns the two usernames with the lowest captain counts.
 *
 * The idea is that the two users who have been captains the least are chosen as
 * the captains for the next booking.
 * @param usernames The list of usernames to consider.
 * @returns A list of two usernames.
 */
const getCaptains = async (usernames: string[]) => {
  const usernameCaptainCountsMap = await Promise.all(
    usernames.map(async (username) => ({
      username,
      captainCount: (
        await query.captainCounts(username)
      ).map((row) => row.count)[0],
    }))
  );
  const [min1, min2] = usernameCaptainCountsMap
    .sort((a, b) => a.captainCount - b.captainCount)
    .slice(0, 2)
    .map(({ username }) => username);
  return [min1, min2];
};
