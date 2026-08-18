"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import alquentaLogoOnDark from "@/assets/logo/sin_fondo/Alquenta 1.png";
import house1 from "@/assets/houses/1.jpg";
import house2 from "@/assets/houses/2.jpg";
import house3 from "@/assets/houses/3.jpg";
import house4 from "@/assets/houses/4.jpg";
import house5 from "@/assets/houses/5.jpg";
import house6 from "@/assets/houses/6.jpg";
import house7 from "@/assets/houses/7.jpg";
import house8 from "@/assets/houses/8.jpg";
import { cn } from "@/lib/utils";

const HOUSE_IMAGES = [house1, house2, house3, house4, house5, house6, house7, house8];

export function HouseImagePanel({ className }: { className?: string }) {
  const [houseImage, setHouseImage] = useState(HOUSE_IMAGES[0]);

  useEffect(() => {
    // Deliberately deferred to a client-only effect instead of picked during
    // render: picking randomly during render would run on both the server
    // and the client, and the two picks would disagree — a hydration
    // mismatch. Rendering the same fixed HOUSE_IMAGES[0] on server and first
    // client render, then randomizing right after, avoids that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHouseImage(HOUSE_IMAGES[Math.floor(Math.random() * HOUSE_IMAGES.length)]);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Image
        src={houseImage}
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <Image
        src={alquentaLogoOnDark}
        alt="Alquenta"
        className="absolute top-8 left-8 h-8 w-auto"
      />
    </div>
  );
}
