import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@alquenta.example",
    href: "mailto:hello@alquenta.example",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 010-1234",
    href: "tel:+15550101234",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Main St, Remote-first",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Questions about the platform? Reach out through any of these
          channels.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {channels.map((channel) => (
          <Card key={channel.label}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <channel.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{channel.label}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="font-medium">{channel.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
