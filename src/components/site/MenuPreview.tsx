import { useState } from "react";
import { Reveal } from "./Reveal";

const PACKAGES = [
  {
    name: "Family Feast",
    price: "55",
    desc: "Sharing platters of the day's roasts, seasonal sides, warm breads, and a family-style dessert.",
    note: "For private rooms and family tables",
  },
  {
    name: "Celebration Supper",
    price: "85",
    desc: "Three courses with a welcome pour — birthdays, anniversaries, and evenings that deserve a toast.",
    note: "For private rooms and family tables",
  },
  {
    name: "Seasonal Tasting",
    price: "145",
    desc: "Five courses from the night's market, with an optional wine pairing chosen by our sommelier.",
    note: "For private rooms",
  },
];

const CARTE = [
  {
    title: "Appetizers",
    items: [
      { name: "Oysters, Mignonette", desc: "Half dozen, seasonal selection", price: "24" },
      { name: "Steak Tartare", desc: "Cured egg yolk, capers, rye crisp", price: "26" },
      { name: "Chilled Pea Soup", desc: "Crème fraîche, mint, lardo", price: "18" },
      { name: "Foie Gras Torchon", desc: "Stone fruit, brioche", price: "32" },
    ],
  },
  {
    title: "Main Courses",
    items: [
      { name: "Line-Caught Halibut", desc: "Spring peas, sorrel, champagne butter", price: "48" },
      { name: "Dry-Aged Beef", desc: "Bone marrow jus, confit garlic", price: "62" },
      { name: "Roast Guinea Hen", desc: "Corn, chanterelles, sauce suprême", price: "44" },
      { name: "Agnolotti", desc: "Brown butter, sage, aged parmesan", price: "34" },
    ],
  },
  {
    title: "Desserts",
    items: [
      { name: "Bitter Chocolate", desc: "Olive oil, sea salt, gelato", price: "18" },
      { name: "Stone Fruit Tart", desc: "Almond frangipane, crème", price: "16" },
      { name: "Buttermilk Panna Cotta", desc: "Honey, rhubarb", price: "15" },
      { name: "Selection of Cheese", desc: "Preserves, walnut bread", price: "22" },
    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Champagne, Grower", desc: "Coteaux Champenois, by the glass", price: "26" },
      { name: "Old Fashioned", desc: "Rye, demerara, orange oil", price: "19" },
      { name: "Burgundy Blanc", desc: "Bottle, sommelier's pick", price: "96" },
      { name: "Non-Alcoholic Pairing", desc: "Four courses, house ferments", price: "48" },
    ],
  },
];

export function MenuPreview() {
  const [view, setView] = useState<"packages" | "carte">("packages");

  return (
    <section id="menu" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="text-center">
        <p className="eyebrow">Food &amp; Menus</p>
        <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
          Set menus for gatherings, à la carte for the hall
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Private rooms and family tables book one of our set menus, priced per guest. In the Main
          Hall, order from the evening's à la carte menu. Final dishes are confirmed when you book.
        </p>

        <div className="mt-10 inline-flex border border-border" role="tablist" aria-label="Menu view">
          <button
            type="button"
            role="tab"
            aria-selected={view === "packages"}
            onClick={() => setView("packages")}
            className={`px-6 py-3 text-[0.6875rem] tracking-[0.2em] uppercase transition-colors ${
              view === "packages" ? "bg-ink text-cream" : "text-ink hover:text-brass"
            }`}
          >
            Private Event Menus
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "carte"}
            onClick={() => setView("carte")}
            className={`px-6 py-3 text-[0.6875rem] tracking-[0.2em] uppercase transition-colors ${
              view === "carte" ? "bg-ink text-cream" : "text-ink hover:text-brass"
            }`}
          >
            Main Hall À La Carte
          </button>
        </div>
      </Reveal>

      {view === "packages" ? (
        <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.name} delay={(i % 3) * 100}>
              <div className="border border-border bg-card p-8">
                <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">{pkg.note}</p>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl">{pkg.name}</h3>
                  <span className="shrink-0 text-sm text-brass">${pkg.price} / guest</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.desc}</p>
              </div>
            </Reveal>
          ))}
          <p className="text-center text-xs text-muted-foreground md:col-span-3">
            Prices are per guest, before drinks and service. Menus change with the season.
          </p>
        </div>
      ) : (
        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-x-20">
          {CARTE.map((section, i) => (
            <Reveal key={section.title} delay={(i % 2) * 100}>
              <h3 className="border-b border-border pb-4 text-[0.7rem] font-medium tracking-[0.28em] text-brass uppercase">
                {section.title}
              </h3>
              <ul className="mt-8 space-y-7">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                      <h4 className="min-w-0 font-display text-xl">{item.name}</h4>
                      <span className="shrink-0 text-sm text-muted-foreground">{item.price}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
