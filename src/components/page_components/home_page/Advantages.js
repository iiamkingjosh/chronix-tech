import { advantages } from "@/app/index/text_contents";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import React from "react";

const Advantages = () => {
  return (
    <div className="card-tertiary relative min-h-screen h-auto">
      <div className="absolute bottom-0 right-0 z-0">
        <Image
          src={advantages.logoImage}
          alt="Loggo Image"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center md:justify-between py-4 px-4 md:px-8">
        <div className="hidden md:flex items-center justify-center w-1/2">
          <Image
            src={advantages.mainImage}
            alt="Logo Image"
            width={500}
            height={500}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <h1 className="text-[40px] tracking-wide font-orbitron font-bold text-center">
            {advantages.heading}
          </h1>
          <ul className="flex flex-col max-w-sm gap-y-3">
            {advantages.advantages.map((advantage, i) => (
              <li className="flex items-start gap-2" key={i}>
                <span className="p-3 rounded-lg bg-vibrant_orange">
                  <ArrowUpDown size={20} />
                </span>
                <span>
                  <h2 className="text-lg font-semibold">{advantage.heading}</h2>
                  <p className="text-xs  opacity-65 leading-loose">
                    {advantage.subHeading}
                  </p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
