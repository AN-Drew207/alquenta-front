import { Handshake, MessagesSquare, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "Browse the catalog",
    description: "Explore available properties from independent owners and agencies, filter by type and city.",
  },
  {
    icon: MessagesSquare,
    title: "Contact the owner",
    description: "Send a message or make an offer directly from the listing — no middleman, no waiting.",
  },
  {
    icon: Handshake,
    title: "Negotiate directly",
    description: "Chat back and forth in one conversation thread until you both agree on the terms.",
  },
  {
    icon: ShieldCheck,
    title: "Close the deal",
    description: "The actual contract happens off-platform, between you and the property owner.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">About Alquenta</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Alquenta is a property marketplace where anyone can publish
          listings as an admin, and anyone can browse and reach out as a
          client — directly, without intermediaries.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardContent className="flex items-start gap-4 py-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <step.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
