import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Reservations", href: "#reservations" },
  { label: "Private Dining", href: "#private-dining" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [announcement, setAnnouncement] = useState(true);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {announcement && (
        <div className="relative bg-ink text-cream">
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-2.5 sm:px-8">
            <p className="min-w-0 truncate text-center text-[0.65rem] tracking-[0.22em] uppercase sm:text-[0.7rem]">
              Summer Tasting Menu Now Available
            </p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setAnnouncement(false)}
              className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      <header
        className={`border-b transition-colors duration-500 ${
          scrolled ? "border-border bg-background/95 backdrop-blur-sm" : "border-transparent bg-background"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <a href="#top" className="min-w-0 font-display text-xl tracking-[0.32em] uppercase">
            Dine Cottage
          </a>

          <nav aria-label="Primary" className="hidden justify-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4">
            <a href="#reservations" className="btn-solid !px-6 !py-3">
              Reserve
            </a>
            <button
              type="button"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
            </button>
          </div>
        </div>

        {open && (
          <nav aria-label="Mobile" className="border-t border-border bg-background px-5 pb-6 lg:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="nav-link block border-b border-border py-4"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </div>
  );
}
