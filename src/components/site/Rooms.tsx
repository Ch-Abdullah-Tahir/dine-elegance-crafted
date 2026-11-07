import { Reveal } from "./Reveal";
import oakRoom from "@/assets/private-dining.jpg";
import cellar from "@/assets/hero-dining.jpg";
import mainHall from "@/assets/hero-interior.jpg";

const ROOMS = [
  {
    src: oakRoom,
    tag: "Private",
    name: "Oak Room",
    detail: "Candlelit dining",
    desc: "A candlelit room with a long oak table. Your evening includes a dedicated captain, a menu planned with our chef, and wine selected with our sommelier.",
  },
  {
    src: cellar,
    tag: "Private",
    name: "Cellar",
    detail: "Stone-vaulted room",
    desc: "A private room for family gatherings and celebrations, with a dedicated captain, a menu planned with our chef, and wine selected with our sommelier.",
  },
  {
    src: mainHall,
    tag: "Open dining",
    name: "Main Hall",
    detail: "Open dining",
    desc: "Our main dining room offers bar and window seating with à la carte service. The bar is reserved for walk-in guests.",
  },
];

export function Rooms() {
  return (
    <section id="rooms" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="max-w-xl">
        <p className="eyebrow">The Rooms</p>
        <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
          Choose where your evening lives
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Choose a private room or open dining in the Main Hall. Use the reservation form to tell us
          your preference and group size.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room, i) => (
          <Reveal key={room.name} delay={(i % 3) * 100}>
            <article className="group">
              <div className="relative overflow-hidden">
                <img
                  src={room.src}
                  alt={room.name}
                  width={1000}
                  height={750}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 bg-ink/85 px-3 py-1.5 text-[0.6rem] tracking-[0.22em] text-cream uppercase">
                  {room.tag}
                </span>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl">{room.name}</h3>
                <span className="shrink-0 text-xs tracking-[0.14em] text-brass uppercase">
                  {room.detail}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{room.desc}</p>
              <a
                href="#reservations"
                className="mt-5 inline-block text-[0.6875rem] tracking-[0.2em] uppercase transition-colors hover:text-brass"
              >
                Book this room &rarr;
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
