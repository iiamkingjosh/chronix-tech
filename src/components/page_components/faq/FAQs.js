"use client";
import { FAQtext } from "@/app/index/text_contents";
import { useThemeProvider } from "@/app/ThemeProvider";
import Image from "next/image";
import React from "react";
import FAQItem from "./FAQItem";

const FAQs = () => {
  const { theme } = useThemeProvider();
  return (
    <div className="h-auto min-h-screen py-8 relative overflow-hidden">
      {/* Background Image */}
      <Image
        width={1920}
        height={1080}
        src={"/images/home_page/faq/Ornaments.png"}
        className="absolute inset-0 w-full h-full object-cover z-0"
        priority
        alt="FAQ background"
      />
      <div className="flex flex-col md:flex-row items-start justify-between h-full relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Left side with FAQ header and mapped FAQs */}
        <div className="w-full md:w-1/2 flex flex-col h-full mt-8 md:mt-16">
          {/* FAQ Heading */}
          <div className="text-center md:text-left mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron">
              FAQ
            </h1>
            <div className="w-24 h-1 bg-current mx-auto md:mx-0 mt-2 opacity-50"></div>
          </div>

          {/* Mapped FAQs */}
          <ul className="w-full flex flex-col gap-y-3 relative">
            {FAQtext.map((text, i) => (
              <FAQItem text={text} key={i} />
            ))}
          </ul>
        </div>

        {/* Right side with themed image */}
        {/* Right side with themed image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center self-stretch">
          <div className="relative w-[65%] h-full">
            <Image
              width={500}
              height={500}
              src={`/images/faq/questionmark.png`}
              className="object-contain w-full h-full"
              priority
              alt="FAQ decorative"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
