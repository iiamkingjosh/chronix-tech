import { aboutUsPageText } from "@/app/index/text_contents";
import Image from "next/image";
import React from "react";

const OurStory = () => {
  return (
    <div className="flex justify-between items-center h-auto min-h-screen">
      <div className="w-full md:w-[60%] flex items-center justify-center flex-col gap-y-5 bg-dark_blue h-auto min-h-screen">
        <div className="flex text-white flex-col gap-y-4 w-full justify-start p-4 md:px-12">
          <h1 className="text-4xl font-bold ">{aboutUsPageText.ourStory.heading}</h1>
          <p>
            {aboutUsPageText.ourStory.subHeading}
          </p>
        </div>
      </div>
      <div className="hidden h-full md:flex items-center justify-center md:w-[40%]">
        <Image
          src={aboutUsPageText.ourStory.image}
          width={1000}
          height={1000}
          alt="object-contain"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default OurStory;
