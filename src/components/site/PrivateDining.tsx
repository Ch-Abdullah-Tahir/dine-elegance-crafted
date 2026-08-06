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
      <div className="absolute inset-0 bg-ink/65" />
      <div className="relative mx-auto max-w-3xl px-5 py-32 text-center text-cream sm:px-8 md:py-44">
        <Reveal>
          <p className="eyebrow">Private Dining</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Two rooms, held for your evening
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream/80">
            The Oak Room seats fourteen; the Cellar seats thirty-six. Both come with a dedicated
            captain, a bespoke menu written with our chef, and wine chosen alongside our sommelier —
            for rehearsal dinners, board evenings, and anniversaries worth the trouble.
          </p>
          <a href="#reservations" className="btn-outline mt-10">
            Book Private Event
          </a>
        </Reveal>
      </div>
    </section>
  );
}
