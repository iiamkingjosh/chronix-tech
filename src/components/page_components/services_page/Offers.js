"use client";
import { servicesPageText } from "@/app/index/text_contents";
import React from "react";
import Image from "next/image";

const Offers = () => {
  // ✅ Safe fallback (prevents crash in production)
  const offers = servicesPageText?.offers || [];

  if (!offers.length) return null;

  return (
    <div className="flex items-center gap-y-4 justify-center flex-col min-h-screen h-auto py-8 px-4 sm:px-6 lg:px-8">
      <span className="btn btn-white btn-lg rounded-full btn-elevated shadow-md shadow-green-400 text-sm sm:text-base whitespace-nowrap px-4 sm:px-6">
        Why Choose Us?
      </span>

      <h1 className="text-xl sm:text-2xl md:text-3xl tracking-wide font-bold text-center max-w-2xl mx-auto">
        Take a look at what we offer?
      </h1>

      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-3 mt-4 sm:mt-8 w-full max-w-6xl mx-auto place-items-center">
        {offers.map((offer, i) => {
          const bgMap = {
            vibrant_yellow: "bg-yellow-400",
            white: "bg-white border border-gray-200",
            "grey-400": "bg-gray-300",
          };

          const textMap = {
            vibrant_yellow: "text-white",
            white: "text-gray-900",
            "grey-400": "text-gray-900",
          };

          const isOuter = i === 0 || i === 2;
          const isMiddle = i === 1;

          return (
            <li
              key={i}
              className={`
                flex flex-col rounded-2xl overflow-visible w-full max-w-[250px] sm:max-w-[220px] lg:max-w-[250px] shadow-lg
                ${isMiddle ? "lg:-translate-y-8" : ""}
                ${isMiddle ? "sm:col-span-2 lg:col-span-1" : ""}
                transition-transform duration-300 hover:scale-105 hover:shadow-xl
                mx-auto
              `}
            >
              {/* Image */}
              <div
                className={`relative ${bgMap[offer.bg]} flex justify-center rounded-t-2xl overflow-visible h-44 sm:h-40 lg:h-52`}
              >
                <Image
                  width={500}
                  height={500}
                  src={offer.image}
                  alt={offer.heading || "Chronix service offering"}
                  className={`
                    w-full object-cover h-full rounded-t-2xl
                    ${isOuter ? "sm:-translate-y-1/4" : ""}
                    transition-transform duration-300
                  `}
                />
              </div>

              {/* Text */}
              <div
                className={`${bgMap[offer.bg]} ${textMap[offer.bg]} px-3 sm:px-4 py-2 sm:py-3 rounded-b-2xl`}
              >
                <h2 className="text-base sm:text-sm md:text-lg font-bold tracking-wide text-center sm:text-left">
                  {offer.heading}
                </h2>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Offers;