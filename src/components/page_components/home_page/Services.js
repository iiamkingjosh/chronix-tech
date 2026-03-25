"use client";
import { servicesText } from "@/app/index/text_contents";
import { useThemeProvider } from "@/app/ThemeProvider";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Services = () => {
  const { theme } = useThemeProvider();
  return (
    <div className="h-auto py-8 px-2 min-h-[50dvh]  flex flex-col items-center justify-center w-full card-tertiary">
      <h1 className="text-[40px] tracking-wide font-bold text-center">
        {servicesText.services.heading}
      </h1>
      <h1 className="max-w-3xl md:text-lg text-center mb-8">
        {servicesText.services.subHeading}
      </h1>

      {/* Grid container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {servicesText.services.services.map((service, i) => (
          <div
            key={i}
            className="relative rounded-xl w-full aspect-[4/3] flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-300"
          >
            {/* Image container */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                src={theme === "dark" ? service.darkModeImage : service.image}
                alt={service.title || `Service ${i + 1}`}
              />
            </div>

            {/* Optional overlay with service title */}
            <div className="absolute flex-col items-start gap-y-2 inset-0 bg-black/30 flex justify-center p-4 transition-opacity duration-300">
              <span className="p-3 rounded-full bg-vibrant_orange">
                <ArrowUpDown size={20} />
              </span>
              <h3 className="text-white text-xl font-semibold">
                {service.heading}
              </h3>
              <p>{service.subHeading}</p>
              <Link href={"/services"}>Learn More -</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
