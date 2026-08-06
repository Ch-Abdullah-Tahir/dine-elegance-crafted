import { useEffect, useState } from "react";
import heroInterior from "@/assets/hero-interior.jpg";
import heroChef from "@/assets/hero-chef.jpg";
import heroDish from "@/assets/hero-dish.jpg";
import heroDining from "@/assets/hero-dining.jpg";

const SLIDES = [
  { src: heroInterior, alt: "Candlelit dining room at Fine Dine" },
  { src: heroChef, alt: "Chef plating a dish in the kitchen" },
  { src: heroDish, alt: "A signature plated course" },
  { src: heroDining, alt: "Guests dining in the evening" },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-ink">
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={1280}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-ink/55" />

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center text-cream">
          <p className="eyebrow">Est. 2011 &middot; Seasonal American</p>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl">Fine Dine</h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
            Seasonal cuisine crafted with passion.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#reservations" className="btn-outline">
              Reserve a Table
            </a>
            <a href="#menu" className="btn-outline">
              View Menu
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-px w-10 transition-colors duration-500 ${i === index ? "bg-brass" : "bg-cream/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
