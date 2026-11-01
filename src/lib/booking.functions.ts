import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
  guests: z.coerce.number().int().min(1).max(36),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  room_preference: z.enum(["Oak Room", "Cellar"]),
  event_type: z.string().trim().min(1).max(80),
});

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    // One row of the external `bookings` table: phone on its own, the rest
    // inside captured_fields_json.
    const row = {
      phone: data.phone,
      captured_fields_json: {
        name: data.name,
        date: ordinalDate(data.date),
        guests: String(data.guests),
        room_preference: data.room_preference,
        event_type: data.event_type,
        contact: data.contact,
      },
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });

      if (!response.ok) {
        console.error("Booking insert failed:", response.status, await response.text());
        return { ok: false as const, error: "We couldn't save your request. Please try again or call us." };
      }
      return { ok: true as const };
    } catch (error) {
      console.error("Booking insert network error:", error);
      return { ok: false as const, error: "We couldn't reach our booking system. Please try again or call us." };
    }
  });
