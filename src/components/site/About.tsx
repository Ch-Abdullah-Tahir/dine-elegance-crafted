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
              Fine Dine began with a simple conviction: that a great meal is an act of hospitality
              first and a performance second. Our kitchen cooks with what the season gives — produce
              from growers we have known for a decade, fish landed the same morning, bread pulled
              from the oven each afternoon.
            </p>
            <p>
              The dining room is warm and unhurried. Brass, linen, oak. Nothing that asks for
              attention, everything that rewards it. Come for a Tuesday supper at the bar or a
              tasting menu that unfolds across four hours.
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
