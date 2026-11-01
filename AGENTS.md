<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Booking form backend
- Reservations submit to an external (user-owned) Supabase project `povlwnfplaivsrgqttom`, table `bookings`: top-level `phone`, the rest inside `captured_fields_json` (name, date as "29th September 2026", guests as string, room_preference, event_type, contact). The insert runs in the server fn `src/lib/booking.functions.ts` using the publishable key, which is intentionally in code (public key). RLS on that table allows anon INSERT only, so test rows cannot be deleted from app code.
