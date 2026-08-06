import { Reveal } from "./Reveal";

const MENU = [
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
  return (
    <section id="menu" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="text-center">
        <p className="eyebrow">The Menu</p>
        <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">Summer, in four movements</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Our menu changes with the market. A five-course tasting is offered nightly at $145 per guest.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-x-20">
        {MENU.map((section, i) => (
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
    </section>
  );
}
