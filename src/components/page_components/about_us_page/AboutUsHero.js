import { aboutUsPageText } from "@/app/index/text_contents";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AboutUsHero = () => {
  return (
    <div className="h-auto min-h-screen flex items-center justify-between ">
      <div className="w-full px-4 md:px-8 md:flex md:w-1/2 h-full flex flex-col justify-center items-start z-40">
        <h1 className="text-5xl font-bold leading-loose mb-4">
          Protect Your Business <br /> Against Modern Threats
        </h1>
        <p className="text-lg">
          Have a question, want to partner, or just curious about Chronix? <br/> Reach
          out, we’re happy to help and will get back to you soon!
        </p>
        <span className="w-full items-center justify-start mt-4 flex gap-x-4">
          <Link href="/contact-us"className="btn btn-secondary btn-lg rounded-2xl">
            Submit Form
          </Link>
        </span>
      </div>
      <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center">
        <div className="w-[75%] translate-y-1/2 h-72 relative bg-gray-400 overflow-visible rounded-[50%] ">
          <Image
            src={aboutUsPageText.image}
            width={1000}
            height={1000}
            alt="hero image"
            className="object-contain -translate-y-1/2 absolute"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsHero;
