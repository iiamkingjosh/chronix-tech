"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations } from "@/app/index/text_contents";

const MainNavigation = () => {
  const pathname = usePathname();

  const isActiveRoute = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[70%] z-50">
      <nav className="flex bg-charcoal rounded-full items-center px-2 sm:px-3 md:px-4 py-1 shadow-lg">
        <ul className="flex items-center justify-around flex-1 space-x-0.5 sm:space-x-1 md:space-x-2">
          {navigations.map((nav, index) => (
            <li key={index} className="flex flex-col items-center">
              <Link
                href={nav.link}
                className={`
                  flex items-center justify-center  text-xs sm:text-sm md:text-base transition-all duration-300 px-2 sm:px-3 md:px-4
                  ${
                    isActiveRoute(nav.link)
                      ? "text-vibrant_orange pb-0.5"
                      : "text-gray-300 hover:text-white"
                  }
                `}
              >
                <span className="pt-1.5 sm:pt-2 whitespace-nowrap">
                  {nav.name}
                </span>
              </Link>
              {isActiveRoute(nav.link) && (
                <span className="flex flex-col items-center">
                  <span className="w-8 h-0.25 bg-vibrant_orange z-20"/>
                  <span className="text-vibrant_orange text-sm sm:text-base leading-3">
                    •
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
        <Link href={"/contact-us"} className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full bg-vibrant_orange text-white text-xs sm:text-sm md:text-base hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap ml-1 sm:ml-2">
          Get Started
        </Link>
      </nav>
    </div>
  );
};

export default MainNavigation;
