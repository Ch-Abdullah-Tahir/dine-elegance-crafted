import { Reveal } from "./Reveal";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";
import dish6 from "@/assets/dish-6.jpg";

const DISHES = [
  {
    src: dish1,
    name: "Hokkaido Scallops",
    description: "Meyer lemon beurre blanc, thyme, cured roe.",
    price: "$28",
  },
  {
    src: dish2,
    name: "Dry-Aged Beef",
    description: "Forty-day rib, bone marrow jus, confit garlic.",
    price: "$62",
  },
  {
    src: dish3,
    name: "Agnolotti",
    description: "Brown butter, fried sage, aged parmesan.",
    price: "$34",
  },
  {
    src: dish4,
    name: "Heirloom Carrots",
    description: "Whipped ricotta, caraway, carrot-top oil.",
    price: "$22",
  },
  {
    src: dish5,
    name: "Line-Caught Halibut",
    description: "Spring peas, sorrel, champagne butter.",
    price: "$48",
  },
  {
    src: dish6,
    name: "Bitter Chocolate",
    description: "Olive oil, sea salt, crème fraîche gelato.",
    price: "$18",
  },
];

export function SignatureDishes() {
  return (
    <section id="dishes" className="border-t border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Signature Plates</p>
          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Dishes the room returns for
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish, i) => (
            <Reveal key={dish.name} delay={(i % 3) * 100}>
              <article className="group">
                <div className="overflow-hidden">
                  <img
                    src={dish.src}
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
