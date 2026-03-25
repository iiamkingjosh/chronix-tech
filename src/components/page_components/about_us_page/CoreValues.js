"use client";
import { aboutUsPageText } from "@/app/index/text_contents";
import Image from "next/image";
import React from "react";

const CoreValues = () => {
  const getImage = () => {
    return [
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258 (1).png",
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258.png",
    ];
  };

  const images = getImage();

  return (
    <div className="h-auto py-8 flex min-h-screen flex-col justify-around items-center relative overflow-hidden gap-y-4 px-3">
      <div className="absolute top-0 w-1/4 left-0 -rotate-45 right-1/2 z-0">
        <Image
          src={images[0]}
          alt="Dotted pattern top right"
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="bg-vibrant_orange z-10 text-white w-full md:w-3/5 mx-auto py-5 px-6 rounded-2xl flex flex-col gap-y-3">
        <h3 className="w-full text-center font-bold stext-xl font-orbitron">
          {aboutUsPageText.coreValues.heading}
        </h3>
        <ol className="flex flex-row">
          {aboutUsPageText.coreValues.values.map((value, i) => (
            <li
              className="w-full md:w-1/4 items-center flex flex-col gap-y-3 "
              key={i}
            >
              <div className="w-18 h-18">
                <Image
                  src={value.image}
                  width={1000}
                  height={1000}
                  className="object-contain"
                  alt={`core values ${i} image}`}
                />
              </div>
              <p className="text-sm">{value.title}</p>
            </li>
          ))}
        </ol>
      </div>
      <ol className="flex flex-col md:rounded-2xl overflow-hidden gap-5 md:gap-0 md:flex-row w-full md:w-[75%]">
        {aboutUsPageText.achievements.map((achievement, i) => (
          <li
            className="relative flex items-center justify-center w-full md:w-1/3"
            key={i}
          >
            <span className="absolute text-white z-20 flex items-center justify-center flex-col w-full h-full">
              <h1 className="text-4xl font-extrabold">{achievement.value}</h1>
              <p>{achievement.title}</p>
            </span>
            {i % 2 === 0 && (
              <span className="absolute z-10 bg-light_blue opacity-70 w-full h-full" />
            )}
            <Image
              src={achievement.image}
              width={1000}
              height={1000}
              alt={`achievements ${i} image}`}
              className="object-contain"
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CoreValues;
