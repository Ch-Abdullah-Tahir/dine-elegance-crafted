import { useState } from "react";
import type { FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";
import { reservationTimeError, restaurantToday } from "@/lib/reservation-hours";
import { Reveal } from "./Reveal";

const HOURS = [
  { days: "Tuesday – Thursday", time: "5:30 pm – 10:00 pm" },
  { days: "Friday – Saturday", time: "5:00 pm – 11:00 pm" },
  { days: "Sunday", time: "5:00 pm – 9:00 pm" },
  { days: "Monday", time: "Closed" },
];

const OAK_ROOM = "Oak Room";
const CELLAR = "Cellar";
const OAK_ROOM_CAPACITY = 16;
const CELLAR_CAPACITY = 32;
const PRIVATE_ROOMS = [OAK_ROOM, CELLAR];
const MAIN_HALL = "Main Hall";

const PRIVATE_PACKAGES = [
  "Family Feast — $55 per guest",
  "Celebration Supper — $85 per guest",
  "Seasonal Tasting — $145 per guest",
];
const MAIN_HALL_MENU = "À la carte — order at the table";

type BookingType = "Private Dining" | "Main Hall";
type Status = "idle" | "submitting" | "success" | "error";

export function Reservations() {
  const [guests, setGuests] = useState(2);
  const [bookingType, setBookingType] = useState<BookingType>("Private Dining");
  const [room, setRoom] = useState(OAK_ROOM);
  const [pkg, setPkg] = useState(PRIVATE_PACKAGES[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = useServerFn(submitBooking);

  const venue = bookingType === "Private Dining" ? room : MAIN_HALL;

  function handleGuestsChange(value: number) {
    const nextGuests = Number.isFinite(value) ? Math.max(value, 1) : 1;
    if (bookingType === "Private Dining") {
      if (guests <= OAK_ROOM_CAPACITY && nextGuests > OAK_ROOM_CAPACITY) {
        setRoom(CELLAR);
      } else if (guests > OAK_ROOM_CAPACITY && nextGuests <= OAK_ROOM_CAPACITY) {
        setRoom(OAK_ROOM);
      }
    }
    setGuests(nextGuests);
  }

  function handleBookingTypeChange(next: BookingType) {
    setBookingType(next);
    setPkg(next === "Main Hall" ? MAIN_HALL_MENU : PRIVATE_PACKAGES[0]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (bookingType === "Private Dining" && guests > CELLAR_CAPACITY) {
      setStatus("error");
      setErrorMessage(`Private dining can accommodate up to ${CELLAR_CAPACITY} guests in the Cellar.`);
      return;
    }

    const data = new FormData(form);
    const date = String(data.get("date") ?? "");
    const reservationTime = String(data.get("reservation_time") ?? "");
    const timeError = reservationTimeError(date, reservationTime);

    if (timeError) {
      setStatus("error");
      setErrorMessage(timeError);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const result = await submit({
      data: {
        name: String(data.get("name") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        contact: String(data.get("contact") ?? "").trim(),
        guests,
        date,
        reservation_time: reservationTime,
        room_preference: venue,
        booking_type: bookingType,
        event_type: String(data.get("event_type") ?? "").trim(),
        menu_package: pkg,
        allergies: String(data.get("allergies") ?? "").trim(),
        special_instructions: String(data.get("special_instructions") ?? "").trim(),
      },
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
      setGuests(2);
      setBookingType("Private Dining");
      setRoom(OAK_ROOM);
      setPkg(PRIVATE_PACKAGES[0]);
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
            Choose private dining in the Oak Room or Cellar, or reserve a table in the Main Hall.
            Tell us your group size and preferred time; we will confirm your request by phone.
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
            <fieldset>
              <legend className="eyebrow">Booking type</legend>
              <div className="mt-3 grid grid-cols-2 border border-border">
                {(["Private Dining", "Main Hall"] as BookingType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={bookingType === t}
                    onClick={() => handleBookingTypeChange(t)}
                    className={`px-4 py-3 text-[0.6875rem] tracking-[0.16em] uppercase transition-colors ${
                      bookingType === t ? "bg-ink text-cream" : "text-ink hover:text-brass"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
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
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={restaurantToday()}
                  required
                  className="field mt-3"
                />
              </div>
              <div>
                <label htmlFor="reservation_time" className="eyebrow">
                  Reservation time
                </label>
                <input
                  id="reservation_time"
                  name="reservation_time"
                  type="time"
                  required
                  className="field mt-3"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Choose a time within the opening hours shown.
                </p>
              </div>
              {bookingType === "Private Dining" ? (
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
                    {PRIVATE_ROOMS.map((name) => (
                      <option key={name} value={name} disabled={name === OAK_ROOM && guests > OAK_ROOM_CAPACITY}>
                        {name} — up to {name === OAK_ROOM ? OAK_ROOM_CAPACITY : CELLAR_CAPACITY} guests
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                    {guests > CELLAR_CAPACITY
                      ? `Private rooms hold up to ${CELLAR_CAPACITY} guests. Choose Main Hall or reduce your group size.`
                      : guests > OAK_ROOM_CAPACITY
                      ? `For ${guests} guests, the Cellar is selected automatically (up to ${CELLAR_CAPACITY} guests).`
                      : `Oak Room: up to ${OAK_ROOM_CAPACITY} guests · Cellar: up to ${CELLAR_CAPACITY} guests.`}
                  </p>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <p className="eyebrow">Seating</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Main Hall — open dining with à la carte service
                  </p>
                </div>
              )}
              <div className="sm:col-span-2">
                <label htmlFor="menu_package" className="eyebrow">
                  Menu
                </label>
                <select
                  id="menu_package"
                  name="menu_package"
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  className="field mt-3"
                >
                  {(bookingType === "Main Hall" ? [MAIN_HALL_MENU] : PRIVATE_PACKAGES).map((p) => (
                    <option key={p} value={p}>
                      {p}
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
              <div className="sm:col-span-2">
                <label htmlFor="allergies" className="eyebrow">
                  Allergies or dietary needs
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  Share any allergies or dietary needs so our team can follow up.
                </p>
                <textarea
                  id="allergies"
                  name="allergies"
                  maxLength={500}
                  rows={3}
                  placeholder="List any allergies or dietary needs"
                  className="field mt-3 resize-y"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="special_instructions" className="eyebrow">
                  Special instructions
                </label>
                <textarea
                  id="special_instructions"
                  name="special_instructions"
                  maxLength={1000}
                  rows={3}
                  placeholder="Anything else we should know?"
                  className="field mt-3 resize-y"
                />
              </div>
            </div>

            <button type="submit" disabled={status === "submitting"} className="btn-solid mt-10 w-full disabled:opacity-60 sm:w-auto">
              {status === "submitting" ? "Sending…" : "Request Reservation"}
            </button>
            <p aria-live="polite" className="mt-5 text-xs text-muted-foreground">
              {status === "success"
                ? "Thank you — your request has been received. We will confirm it by phone within one business day."
                : status === "error"
                  ? errorMessage
                  : "We will confirm your booking request by phone within one business day."}
            </p>
            {status === "error" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Need help?{" "}
                <a
                  href="https://wa.me/15556625111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-brass"
                >
                  Contact us on WhatsApp.
                </a>
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
