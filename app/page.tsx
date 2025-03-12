import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <Hero />
        <Separator className="my-8" />
        <Experience />
        <Footer />
      </main>
    </div>
  );
}
