import { useState } from "react";
import type { FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";
import { Reveal } from "./Reveal";

const HOURS = [
  { days: "Tuesday – Thursday", time: "5:30 pm – 10:00 pm" },
  { days: "Friday – Saturday", time: "5:00 pm – 11:00 pm" },
  { days: "Sunday", time: "5:00 pm – 9:00 pm" },
  { days: "Monday", time: "Closed" },
];

const OAK_ROOM = { name: "Oak Room", capacity: 14 };
const CELLAR = { name: "Cellar", capacity: 36 };
const ROOMS = [OAK_ROOM, CELLAR];

const MAX_GUESTS = 36;

type Status = "idle" | "submitting" | "success" | "error";

export function Reservations() {
  const [guests, setGuests] = useState(2);
  const [room, setRoom] = useState(OAK_ROOM.name);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = useServerFn(submitBooking);

  function handleGuestsChange(value: number) {
    const clamped = Math.min(Math.max(Number.isNaN(value) ? 1 : value, 1), MAX_GUESTS);
    setGuests(clamped);
    // Oak Room can't hold more than 14 — switch to Cellar automatically.
    if (clamped > OAK_ROOM.capacity) setRoom(CELLAR.name);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    const result = await submit({
      data: {
        name: String(data.get("name") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        contact: String(data.get("contact") ?? "").trim(),
        guests,
        date: String(data.get("date") ?? ""),
        room_preference: room,
        event_type: String(data.get("event_type") ?? "").trim(),
      },
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
      setGuests(2);
      setRoom(OAK_ROOM.name);
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  return (
    <section id="reservations" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-16 md:grid-cols-[0.85fr_1.15fr] md:gap-24">
        <Reveal>
          <p className="eyebrow">Reservations</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">Join us for dinner</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            The Oak Room seats up to 14 guests and the Cellar up to 36 — ideal for family dinners and
            private celebrations. Tables are released thirty days in advance.
          </p>

          <dl className="mt-10 space-y-3 border-t border-border pt-8 text-sm">
            {HOURS.map((h) => (
              <div key={h.days} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                <dt className="min-w-0 text-muted-foreground">{h.days}</dt>
                <dd className="shrink-0">{h.time}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 space-y-1.5 border-t border-border pt-8 text-sm">
            <p>
              <a href="tel:+16125550147" className="transition-colors hover:text-brass">
                +1 (612) 555-0147
              </a>
            </p>
            <p>
              <a href="mailto:reserve@finedine.com" className="transition-colors hover:text-brass">
                reserve@finedine.com
              </a>
            </p>
            <p className="text-muted-foreground">211 North Washington Ave, Minneapolis, MN 55401</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form className="border border-border bg-card p-8 sm:p-12" onSubmit={handleSubmit}>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="eyebrow">
                  Name
                </label>
                <input id="name" name="name" type="text" required maxLength={100} className="field mt-3" />
              </div>
              <div>
                <label htmlFor="phone" className="eyebrow">
                  Phone
                </label>
                <input id="phone" name="phone" type="tel" required maxLength={30} className="field mt-3" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact" className="eyebrow">
                  Additional contact
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  A second number or an email we can reach you on.
                </p>
                <input id="contact" name="contact" type="text" maxLength={120} className="field mt-3" />
              </div>
              <div>
                <label htmlFor="guests" className="eyebrow">
                  Guests
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={MAX_GUESTS}
                  required
                  value={guests}
                  onChange={(e) => handleGuestsChange(e.target.valueAsNumber)}
                  className="field mt-3"
                />
              </div>
              <div>
                <label htmlFor="date" className="eyebrow">
                  Date
                </label>
                <input id="date" name="date" type="date" required className="field mt-3" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="room" className="eyebrow">
                  Room preference
                </label>
                <select
                  id="room"
                  name="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="field mt-3"
                >
                  {ROOMS.map((r) => (
                    <option key={r.name} value={r.name} disabled={guests > r.capacity}>
                      {r.name} — up to {r.capacity} guests
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="event_type" className="eyebrow">
                  Type of event
                </label>
                <input
                  id="event_type"
                  name="event_type"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. family dinner"
                  className="field mt-3"
                />
              </div>
            </div>

            <button type="submit" disabled={status === "submitting"} className="btn-solid mt-10 w-full disabled:opacity-60 sm:w-auto">
              {status === "submitting" ? "Sending…" : "Request Reservation"}
            </button>
            <p aria-live="polite" className="mt-5 text-xs text-muted-foreground">
              {status === "success"
                ? "Thank you — your request has been received. We will confirm your evening by phone shortly."
                : status === "error"
                  ? errorMessage
                  : "We will confirm your booking by phone within one business day."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
