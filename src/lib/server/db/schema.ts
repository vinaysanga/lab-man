import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const appUser = pgTable("app-user", {
  username: text("username").primaryKey(),
  passwordHash: text("passwordHash").notNull(),
  role: text("role").notNull().default("student"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  expiresAt: timestamp("expiresAt", {
    withTimezone: false,
    mode: "date",
  }).notNull(),
});

export const student = pgTable("student", {
  matriculationNumber: text("matriculationNumber").primaryKey(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  yearFrom: text("yearFrom").notNull(),
  yearTo: text("yearTo").notNull(),
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  restricted: boolean("restricted").default(false).notNull(),
});

export const userPriorities = pgTable("userPriorities", {
  username: text("username")
    .primaryKey()
    .references(() => student.username, { onDelete: "cascade" }),
  priority: integer("priority").notNull().default(0),
});

export const unconfirmedBooking = pgTable(
  "unconfirmedBooking",
  {
    id: serial("id").primaryKey(),
    username: text("username")
      .notNull()
      .references(() => student.username, { onDelete: "cascade" }),
    bookingDate: date("bookingDate", {
      mode: "date",
    }).notNull(),
    startTime: time("startTime", { withTimezone: false }).notNull(),
    endTime: time("endTime", { withTimezone: false }).notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    }).defaultNow(),
  },
  (t) => ({
    unique_user_booking_slot: unique("unique_user_booking_slot").on(
      t.username,
      t.bookingDate,
      t.startTime,
      t.endTime
    ),
  })
);

export const confirmedBooking = pgTable("confirmedBooking", {
  id: serial("id").primaryKey(),
  bookingDate: date("bookingDate", {
    mode: "date",
    
  }).notNull(),
  startTime: text("startTime").notNull(),
  endTime: text("endTime").notNull(),
  usernames: text("usernames").array().notNull(),
  captains: text("captains").array().notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
  }).defaultNow(),
  checkedInUsers: text("checkedInUsers").array(),
  checkedInCaptains: text("checkedInCaptains").array(),
});

export const blockedBookingSlots = pgTable(
  "blockedBookingSlots",
  {
    id: serial("id").primaryKey(),
    blockedDate: date("blockedDate", {
      mode: "date",
    }).notNull(),
    startTime: time("startTime", { withTimezone: false }).notNull(),
    endTime: time("endTime", { withTimezone: false }).notNull(),
  },
  (t) => ({
    unique_user_booking_slot: unique("unique_blocked_booking_slot").on(
      t.blockedDate,
      t.startTime,
      t.endTime
    ),
  })
);

export type User = typeof appUser.$inferSelect;

export type Session = typeof session.$inferSelect;

export type Student = typeof student.$inferSelect;

export type UnconfirmedBooking = typeof unconfirmedBooking.$inferSelect;

export type ConfirmedBooking = typeof confirmedBooking.$inferSelect;

export type BlockedBookingSlots = typeof blockedBookingSlots.$inferSelect;

export type UserPriorities = typeof userPriorities.$inferSelect;
