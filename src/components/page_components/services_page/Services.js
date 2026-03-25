"use client";
import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { servicesPageText } from "@/app/index/text_contents";

const services = servicesPageText.services;

const Services = () => {
  const getImage = () => {
    return [
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258 (1).png",
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258.png",
    ];
  };

  const images = getImage();

  return (
    <section
      className="h-auto min-h-screen relative w-full"
      aria-labelledby="services-heading"
    >
      {/* ✅ Hidden SEO Heading */}
      <h2 id="services-heading" className="sr-only">
        IT Services and Cybersecurity Solutions in Lagos Nigeria
      </h2>

      {/* Top Right Image */}
      <div className="absolute top-1/2 w-1/2 right-0 z-0">
        <Image
          src={images[1]}
          alt="Digital technology network background pattern"
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      {services.map((service, index) => (
        <div
          key={index}
          className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 p-8 lg:p-16 ${
            index % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[300px] lg:h-[400px]">
              <Image
                src={service.image}
                alt={`${service.heading} - Chronix Technology service in Lagos Nigeria`}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full z-10 lg:w-1/2 space-y-6">
            <span
              className={`text-sm rounded-full px-3 py-1 ${
                index % 2 !== 1 ? "bg-vibrant_orange" : "bg-dark_blue"
              } text-white`}
            >
              Our Services
            </span>

            {/* ✅ Service Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold whitespace-pre-line">
              {service.heading}
            </h2>

            {/* ✅ Service Description */}
            <p className="text-lg opacity-65">{service.subHeading}</p>

            {/* Bullets Section */}
            <div className="space-y-4 mt-8">
              {service.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-4">
                  <span
                    className={`flex rounded-full w-8 h-8 items-center justify-center ${
                      index % 2 !== 1 ? "bg-vibrant_orange" : "bg-dark_blue"
                    } text-white`}
                  >
                    <Check />
                  </span>

                  <div>
                    {/* ✅ Bullet Heading */}
                    <h3 className="text-xl font-semibold">
                      {bullet.heading}
                    </h3>

                    {/* ✅ Bullet Description */}
                    <p className="opacity-65">{bullet.subHeading}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Services;