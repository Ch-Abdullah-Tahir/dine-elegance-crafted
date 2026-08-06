import { Reveal } from "./Reveal";

const REVIEWS = [
  {
    quote:
      "The kind of restaurant that makes you cancel the rest of the evening. Every course arrived quietly and left an impression.",
    name: "Eleanor Voss",
    source: "The Quarterly Table",
  },
  {
    quote:
      "Service without theatre, cooking without ego. We have eaten here eleven times and would happily make it twelve tomorrow.",
    name: "Marcus Hale",
    source: "Guest since 2014",
  },
  {
    quote:
      "The halibut alone justifies the trip. But it is the room — warm, unhurried, generous — that we keep thinking about.",
    name: "Priya Raman",
    source: "City Dining Review",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 md:grid-cols-3 md:gap-12">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 120}>
              <figure>
                <span aria-hidden className="font-display text-6xl leading-none text-brass">&ldquo;</span>
                <blockquote className="mt-4 font-display text-2xl leading-snug">{review.quote}</blockquote>
                <figcaption className="mt-8 text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
                  {review.name} &middot; {review.source}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
