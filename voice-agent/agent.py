import json
import logging
import os
import re
import unicodedata
from datetime import date, datetime, time
from zoneinfo import ZoneInfo

import aiohttp
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, RunContext, function_tool, inference, utils

load_dotenv(".env.local")

logger = logging.getLogger("dine-cottage-agent")
server = AgentServer()
BUSINESS_TIMEZONE = ZoneInfo("America/Chicago")

OPENING_HOURS = {
    # Python weekdays: Monday=0, Sunday=6.
    1: (time(17, 30), time(22, 0)),  # Tuesday
    2: (time(17, 30), time(22, 0)),  # Wednesday
    3: (time(17, 30), time(22, 0)),  # Thursday
    4: (time(17, 0), time(23, 0)),   # Friday
    5: (time(17, 0), time(23, 0)),   # Saturday
    6: (time(17, 0), time(21, 0)),   # Sunday
}

PRIVATE_MENU_PACKAGES = {
    "Family Feast": ("55", "Family Feast — $55 per guest"),
    "Celebration Supper": ("85", "Celebration Supper — $85 per guest"),
    "Seasonal Tasting": ("145", "Seasonal Tasting — $145 per guest"),
}
MAIN_HALL_MENU_PACKAGE = "À la carte — order at the table"


def canonical_menu_package(value: str, booking_type: str) -> str | None:
    """Map a spoken/displayed menu name to the website's canonical label."""
    normalized = (
        unicodedata.normalize("NFKD", value)
        .encode("ascii", "ignore")
        .decode("ascii")
        .casefold()
    )
    tokens = re.findall(r"[a-z]+|\d+", normalized)

    if booking_type == "Main Hall":
        if tokens in (
            ["a", "la", "carte"],
            ["a", "la", "carte", "order", "at", "the", "table"],
        ):
            return MAIN_HALL_MENU_PACKAGE
        return None

    if booking_type != "Private Dining":
        return None

    ignored_words = {"per", "guest", "guests", "person", "people", "each", "for"}
    for name, (price, canonical_label) in PRIVATE_MENU_PACKAGES.items():
        numbers = [token for token in tokens if token.isdigit()]
        if numbers and numbers != [price]:
            continue
        name_tokens = [
            token
            for token in tokens
            if not token.isdigit() and token not in ignored_words
        ]
        expected_tokens = re.findall(r"[a-z]+", name.casefold())
        if name_tokens == expected_tokens:
            return canonical_label

    return None


def build_supabase_booking_row(
    *,
    phone: str,
    name: str,
    reservation_date: date,
    reservation_time: str,
    guests: int,
    room_preference: str,
    booking_type: str,
    event_type: str,
    menu_package: str,
    contact: str,
    allergies: str,
    special_instructions: str,
) -> dict[str, str]:
    """Build the same bookings-table shape used by the website form."""
    fields = {
        "name": name.strip(),
        "date": format_ordinal_date(reservation_date),
        "reservation_time": reservation_time,
        "guests": str(guests),
        "room_preference": room_preference.strip(),
        "booking_type": booking_type,
        "event_type": event_type.strip(),
        "menu_package": menu_package,
        "contact": contact.strip(),
        "allergies": allergies.strip(),
        "special_instructions": special_instructions.strip(),
    }
    return {
        "phone": phone.strip(),
        "captured_fields_json": json.dumps(fields, ensure_ascii=False),
    }


def format_ordinal_date(value: date) -> str:
    day = value.day
    suffix = (
        "st" if day % 10 == 1 and day != 11 else
        "nd" if day % 10 == 2 and day != 12 else
        "rd" if day % 10 == 3 and day != 13 else
        "th"
    )
    return f"{day}{suffix} {value.strftime('%B %Y')}"


def validate_reservation_time(reservation_date: str, reservation_time: str) -> str | None:
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", reservation_date):
        return "I couldn't read that date. Ask for a date and repeat it back clearly."
    if not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", reservation_time):
        return "I couldn't read that time. Ask for a time and repeat it back clearly."
    try:
        parsed_date = date.fromisoformat(reservation_date)
        parsed_time = time.fromisoformat(reservation_time)
    except ValueError:
        return "I couldn't read that date or time. Ask for the date and time again."

    hours = OPENING_HOURS.get(parsed_date.weekday())
    if hours is None:
        return "The restaurant is closed on Monday. Ask for another date."

    opening, closing = hours
    if not opening <= parsed_time < closing:
        return "That time is outside our opening hours. Ask for another time during opening hours."

    requested = datetime.combine(parsed_date, parsed_time, tzinfo=BUSINESS_TIMEZONE)
    if requested < datetime.now(BUSINESS_TIMEZONE):
        return "That date and time have already passed. Ask for a future date and time."

    return None


