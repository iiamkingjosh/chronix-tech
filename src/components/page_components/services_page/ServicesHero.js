import Image from "next/image";
import React from "react";
import ImageMache from "./ImageMache";
import Link from "next/link";

const ServicesHero = () => {
  return (
    <div className="relative h-screen flex items-center w-full overflow-hidden">
      {/* Background Image */}
      <Image
        width={1920}
        height={1080}
        src={"/images/home_page/hero-bg.png"}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        style={{
          clipPath: "ellipse(100% 85% at 50% 15%)",
        }}
        priority
        alt="Hero background"
      />
      <div className="flex w-full text-white h-full items-center justify-around">
        <div className="w-full px-4 md:px-8 md:flex md:w-1/2 h-full flex flex-col justify-center items-start z-40">
          <h1 className="text-4xl font-bold mb-4">
            From infrastructure{" "}
            <span className="text-vibrant_orange">design</span> to <br />
            <span className="text-vibrant_orange">cybersecurity</span>
          </h1>
          <p className="text-lg">
            we provide end-to-end technology services tailored to your <br />{" "}
            business needs
          </p>
          <span className="w-full items-center justify-start mt-4 flex gap-x-4">
            <Link href="/about-us" className="btn btn-white btn-lg rounded-2xl">
              Explore Ecosystem
            </Link>
            <Link
              href="/about-us"
              className="btn btn-white-outline btn-lg rounded-2xl"
            >
              Our Impact
            </Link>
          </span>
        </div>
        <div className="hidden md:flex md:w-1/2 h-full z-40">
          <ImageMache />
        </div>
      </div>
    </div>
  );
};

export default ServicesHero;
