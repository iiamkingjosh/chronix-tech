import { ArrowUpDown, Check } from "lucide-react";
import Image from "next/image";
import React from "react";

const ImageMache = () => {
  return (
    <div className="relative h-screen flex items-center w-full overflow-hidden">
      <span className="bg-vibrant_orange rounded-full w-12 h-12 bottom-24 left-0 top-1/4 translate-x-full absolute flex items-center justify-center ">
        <ArrowUpDown />
      </span>
      {/* Dotted border circle + orange inner circle — z-10 so they sit under the image */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-96 h-96">
        {/* Dotted border ring */}
        <div className="absolute w-full h-full rounded-full border-4 border-dotted" />
        {/* Solid orange circle inside */}
        <div className="w-[350px] h-[350px] rounded-full bg-vibrant_orange" />
        <Image
          width={500}
          height={500}
          src={"/images/services_page/happy-boy.png"}
          className="absolute w-44 h-44 top-12 right-0 translate-x-1/2 bottom-0 object-contain z-20"
          priority
          alt="Hero background"
        />

        <span className="bg-white rounded-full w-12 h-12 bottom-24 right-0 translate-x-full absolute flex items-center justify-center ">
          <span className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center ">
            <Check size={16} />
          </span>
        </span>
      </div>

      {/* Background Image — z-20 so it renders on top of the circles */}
      <Image
        width={500}
        height={500}
        src={"/images/services_page/happy-man.png"}
        className="absolute w-[80%] h-[80%] bottom-0 object-cover z-20"
        priority
        alt="Hero background"
      />
      <div className="flex items-start absolute bottom-10 z-30 rounded-xl bg-white w-64 text-black gap-4 px-3 py-6 gap-y-5">
        <span className="bg-green-200 rounded-full w-12 h-12  flex items-center justify-center ">
          <span className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center ">
            <Check size={16} />
          </span>
        </span>
        <span className="flex flex-col gap-y-3">
          <h2 className="font-extrabold ">
            Design <br /> Complete
          </h2>
          <p className="text-xs">Transaction Completed</p>
        </span>
      </div>
      <div className="flex items-start right-0 absolute bottom-30 z-30 rounded-xl bg-white w-64 text-black gap-4 px-3 py-6 gap-y-5">
        <span className="bg-green-200 rounded-full w-12 h-12  flex items-center justify-center ">
          <span className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center ">
            <Check size={16} />
          </span>
        </span>
        <span className="flex flex-col gap-y-3">
          <h2 className="font-extrabold ">Order Completed</h2>
          <p className="text-xs">Transaction Completed</p>
        </span>
      </div>
    </div>
  );
};

export default ImageMache;
