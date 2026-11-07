import json
import unittest
from datetime import date

from agent import build_supabase_booking_row, canonical_menu_package


class MenuPackageMappingTests(unittest.TestCase):
    def test_private_packages_accept_short_and_full_website_labels(self):
        cases = (
            ("Family Feast", "Family Feast — $55 per guest"),
            ("family feast", "Family Feast — $55 per guest"),
            ("Celebration Supper — $85 per guest", "Celebration Supper — $85 per guest"),
            ("Seasonal Tasting, $145 per guest", "Seasonal Tasting — $145 per guest"),
            ("$55 per guest Family Feast", "Family Feast — $55 per guest"),
        )
        for given, expected in cases:
            with self.subTest(given=given):
                self.assertEqual(canonical_menu_package(given, "Private Dining"), expected)

    def test_mismatched_price_and_unknown_package_are_rejected(self):
        self.assertIsNone(canonical_menu_package("Family Feast — $85 per guest", "Private Dining"))
        self.assertIsNone(canonical_menu_package("Family Feast and cake", "Private Dining"))

    def test_main_hall_maps_accented_and_plain_labels(self):
        expected = "À la carte — order at the table"
        self.assertEqual(canonical_menu_package(expected, "Main Hall"), expected)
        self.assertEqual(canonical_menu_package("A la carte", "Main Hall"), expected)

    def test_supabase_payload_uses_website_row_shape_and_canonical_package(self):
        row = build_supabase_booking_row(
            phone="  +1 612 555 0100  ",
            name=" Alex Guest ",
            reservation_date=date(2026, 12, 12),
            reservation_time="19:00",
            guests=4,
            room_preference="Oak Room",
            booking_type="Private Dining",
            event_type="Birthday",
            menu_package=canonical_menu_package("Family Feast", "Private Dining"),
            contact="",
            allergies="Peanuts",
            special_instructions="Window table if possible",
        )

        self.assertEqual(set(row), {"phone", "captured_fields_json"})
        self.assertEqual(row["phone"], "+1 612 555 0100")
        fields = json.loads(row["captured_fields_json"])
        self.assertEqual(fields["date"], "12th December 2026")
        self.assertEqual(fields["menu_package"], "Family Feast — $55 per guest")
        self.assertEqual(fields["allergies"], "Peanuts")
        self.assertEqual(fields["special_instructions"], "Window table if possible")
        self.assertEqual(
            set(fields),
            {
                "name", "date", "reservation_time", "guests", "room_preference",
                "booking_type", "event_type", "menu_package", "contact", "allergies",
                "special_instructions",
            },
        )


if __name__ == "__main__":
    unittest.main()
