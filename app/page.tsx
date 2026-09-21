import { Hero } from "@/components/Hero";
import { CategoryTiles } from "@/components/CategoryTiles";
import { Catalog } from "@/components/Catalog";
import { Story } from "@/components/Story";
import { HowToBuy } from "@/components/HowToBuy";
import { InstagramStrip } from "@/components/InstagramStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <Catalog />
      <Story />
      <HowToBuy />
      <InstagramStrip />
    </>
  );
}
