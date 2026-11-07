import { Reveal } from "./Reveal";
import { MENU_SECTIONS, PACKAGES } from "./menu-data";

export function MenuPreview() {
  return (
    <section id="menu" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="text-center">
        <p className="eyebrow">Food &amp; Menus</p>
        <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
          One menu for every kind of evening
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Choose a set menu for private dining or individual dishes in the Main Hall. The listed
          dishes and prices stay the same; tell us about allergies or dietary needs when you reserve.
        </p>
      </Reveal>

      <div className="mt-16">
        <h3 className="border-b border-border pb-4 text-[0.7rem] font-medium tracking-[0.28em] text-brass uppercase">
          Private Event Menus
        </h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
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
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Package prices are per guest, before drinks and service.
        </p>
      </div>

      <div className="mt-20 space-y-16">
        <h3 className="border-b border-border pb-4 text-[0.7rem] font-medium tracking-[0.28em] text-brass uppercase">
          Main Hall À La Carte
        </h3>
        {MENU_SECTIONS.map((section, sectionIndex) => (
          <Reveal key={section.title} delay={(sectionIndex % 2) * 100}>
            <h4 className="font-display text-2xl">{section.title}</h4>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.name} className="overflow-hidden border border-border bg-card">
                  {"image" in item && (
                    <img
                      src={item.image}
                      alt={item.name}
                      width={1000}
                      height={1000}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                      <h5 className="min-w-0 font-display text-xl">{item.name}</h5>
                      <span className="shrink-0 text-sm text-muted-foreground">${item.price}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
