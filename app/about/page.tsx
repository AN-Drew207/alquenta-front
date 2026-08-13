import { Hero } from "@/components/about/hero";
import { Audiences } from "@/components/about/audiences";
import { HowItWorks } from "@/components/about/how-it-works";
import { CTA } from "@/components/about/cta";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <Hero />
      <Audiences />
      <HowItWorks />
      <CTA />
    </main>
  );
}
