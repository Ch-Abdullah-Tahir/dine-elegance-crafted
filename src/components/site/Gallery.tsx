import { Reveal } from "./Reveal";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import heroInterior from "@/assets/hero-interior.jpg";

const IMAGES = [
  { src: g1, alt: "Wine being poured at the table", w: 1000, h: 1400 },
  { src: g2, alt: "The brass bar at dusk", w: 1200, h: 800 },
  { src: g3, alt: "Chef finishing a plate with fresh herbs", w: 1000, h: 1300 },
  { src: g4, alt: "A place setting with brass cutlery and candle", w: 1200, h: 800 },
  { src: g5, alt: "Seasonal produce on the kitchen counter", w: 1000, h: 1300 },
  { src: heroInterior, alt: "The candlelit dining room", w: 1920, h: 1280 },
];

export function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="max-w-xl">
        <p className="eyebrow">Gallery</p>
        <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">The room, the hands, the harvest</h2>
      </Reveal>

      <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {IMAGES.map((img, i) => (
          <Reveal key={img.alt} delay={(i % 3) * 100} className="break-inside-avoid overflow-hidden">
            <img
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.h}
              loading="lazy"
              className="w-full object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
