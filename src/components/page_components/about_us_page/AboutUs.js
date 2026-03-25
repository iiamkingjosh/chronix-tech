"use client";
import { aboutUsPageText } from "@/app/index/text_contents";
import Image from "next/image";
import React from "react";

const AboutUs = () => {

  const getImage = () => {
      return [
        "/images/about_us/vecteezy_blue-dots-world-map_13079258 (6).png",
        "/images/about_us/vecteezy_blue-dots-world-map_13079258 (7).png",
      ];
  };

  const images = getImage();
  return (
    <div className="p-4 md:p-8 grid grid-cols-1 relative md:grid-cols-2 gap-4 md:gap-8 h-auto min-h-screen  ">
      <div className="absolute bottom-0 w-full h-[60dvh] translate-y-1/2 translate-x-1/4 right-0 -z-10">
        <Image
          src={images[1]}
          alt="Dotted pattern top right"
          width={300}
          height={300}
          className="object-contain w-full h-full"
        />
      </div>
      {/* Background Image */}
      <Image
        width={1920}
        height={1080}
        src={"/images/home_page/faq/Ornaments.png"}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        priority
        alt="FAQ background"
      />
      <div className="flex flex-col items-start ">
        <h1 className="font-extrabold text-lg">
          {aboutUsPageText.aboutUs.header}
        </h1>
        <p className="text-2xl md:text-4xl font-bold">
          {aboutUsPageText.aboutUs.subHeading}
        </p>
      </div>
      {aboutUsPageText.aboutUs.points.map((point, i) => (
        <span
          key={i}
          className="flex flex-col items-center gap-y-4 text-center"
        >
          <span className="text-vibrant_orange">{point.icon}</span>
          <h1 className="text-3xl font-bold">{point.title}</h1>
          <p className="font-bold md:max-w-sm">{point.desc}</p>
        </span>
      ))}
    </div>
  );
};

export default AboutUs;
