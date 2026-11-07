import { Reveal } from "./Reveal";
import { FEATURED_DISHES } from "./menu-data";

export function SignatureDishes() {
  return (
    <section id="dishes" className="border-t border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">From the Menu</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Menu favorites, shown as served
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_DISHES.map((dish, i) => (
            <Reveal key={dish.name} delay={(i % 3) * 100}>
              <article className="group">
                <div className="overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    width={1000}
                    height={1000}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                  <h3 className="min-w-0 font-display text-2xl">{dish.name}</h3>
                  <span className="shrink-0 text-sm text-brass">{dish.price}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dish.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
