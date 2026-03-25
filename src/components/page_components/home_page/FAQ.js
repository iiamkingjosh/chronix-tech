"use client";
import { FAQtext } from "@/app/index/text_contents";
import { useThemeProvider } from "@/app/ThemeProvider";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import FAQItem from "../faq/FAQItem";

const FAQ = () => {
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
      <div className="flex flex-col md:flex-row items-start justify-around h-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-auto flex flex-col h-full mt-8 md:mt-16 justify-between md:justify-around">
          {/* Mobile/Tablet FAQ Heading */}
          <div className="block md:hidden text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold font-orbitron">
              FAQ
            </h1>
            <div className="w-24 h-1 bg-current mx-auto mt-2 opacity-50"></div>
          </div>

          {/* Desktop FAQ Heading */}
          <div className="hidden md:flex md:flex-col h-full justify-around">
            <span></span>
            <h1 className="text-6xl font-bold font-orbitron">FAQ</h1>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className="w-full md:w-auto flex flex-col gap-y-3 relative">
          {FAQtext.slice(0, 6).map((text, i) => (
            <FAQItem text={text} key={i} />
          ))}

          {/* Decorative question mark image - fixed z-index issue */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30 md:opacity-100 -z-40">
            <Image
              width={500}
              height={500}
              src={`/images/home_page/faq/${theme === "dark" ? "question mark 2 2" : "question mark 2 2 (1)"}.png`}
              className="absolute inset-0 w-full h-full object-contain md:object-cover"
              priority
              alt="FAQ decorative"
            />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default FAQ;
