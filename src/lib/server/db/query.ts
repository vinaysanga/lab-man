import { Recurrence } from "$lib/enums/recurrence";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import {
  and,
  arrayContains,
  arrayOverlaps,
  count,
  desc,
  eq,
  gte,
  inArray,
  lt,
  lte,
  or,
  sql
} from "drizzle-orm";

// Helper
const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};
const getTomorrowDate = () => {
  const tomorrow = new Date(Date.now() + 86400000);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
};

// Queries
export const createSession = async (session: table.Session) =>
  await db.insert(table.session).values(session);

export const getSessionUsernameAndRole = async (sessionId: string) =>
  await db
    .select({
      session: table.session,
      username: table.appUser.username,
      role: table.appUser.role,
    })
    .from(table.session)
    .innerJoin(table.appUser, eq(table.session.username, table.appUser.username))
    .where(eq(table.session.id, sessionId));

export const deleteSession = async (sessionId: string) =>
  await db.delete(table.session).where(eq(table.session.id, sessionId));

export const updateSession = async (session: table.Session) =>
  await db
    .update(table.session)
    .set({ expiresAt: session.expiresAt })
    .where(eq(table.session.id, session.id));

export const isCaptainToday = async (username: string) => {
  const result = await db
    .select()
    .from(table.confirmedBooking)
    .where(
      and(
        eq(table.confirmedBooking.bookingDate, getTodayDate()),
        arrayContains(table.confirmedBooking.captains, [username])
      )
    );
  return !!result;
};
export const getUnconfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.unconfirmedBooking)
    .where(eq(table.unconfirmedBooking.username, username));

export const getConfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.confirmedBooking)
    .where(arrayContains(table.confirmedBooking.usernames, [username]));

export const createUnconfirmedBooking = async (
  username: string,
  bookingDate: Date,
  startTime: string,
  endTime: string
) => {
  const blockedSlots = await db
    .select()
    .from(table.blockedBookingSlots)
    .where(
      and(
        or(
          and(
            eq(table.blockedBookingSlots.startDate, bookingDate),
            eq(table.blockedBookingSlots.recurrence, Recurrence.oneTime)
          ),
          and(
            lte(table.blockedBookingSlots.startDate, bookingDate),
            gte(table.blockedBookingSlots.endDate, bookingDate),
            eq(table.blockedBookingSlots.recurrence, Recurrence.daily)
          ),
          and(
            lte(table.blockedBookingSlots.startDate, bookingDate),
            gte(table.blockedBookingSlots.endDate, bookingDate),
            eq(table.blockedBookingSlots.recurrence, Recurrence.weekly),
            // Convert dates to ISO string for the day of week comparison
            sql`EXTRACT(DOW FROM ${bookingDate.toISOString()}::timestamp) = EXTRACT(DOW FROM ${table.blockedBookingSlots.startDate})`
          )
        ),
        eq(table.blockedBookingSlots.startTime, startTime)
      )
    );

  if (blockedSlots.length > 0) {
    return {
      blocked: true,
    };
  }
  return await db.insert(table.unconfirmedBooking).values({
    username,
    bookingDate,
    startTime,
    endTime,
  });
};

export const deleteUnconfirmedBookings = async (ids: number[]) =>
  await db
    .delete(table.unconfirmedBooking)
    .where(inArray(table.unconfirmedBooking.id, ids));

export const getPreviousUnconfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.unconfirmedBooking)
    .where(
      and(
        eq(table.unconfirmedBooking.username, username),
        lt(table.unconfirmedBooking.bookingDate, getTodayDate())
      )
    );

export const getPreviousConfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.confirmedBooking)
    .where(
      and(
        arrayContains(table.confirmedBooking.usernames, [username]),
        lt(table.confirmedBooking.bookingDate, getTodayDate())
      )
    );

export const getUpcomingUnconfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.unconfirmedBooking)
    .where(
      and(
        eq(table.unconfirmedBooking.username, username),
        gte(table.unconfirmedBooking.bookingDate, getTodayDate())
      )
    );

export const getUpcomingConfirmedBookingsForUser = async (username: string) =>
  await db
    .select()
    .from(table.confirmedBooking)
    .where(
      and(
        arrayContains(table.confirmedBooking.usernames, [username]),
        gte(table.confirmedBooking.bookingDate, getTodayDate())
      )
    );

export const deleteUnconfirmedBooking = async (id: number) =>
  await db
    .delete(table.unconfirmedBooking)
    .where(eq(table.unconfirmedBooking.id, id));

export const getAllStudents = async () => await db.select().from(table.student);

export const deleteStudent = async (username: string) =>
  await db.delete(table.student).where(eq(table.student.username, username));

