import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Interests } from "@/components/sections/Interests";
import { Footer } from "@/components/sections/Footer";
import { Timeline } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden">
      <Hero />
      <div className="relative">
        <div className="h-screen" /> {/* Spacer for hero section */}
        <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-3xl space-y-12 sm:space-y-16">
          <Timeline />
          <Separator className="my-6 sm:my-8" />
          <Interests />
          <Separator className="my-6 sm:my-8" />
          <Experience />
          <Footer />
        </main>
      </div>
    </div>
  );
}
