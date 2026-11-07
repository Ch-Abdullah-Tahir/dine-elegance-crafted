import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { reservationTimeError } from "@/lib/reservation-hours";
import { privateCapacityMessage, reservationRoom } from "@/lib/reservation-rooms";

const SUPABASE_URL = "https://povlwnfplaivsrgqttom.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Ju60FRNcnfOdK7evmt91iQ_D78UQf2I";

/** "2026-09-29" -> "29th September 2026" (matches the db's captured_fields_json date style) */
function ordinalDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(30),
  contact: z.string().trim().max(120).optional().default(""),
  guests: z.coerce.number().int().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  reservation_time: z.string().trim().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid reservation time"),
  room_preference: z.enum(["Oak Room", "Cellar", "Main Hall"]),
  booking_type: z.enum(["Private Dining", "Main Hall"]),
  event_type: z.string().trim().min(1).max(80),
  menu_package: z.string().trim().min(1).max(80),
  allergies: z.string().trim().max(500).optional().default(""),
  special_instructions: z.string().trim().max(1000).optional().default(""),
});

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const scheduleError = reservationTimeError(data.date, data.reservation_time);
    if (scheduleError) return { ok: false as const, error: scheduleError };
    const room = reservationRoom(data.booking_type, data.guests, data.room_preference);
    if (!room) return { ok: false as const, error: privateCapacityMessage };

    // One row of the external `bookings` table: phone on its own, the rest
    // inside captured_fields_json.
    const row = {
      phone: data.phone,
      captured_fields_json: JSON.stringify({
        name: data.name,
        date: ordinalDate(data.date),
        reservation_time: data.reservation_time,
        guests: String(data.guests),
        room_preference: room,
        booking_type: data.booking_type,
        event_type: data.event_type,
        menu_package: data.menu_package,
        contact: data.contact,
        allergies: data.allergies,
        special_instructions: data.special_instructions,
      }),
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(12_000),
      });

      if (!response.ok) {
        console.error("Booking insert failed:", response.status, await response.text());
        return { ok: false as const, error: "We couldn't save your request. Please try again or call us." };
      }
      return { ok: true as const };
    } catch (error) {
      console.error("Booking insert network error:", error);
      return { ok: false as const, error: "We couldn't verify whether your request was received. Please check with the restaurant before submitting again." };
    }
  });
