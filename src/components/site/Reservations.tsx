import { useState } from "react";
import { Reveal } from "./Reveal";

const HOURS = [
  { days: "Tuesday – Thursday", time: "5:30 pm – 10:00 pm" },
  { days: "Friday – Saturday", time: "5:00 pm – 11:00 pm" },
  { days: "Sunday", time: "5:00 pm – 9:00 pm" },
  { days: "Monday", time: "Closed" },
];

export function Reservations() {
  const [sent, setSent] = useState(false);

  return (
    <section id="reservations" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-16 md:grid-cols-[0.85fr_1.15fr] md:gap-24">
        <Reveal>
          <p className="eyebrow">Reservations</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">Join us for dinner</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Tables are released thirty days in advance. For parties larger than six, please write to us
            directly and we will arrange the evening.
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
          <form
            className="border border-border bg-card p-8 sm:p-12"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="eyebrow">
                  Name
                </label>
                <input id="name" name="name" type="text" required className="field mt-3" />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow">
                  Email
                </label>
                <input id="email" name="email" type="email" required className="field mt-3" />
              </div>
              <div>
                <label htmlFor="phone" className="eyebrow">
                  Phone
                </label>
                <input id="phone" name="phone" type="tel" className="field mt-3" />
              </div>
              <div>
                <label htmlFor="guests" className="eyebrow">
                  Guests
                </label>
                <select id="guests" name="guests" className="field mt-3" defaultValue="2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="eyebrow">
                  Date
                </label>
                <input id="date" name="date" type="date" className="field mt-3" />
              </div>
              <div>
                <label htmlFor="time" className="eyebrow">
                  Time
                </label>
                <input id="time" name="time" type="time" className="field mt-3" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="eyebrow">
                  Message
                </label>
                <textarea id="message" name="message" rows={3} className="field mt-3 resize-none" />
              </div>
            </div>

            <button type="submit" className="btn-solid mt-10 w-full sm:w-auto">
              Request Reservation
            </button>
            <p aria-live="polite" className="mt-5 text-xs text-muted-foreground">
              {sent
                ? "Thank you — this is a demonstration form, so nothing was sent. Please call us to confirm."
                : "We will confirm your table by email within one business day."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
