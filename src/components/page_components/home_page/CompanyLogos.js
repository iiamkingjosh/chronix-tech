"use client";

import React, { useRef } from "react";

const CompanyLogos = () => {
  const companies = [
    {
      name: "Fortinet",
      logo: "/images/home_page/company_logos/fortinet.png",
    },
    {
      name: "Sophos",
      logo: "/images/home_page/company_logos/sophos.png",
    },
    {
      name: "Huawei",
      logo: "/images/home_page/company_logos/huawei.png",
    },
    {
      name: "Master Card",
      logo: "/images/home_page/company_logos/mastercard.png",
    },
    {
      name: "Bit Defender",
      logo: "/images/home_page/company_logos/bitdefender.png",
    },
    {
      name: "Google",
      logo: "/images/home_page/company_logos/google.png",
    },
    {
      name: "Kaspersky",
      logo: "/images/home_page/company_logos/kaspersky.png",
    },
    {
      name: "AWS",
      logo: "/images/home_page/company_logos/aws.png",
    },
    {
      name: "Veeam",
      logo: "/images/home_page/company_logos/veem.png",
    },
    {
      name: "Cloud",
      logo: "/images/home_page/company_logos/cloud.png",
    },
  ];

  const LogoItem = ({ company, index }) => (
    <div
      key={index}
      className="flex-shrink-0 w-32 h-16 flex items-center justify-center"
    >
      <img
        src={company.logo}
        alt={company.name}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );

  return (
    <div className="w-full border-y-2 border-gray-800 overflow-hidden card">
      {/* 
        The trick: wrap items in a flex container that is wider than the viewport.
        Duplicate the list so the second copy immediately follows the first.
        Animate translateX from 0 to -50% — moving exactly one full copy's width.
        When it reaches -50%, the animation loops back to 0, which looks identical
        because the second copy is pixel-perfect identical to the first.
      */}
      <div className="logos-track flex items-center gap-8 py-8">
        {/* First copy */}
        {companies.map((company, index) => (
          <LogoItem key={`a-${index}`} company={company} index={index} />
        ))}
        {/* Duplicate copy — makes the loop seamless */}
        {companies.map((company, index) => (
          <LogoItem
            key={`b-${index}`}
            company={company}
            index={index}
            aria-hidden="true"
          />
        ))}
      </div>

      <style jsx>{`
        .logos-track {
          /* Width must be at least 2x the content so both copies fit side by side */
          width: max-content;
          animation: seamless-slide 20s linear infinite;
        }

        .logos-track:hover {
          animation-play-state: paused;
        }

        @keyframes seamless-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            /*
              Translate exactly half the total track width (i.e. one full copy).
              Because the second copy is identical, the jump from -50% back to 0
              is invisible — creating a perfect loop.
            */
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyLogos;
