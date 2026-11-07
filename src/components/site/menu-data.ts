import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";
import dish6 from "@/assets/dish-6.jpg";
import oysters from "@/assets/menu/oysters.png";
import steakTartare from "@/assets/menu/steak-tartare.png";
import chilledPeaSoup from "@/assets/menu/chilled-pea-soup.png";
import stoneFruitTart from "@/assets/menu/stone-fruit-tart.png";
import pannaCotta from "@/assets/menu/buttermilk-panna-cotta.png";
import roastGuineaHen from "@/assets/menu/roast-guinea-hen.png";

export const PACKAGES = [
  {
    name: "Family Feast",
    price: "55",
    desc: "A generous spread of roast meats, side dishes, warm breads, and a family-style dessert.",
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
    desc: "Five courses with an optional wine pairing selected by our sommelier.",
    note: "For private rooms",
  },
];

export const MENU_SECTIONS = [
  {
    title: "Appetizers",
    items: [
      {
        name: "Oysters, Mignonette",
        desc: "Half dozen oysters with mignonette sauce",
        price: "24",
        image: oysters,
      },
      {
        name: "Hokkaido Scallops",
        desc: "Meyer lemon beurre blanc, thyme, cured roe",
        price: "28",
        image: dish1,
      },
      {
        name: "Heirloom Carrots",
        desc: "Whipped ricotta, caraway, carrot-top oil",
        price: "22",
        image: dish4,
      },
      {
        name: "Steak Tartare",
        desc: "Cured egg yolk, capers, rye crisp",
        price: "26",
        image: steakTartare,
      },
      {
        name: "Chilled Pea Soup",
        desc: "Crème fraîche, mint, lardo",
        price: "18",
        image: chilledPeaSoup,
      },
    ],
  },
  {
    title: "Main Courses",
    items: [
      {
        name: "Line-Caught Halibut",
        desc: "Peas, sorrel, champagne butter",
        price: "48",
        image: dish5,
      },
      {
        name: "Dry-Aged Beef",
        desc: "Forty-day rib, bone marrow jus, confit garlic",
        price: "62",
        image: dish2,
      },
      {
        name: "Roast Guinea Hen",
        desc: "Corn, chanterelles, sauce suprême",
        price: "44",
        image: roastGuineaHen,
      },
      {
        name: "Agnolotti",
        desc: "Brown butter, fried sage, aged parmesan",
        price: "34",
        image: dish3,
      },
    ],
  },
  {
    title: "Desserts",
    items: [
      {
        name: "Bitter Chocolate",
        desc: "Olive oil, sea salt, crème fraîche gelato",
        price: "18",
        image: dish6,
      },
      {
        name: "Stone Fruit Tart",
        desc: "Almond frangipane, crème",
        price: "16",
        image: stoneFruitTart,
      },
      {
        name: "Buttermilk Panna Cotta",
        desc: "Honey, rhubarb",
        price: "15",
        image: pannaCotta,
      },
    ],
  },
];

export const FEATURED_DISHES = MENU_SECTIONS.flatMap((section) => section.items)
  .filter((item): item is typeof item & { image: string } => "image" in item)
  .map((item) => ({ ...item, price: `$${item.price}` }));
