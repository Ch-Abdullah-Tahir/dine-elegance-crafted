import { Reveal } from "./Reveal";
import privateDining from "@/assets/private-dining.jpg";

export function PrivateDining() {
  return (
    <section id="private-dining" className="relative overflow-hidden">
      <img
        src={privateDining}
        alt="Private dining room with a long candlelit table"
        width={1920}
        height={900}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-3xl px-5 py-32 text-center text-cream sm:px-8 md:py-44">
        <Reveal>
          <p className="eyebrow">Private Dining</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Private dining for your evening
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream/80">
            Choose the candlelit Oak Room or the stone-vaulted Cellar. Both private rooms include a
            dedicated captain, a menu planned with our chef, and wine selected with our sommelier.
            Request a room for a family gathering, celebration, or business dinner. Include your
            group size and preferred room in the reservation form.
          </p>
          <a href="#reservations" className="btn-outline mt-10">
            Book Private Event
          </a>
        </Reveal>
      </div>
    </section>
  );
}
