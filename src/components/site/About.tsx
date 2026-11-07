import { Reveal } from "./Reveal";
import aboutRoom from "@/assets/about-room.jpg";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal className="overflow-hidden">
          <img
            src={aboutRoom}
            alt="Sunlit dining room with tall arched windows"
            width={1024}
            height={1280}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            A room built for long dinners and quiet celebration
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Dine Cottage serves Seasonal American food with a simple idea: a great meal is an act
              of hospitality first. Our menu includes oysters, steak tartare, roast guinea hen,
              line-caught halibut, and house desserts.
            </p>
            <p>
              The dining room is warm and unhurried, with brass, linen, and oak. Choose a private
              evening in the Oak Room or Cellar, or open dining in the Main Hall. The menu stays
              consistent, with set packages for private events and à la carte dining in the hall.
            </p>
          </div>
          <a href="#gallery" className="btn-solid mt-10">
            Meet Our Chef
          </a>
        </Reveal>
      </div>
    </section>
  );
}
