"use client";
import React from "react";
import Image from "next/image";

const DottedCard = ({ children, className }) => {
  const getImage = () => {
    return [
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258 (1).png",
      "/images/home_page/services/vecteezy_blue-dots-world-map_13079258.png",
    ];
  };

  const images = getImage();

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* Bottom Left Image */}
      <div className="absolute bottom-0 left-0 z-0">
        <Image
          src={images[0]}
          alt="Dotted pattern bottom left"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      {/* Top Right Image */}
      <div className="absolute top-0 right-0 z-0">
        <Image
          src={images[1]}
          alt="Dotted pattern top right"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default DottedCard;
