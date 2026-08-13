import { Hero } from "@/components/nosotros/hero";
import { Audiences } from "@/components/nosotros/audiences";
import { HowItWorks } from "@/components/nosotros/how-it-works";
import { CTA } from "@/components/nosotros/cta";

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
