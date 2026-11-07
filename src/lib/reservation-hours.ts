const RESTAURANT_TIME_ZONE = "America/Chicago";

const HOURS_BY_DAY: Record<number, { open: number; close: number }> = {
  0: { open: 17 * 60, close: 21 * 60 }, // Sunday: 5 pm–9 pm
  2: { open: 17 * 60 + 30, close: 22 * 60 }, // Tuesday–Thursday: 5:30 pm–10 pm
  3: { open: 17 * 60 + 30, close: 22 * 60 },
  4: { open: 17 * 60 + 30, close: 22 * 60 },
  5: { open: 17 * 60, close: 23 * 60 }, // Friday–Saturday: 5 pm–11 pm
  6: { open: 17 * 60, close: 23 * 60 },
};

function datePartsInRestaurantTime(date = new Date()) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: RESTAURANT_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<"year" | "month" | "day" | "hour" | "minute", string>;
}

export function restaurantToday(now = new Date()) {
  const parts = datePartsInRestaurantTime(now);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function reservationTimeError(date: string, time: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return "Enter a valid reservation date and time.";
  }

  const parsedDate = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return "Enter a valid reservation date.";
  }

  const today = restaurantToday(now);
  if (date < today) return "That date has passed. Please choose a future date.";

  const weekday = parsedDate.getUTCDay();
  const hours = HOURS_BY_DAY[weekday];
  if (!hours) return "We are closed on Mondays. Please choose another day.";

  const requestedMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  if (requestedMinutes < hours.open || requestedMinutes >= hours.close) {
    return "That time is outside our opening hours. Please choose a time within the hours shown.";
  }

  if (date === today) {
    const parts = datePartsInRestaurantTime(now);
    const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute);
    if (requestedMinutes <= currentMinutes) {
      return "That time has passed. Please choose a later time.";
    }
  }

  return null;
}
