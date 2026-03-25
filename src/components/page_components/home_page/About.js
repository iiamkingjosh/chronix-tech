"use client";
import React from "react";
import DottedCard from "./DottedCard";
import { servicesText } from "@/app/index/text_contents";
import { useThemeProvider } from "@/app/ThemeProvider";

const About = () => {
  const { theme } = useThemeProvider();

  return (
    <DottedCard className="py-6 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      <h1
        className={`
          text-3xl sm:text-4xl md:text-[40px] 
          tracking-wide font-bold text-center 
          max-w-xs sm:max-w-lg md:max-w-2xl 
          px-2 sm:px-4
          ${theme === "dark" ? "text-vibrant_orange" : "text-light_blue"}
        `}
      >
        {servicesText.about.heading}
      </h1>

      <p
        className="
        max-w-xs sm:max-w-lg md:max-w-2xl 
        my-4 sm:my-5 md:my-6 
        px-2 sm:px-4
        text-xs sm:text-sm 
        leading-relaxed
        text-center sm:text-left
      "
      >
        {servicesText.about.subHeading}
      </p>

      <h1
        className={`
          text-base sm:text-lg md:text-xl 
          tracking-wide font-bold text-center 
          max-w-xs sm:max-w-lg md:max-w-2xl 
          px-2 sm:px-4
          mt-2 sm:mt-3 md:mt-4
          font-orbitron 
          ${theme === "dark" ? "text-vibrant_orange" : "text-light_blue"}
        `}
      >
        {servicesText.about.footer}
      </h1>
    </DottedCard>
  );
};

export default About;
