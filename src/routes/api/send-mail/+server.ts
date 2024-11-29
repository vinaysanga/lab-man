import { sendMail } from "$lib/mailer";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export const POST = async (event: RequestEvent) => {
  const { to, subject, text } = await event.request.json();
  const res = await sendMail(to, subject, text);
  return json(res);
};