export const createStudent = async (
  matriculationNumber: string,
  name: string,
  surname: string,
  yearFrom: string,
  yearTo: string,
  email: string,
  username: string
) =>
  await db.insert(table.student).values({
    matriculationNumber,
    name,
    surname,
    yearFrom,
    yearTo,
    email,
    username,
  });

export const createUser = async (
  username: string,
  passwordHash: string,
  role: string
) =>
  await db.insert(table.appUser).values({
    username,
    passwordHash,
    role,
  });
export const deleteUser = async (username: string) =>
  await db.delete(table.appUser).where(eq(table.appUser.username, username));
export const getUserPriority = async (username: string) =>
  await db
    .select({ priority: table.userPriorities.priority })
    .from(table.userPriorities)
    .where(eq(table.userPriorities.username, username));

export const createBlockedSlot = async (
  startDate: Date,
  startTime: string,
  endTime: string,
  recurrence: string,
  endDate?: Date
) =>
  await db.insert(table.blockedBookingSlots).values({
    startDate,
    endDate,
    startTime,
    endTime,
    recurrence,
  });

export const deleteBlockedSlot = async (id: number) =>
  await db
    .delete(table.blockedBookingSlots)
    .where(eq(table.blockedBookingSlots.id, id));

export const getAllBlockedSlots = async () =>
  await db.select().from(table.blockedBookingSlots);

export const getAllConfirmedBookingsForToday = async () => {
  return await db
    .select()
    .from(table.confirmedBooking)
    .where(eq(table.confirmedBooking.bookingDate, getTodayDate()));
};

export const getAllConfirmedBookingsForTomorrow = async () => {
  return await db
    .select()
    .from(table.confirmedBooking)
    .where(eq(table.confirmedBooking.bookingDate, getTomorrowDate()));
};

export const getTop20UserPriorities = async (usernames: string[]) =>
  await db
    .select()
    .from(table.userPriorities)
    .where(inArray(table.userPriorities.username, usernames))
    .orderBy(desc(table.userPriorities.priority))
    .limit(20);

export const getAllEligibleBookings = async () => {
  const tomorrow = getTomorrowDate();
  return await db
    .select({
      id: table.unconfirmedBooking.id,
      username: table.unconfirmedBooking.username,
      bookingDate: table.unconfirmedBooking.bookingDate,
      startTime: table.unconfirmedBooking.startTime,
      endTime: table.unconfirmedBooking.endTime,
    })
    .from(table.unconfirmedBooking)
    .where(eq(table.unconfirmedBooking.bookingDate, tomorrow))
    .leftJoin(
      table.student,
      and(
        eq(table.unconfirmedBooking.username, table.student.username),
        eq(table.student.restricted, false)
      )
    );
};
export const captainCounts = async (username: string) =>
  await db
    .select({ count: count() })
    .from(table.confirmedBooking)
    .where(arrayOverlaps(table.confirmedBooking.captains, [username]));

export const createUserPriority = async (username: string) =>
  await db.insert(table.userPriorities).values({ username });

export const decrementUserPriority = async (username: string) =>
  await db
    .update(table.userPriorities)
    .set({ priority: sql`${table.userPriorities.priority} - 1` })
    .where(eq(table.userPriorities.username, username));

export const createConfirmedBooking = async (
  bookingDate: Date,
  startTime: string,
  endTime: string,
  usernames: string[],
  captains: string[]
) => {
  await db.insert(table.confirmedBooking).values({
    bookingDate,
    startTime,
    endTime,
    usernames,
    captains,
  });
};

export const checkInUser = async (id: number, username: string) => {
  await db
    .update(table.confirmedBooking)
    .set({
      // Create a new distinct array by appending the new username
      checkedInUsers: sql`(
        SELECT array_agg(DISTINCT e)
        FROM unnest(${table.confirmedBooking.checkedInUsers} || ARRAY[${username}]) AS e
      )`,
    })
    .where(eq(table.confirmedBooking.id, id));
};

export const cancelUserCheckIn = async (id: number, username: string) => {
  await db
    .update(table.confirmedBooking)
    .set({
      checkedInUsers: sql`array_remove(${table.confirmedBooking.checkedInUsers}, ${username})`,
    })
    .where(eq(table.confirmedBooking.id, id));
};

export const getStudentEmail = async (username: string) =>
  await db
    .select({ email: table.student.email })
    .from(table.student)
    .where(eq(table.student.username, username)); 

export const updateStudentRestricted = async (username: string, restricted: boolean) =>
  await db
    .update(table.student)
    .set({ restricted })
    .where(eq(table.student.username, username));

export const forceLogout = async (username: string) =>
  await db
    .update(table.session)
    .set({ expiresAt: new Date(0) })
    .where(eq(table.session.username, username));

export const fetchStudentsFromTo = async (from: string, to: string) => {
  return await db
    .select({ username: table.student.username })
    .from(table.student)
    .where(and(eq(table.student.username, from), eq(table.student.username, to)));
};