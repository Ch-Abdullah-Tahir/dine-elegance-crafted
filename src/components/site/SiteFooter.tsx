const LINKS = ["About", "Menu", "Reservations", "Private Dining", "Gallery", "Contact"];

const HREFS: Record<string, string> = {
  About: "#about",
  Menu: "#menu",
  Reservations: "#reservations",
  "Private Dining": "#private-dining",
  Gallery: "#gallery",
  Contact: "#contact",
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-display text-2xl tracking-[0.32em] uppercase">
              Fine Dine
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Seasonal cuisine crafted with passion, served in a warm room on North Washington Avenue.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow">Explore</h2>
            <ul className="mt-6 space-y-3">
              {LINKS.map((l) => (
                <li key={l}>
                  <a href={HREFS[l]} className="text-sm text-muted-foreground transition-colors hover:text-brass">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow">Newsletter</h2>
            <p className="mt-6 text-sm text-muted-foreground">
              Seasonal menus and private event dates, once a month.
            </p>
            <form className="mt-6 flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input id="newsletter" type="email" placeholder="Email address" className="field" />
              <button type="submit" className="btn-solid !px-5 !py-2">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border pt-8">
          <p className="min-w-0 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Fine Dine. All rights reserved.
          </p>
          <div className="flex shrink-0 gap-5 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            <a href="#contact" className="transition-colors hover:text-brass">
              Instagram
            </a>
            <a href="#contact" className="transition-colors hover:text-brass">
              Facebook
            </a>
            <a href="#contact" className="transition-colors hover:text-brass">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