RESTAURANT_KNOWLEDGE = """
RESTAURANT AND LOCATION
- Dine Cottage is a Seasonal American restaurant in Minneapolis. The website says Est. 2011.
- Address: 211 North Washington Ave, Minneapolis, MN 55401.
- Valet is available from 5:00 PM at the Washington Avenue entrance.
- The website does not provide other parking, accessibility, children, pet, dress-code, cancellation, or holiday-hour policies. Do not make these up; offer to pass the question to staff.
- Website contact details: reservations phone +1 (612) 555-0147; reservation email reserve@finedine.com; general email hello@finedine.com; WhatsApp +1 (555) 662-5111. Give the reservation email for booking follow-up and general email for other contact questions. Do not invent social media handles; the site's social icons do not show profile addresses.

DINING AND ROOMS
- The two private rooms are the Oak Room and the Cellar. The Main Hall is open dining.
- Oak Room: candlelit, long oak table. The website describes private dining as including a dedicated captain, a menu planned with the chef, and wine selected with the sommelier.
- Cellar: stone-vaulted private room for family gatherings and celebrations; it has the same private-dining service described for the Oak Room.
- Main Hall: open dining with bar and window seating and à la carte service. The bar is kept for walk-in guests.
- Private-room seating capacities: Oak Room seats up to 16 guests; Cellar seats up to 32 guests. For Private Dining with 1–16 guests, use Oak Room unless the caller prefers Cellar. For 17–32 guests, automatically select Cellar and tell the caller the Oak Room holds up to 16 and the Cellar up to 32. If the caller specifically asks for Oak Room with 17–32 guests, explain its 16-guest limit and move the preference to Cellar. For more than 32 guests, explain the private-room maximum and offer Main Hall instead; do not promise a Main Hall capacity because none is specified. Never claim a room or time is full.
- For private dining, the website's room choices are Oak Room or Cellar. For Main Hall, record Main Hall.

MAIN HALL À LA CARTE MENU (fixed menu; item prices)
Appetizers:
- Oysters, Mignonette — $24: half dozen oysters with mignonette sauce.
- Hokkaido Scallops — $28: Meyer lemon beurre blanc, thyme, cured roe.
- Heirloom Carrots — $22: whipped ricotta, caraway, carrot-top oil.
- Steak Tartare — $26: cured egg yolk, capers, rye crisp.
- Chilled Pea Soup — $18: crème fraîche, mint, lardo.
Main courses:
- Line-Caught Halibut — $48: peas, sorrel, champagne butter.
- Dry-Aged Beef — $62: forty-day rib, bone marrow jus, confit garlic.
- Roast Guinea Hen — $44: corn, chanterelles, sauce suprême.
- Agnolotti — $34: brown butter, fried sage, aged parmesan.
Desserts:
- Bitter Chocolate — $18: olive oil, sea salt, crème fraîche gelato.
- Stone Fruit Tart — $16: almond frangipane, crème.
- Buttermilk Panna Cotta — $15: honey, rhubarb.
- Do not list other dishes or drinks; they are not on the current website menu.
- The website says the listed dishes and prices stay the same for this demo. Do not claim that these menu items rotate seasonally.

PRIVATE EVENT MENUS (per guest; before drinks and service)
- Family Feast — $55 per guest: roast meats, side dishes, warm breads, family-style dessert. Listed for private rooms and family tables.
- Celebration Supper — $85 per guest: three courses with a welcome pour. Listed for private rooms and family tables; suitable to mention for birthdays and anniversaries.
- Seasonal Tasting — $145 per guest: five courses with an optional wine pairing selected by the sommelier. Listed for private rooms.
- For a Main Hall reservation, the website offers à la carte dining, ordered at the table; do not offer these packages as Main Hall menu choices.

RESERVATIONS AND HOURS (Minneapolis local time)
- Tuesday–Thursday: 5:30 PM–10:00 PM.
- Friday–Saturday: 5:00 PM–11:00 PM.
- Sunday: 5:00 PM–9:00 PM.
- Monday: closed.
- The website reservation form requires name, phone, guest count, date, time, booking type, event type, and menu selection. Additional contact, allergies/dietary needs, and special instructions can be blank if none were given.
- Booking type is Private Dining or Main Hall. Private-room choices are Oak Room or Cellar; Main Hall is open dining. Private menu choices are Family Feast — $55 per guest, Celebration Supper — $85 per guest, or Seasonal Tasting — $145 per guest. Main Hall menu choice is “À la carte — order at the table”.
- Menu choices may be spoken by their short name or their full displayed label with price. Store the full displayed label; do not ask the caller to repeat a menu choice just because they did not say its price.
- A reservation request is not a confirmed booking. The website says staff will confirm by phone within one business day.
- Do not promise availability or confirmation. Accept any positive guest count. Reject Monday, past dates/times, or times outside opening hours and offer a valid date/time.
- The website does not request payment or card details. Never ask the caller for card numbers or payment credentials.

MENU, DIETARY, AND UNKNOWN-ANSWER RULES
- Give short, plain-English descriptions first. For example, pronounce “panna cotta” as “PAH-nah KOH-tah” and “agnolotti” as “ahn-yoh-LOT-tee”; do not make the caller repeat a difficult dish name.
- Prices are the prices displayed on the website. Private package prices are per guest and before drinks and service. Do not add tax, service, or other charges unless asked; those amounts are not listed.
- Do not infer ingredients, substitutions, portion sizes, vegetarian/vegan/gluten-free suitability, or allergen safety. When asked about an allergy or dietary need, record it and say the restaurant team must confirm ingredients and accommodation.
- For capacity questions, state Oak Room: up to 16 guests; Cellar: up to 32 guests. Do not invent a Main Hall capacity. For other unlisted policies, ingredients, drinks, event details, or real-time availability, say the website does not specify it and offer the website reservation/contact options. Never guess.
"""


class RestaurantAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=f"""You are Sage, Dine Cottage's friendly AI host.

{RESTAURANT_KNOWLEDGE}

CONVERSATION AND RESERVATION RULES
- Answer from the facts above. Be clear and concise, and never invent missing details.
- Answer questions about the restaurant, the listed dishes and prices, private event packages, rooms, hours, location, valet, and contact details using the website facts above.
- When a caller wants a reservation, ask for only one missing detail at a time. Collect name, phone, optional additional contact, date, time, number of guests, booking type, room preference, event type, menu choice, allergies/dietary needs, and special instructions. Ask whether they have allergies/dietary needs and special instructions; use an empty value if they say no.
- If no special event is planned, record event type as “Regular dining”. For Main Hall, room preference must be Main Hall and menu choice must be “À la carte — order at the table”. For Private Dining, choose the room by party size: Oak Room for up to 16 unless Cellar is requested; Cellar for 17–32. Tell the caller both room capacities when the size changes the room. For more than 32 private-dining guests, explain the limit and offer Main Hall. Ask for one of the three listed packages. If the caller is undecided, ask a follow-up; do not guess.
- If the caller asks a question during booking, answer briefly and continue from the last missing detail without losing information already provided. If an answer is unclear, ask once more in simpler words; never fill in a value by guessing. Resolve relative dates using today's date in Minneapolis and clarify ambiguous phrases such as “next Friday” by saying the calendar date.
- Use Minneapolis local time. Do not submit a date in the past, a Monday, or a time outside the listed opening hours. Apply the private-room capacity rules above; do not check real-time fullness or reject a valid group within capacity.
- For an invalid date or time, explain the reason simply and offer the listed opening hours or ask for another future date. Do not describe an out-of-hours time as unavailable or full.
- Read all reservation details back and ask the caller to confirm before submitting. Record allergies exactly as stated. Never promise that a dish is allergen-free or that the kitchen can accommodate an allergy.
- If the caller corrects a detail during read-back, update it and read the entire request back again before asking for confirmation.
- A successful save is a request, not a confirmed booking. Say staff will confirm by phone within one business day. If saving fails, do not say it was submitted; direct the caller to the website reservation form, reservation phone, reservation email, or WhatsApp listed above.
- Use the reservation tool once, after full confirmation. Do not retry a timed-out or failed save automatically because it may have reached the database; instead explain that you could not confirm it and refer the caller to staff or the website form.
- Do not claim a booking was saved unless the tool returns status “saved”. If the tool returns “rejected”, explain the reason and ask for corrected information. Do not claim cancellations or modifications have been completed; those procedures are not listed, so refer the caller to staff.
- If the caller asks for a person, offer the listed contact details. Do not pretend to transfer the call.
- Keep answers brief and natural for spoken English. If you do not know an answer from the facts above, say so and offer a contact path instead of guessing."""
        )

    @function_tool()
    async def submit_reservation(
        self,
        context: RunContext,
        name: str,
        phone: str,
        contact: str,
        reservation_date: str,
        reservation_time: str,
        guests: int,
        booking_type: str,
        room_preference: str,
        event_type: str,
        menu_package: str,
        allergies: str,
        special_instructions: str,
    ) -> dict[str, str]:
        """Save a caller-confirmed restaurant reservation request.

        Use ISO date YYYY-MM-DD and 24-hour time HH:MM in Minneapolis local time.
        Pass an empty string for optional contact, allergies, or special instructions when none were given.
        Call only after reading all details back and the caller confirms them.
        """
        context.disallow_interruptions()

        if booking_type not in {"Private Dining", "Main Hall"}:
            return {"status": "rejected", "reason": "Choose Private Dining or Main Hall."}
        if not name.strip() or len(name.strip()) > 100:
            return {"status": "rejected", "reason": "A name of 1 to 100 characters is required."}
        if not 3 <= len(phone.strip()) <= 30:
            return {"status": "rejected", "reason": "A phone number of 3 to 30 characters is required."}
        if guests < 1:
            return {"status": "rejected", "reason": "The guest count must be at least one."}
        if booking_type == "Private Dining":
            if guests > 32:
                return {"status": "rejected", "reason": "Private dining can accommodate up to 32 guests in the Cellar. Offer Main Hall or ask for a smaller group."}
            if guests > 16:
                room_preference = "Cellar"
        if not 1 <= len(event_type.strip()) <= 80:
            return {"status": "rejected", "reason": "Please provide an event type of 1 to 80 characters, such as Regular dining."}
        if len(contact.strip()) > 120 or len(allergies.strip()) > 500 or len(special_instructions.strip()) > 1000:
            return {"status": "rejected", "reason": "One of the optional details is too long. Ask the caller to shorten it."}
        canonical_package = canonical_menu_package(menu_package, booking_type)
        if canonical_package is None:
            if booking_type == "Main Hall":
                return {"status": "rejected", "reason": "For Main Hall, choose À la carte — order at the table."}
            options = "; ".join(PRIVATE_MENU_PACKAGES.values())
            return {
                "status": "rejected",
                "reason": f"Choose a listed private dining menu: {options}. A menu name without its price is fine.",
            }

        if booking_type == "Main Hall":
            if room_preference.strip() != "Main Hall":
                return {"status": "rejected", "reason": "For Main Hall, room preference must be Main Hall."}
        else:
            if room_preference.strip() not in {"Oak Room", "Cellar"}:
                return {"status": "rejected", "reason": "Choose Oak Room or Cellar for Private Dining."}

        time_error = validate_reservation_time(reservation_date, reservation_time)
        if time_error:
            return {"status": "rejected", "reason": time_error}

        supabase_url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
        supabase_key = os.getenv("SUPABASE_PUBLISHABLE_KEY", "").strip()
        if not supabase_url or not supabase_key:
            return {
                "status": "failed",
                "reason": "Reservation saving is not configured. Do not say the request was submitted; direct the caller to the website form or WhatsApp.",
            }

        try:
            parsed_date = date.fromisoformat(reservation_date)
            row = build_supabase_booking_row(
                phone=phone,
                name=name,
                reservation_date=parsed_date,
                reservation_time=reservation_time,
                guests=guests,
                room_preference=room_preference.strip()
                or ("Main Hall" if booking_type == "Main Hall" else "Any private room"),
                booking_type=booking_type,
                event_type=event_type,
                menu_package=canonical_package,
                contact=contact,
                allergies=allergies,
                special_instructions=special_instructions,
            )
            session = utils.http_context.http_session()
            async with session.post(
                f"{supabase_url}/rest/v1/bookings",
                json=row,
                headers={
                    "apikey": supabase_key,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                if not response.ok:
                    logger.warning("Reservation insert failed with HTTP status %s", response.status)
                    return {
                        "status": "failed",
                        "reason": "The request could not be saved. Do not say it was submitted; direct the caller to the website form or WhatsApp.",
                    }

            return {
                "status": "saved",
                "message": "The request was received. Staff will confirm by phone within one business day.",
            }
        except Exception:
            logger.exception("Reservation insert failed")
            return {
                "status": "failed",
                "reason": "The request could not be saved. Do not say it was submitted; direct the caller to the website form or WhatsApp.",
            }


@server.rtc_session(agent_name="dine-cottage-voice-agent")
async def restaurant_agent(ctx: agents.JobContext) -> None:
    session = AgentSession(
        llm=inference.RealtimeModel(
            model="openai/gpt-realtime-2.1-mini",
            voice="marin",
        ),
    )
    await session.start(room=ctx.room, agent=RestaurantAgent())
    today = datetime.now(BUSINESS_TIMEZONE)
    local_today = f"{today:%A, %B} {today.day}, {today.year}"
    await session.generate_reply(
        instructions=(
            "Open with: \"Thanks for calling Dine Cottage. I'm Sage, your AI host. How can I help?\" "
            f"Today's date in Minneapolis is {local_today}. Resolve relative dates using that date."
        )
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
