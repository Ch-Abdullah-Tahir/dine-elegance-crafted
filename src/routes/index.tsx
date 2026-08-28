import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { SignatureDishes } from "@/components/site/SignatureDishes";
import { MenuPreview } from "@/components/site/MenuPreview";
import { PrivateDining } from "@/components/site/PrivateDining";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Reservations } from "@/components/site/Reservations";
import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";

const TITLE = "Dine Cottage — Seasonal Cuisine in Minneapolis";
const DESCRIPTION =
  "Dine Cottage serves seasonal American cuisine, tasting menus and private dining on North Washington Avenue in Minneapolis. Reserve a table.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "restaurant" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <SignatureDishes />
        <MenuPreview />
        <PrivateDining />
        <Gallery />
        <Testimonials />
        <Reservations />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
