import { Instagram, Facebook, Twitter } from "lucide-react";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="eyebrow">Find Us</p>
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">211 North Washington</h2>
            <div className="mt-8 space-y-2 text-sm">
              <p className="text-muted-foreground">Minneapolis, MN 55401</p>
              <p>
                <a href="tel:+16125550147" className="transition-colors hover:text-brass">
                  +1 (612) 555-0147
                </a>
              </p>
              <p>
                <a href="mailto:hello@finedine.com" className="transition-colors hover:text-brass">
                  hello@finedine.com
                </a>
              </p>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Valet is available from 5:00 pm at the Washington Avenue entrance. The bar seats
              fourteen and is kept for walk-ins each evening.
            </p>
            <div className="mt-10 flex gap-5">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "X (Twitter)" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#contact"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-brass"
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.25} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              role="img"
              aria-label="Map showing the restaurant location in Minneapolis"
              className="flex h-72 items-center justify-center border border-border bg-secondary md:h-full md:min-h-80"
            >
              <span className="eyebrow">Map</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
