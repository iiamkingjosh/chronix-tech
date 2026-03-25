"use client";

import { navigations } from "@/app/index/text_contents";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import {
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaThreads,
  FaXTwitter,
} from "react-icons/fa6";

const MainFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // handle subscription logic
    console.log("Subscribed:", email);
    setEmail("");
  };

  // Mapped social media array with links
  const socialMedia = [
    {
      Icon: FaXTwitter,
      label: "X (Twitter)",
      url: "https://x.com/chronixtech",
    },
    {
      Icon: FaFacebook,
      label: "Facebook",
      url: "https://facebook.com/chronixtech",
    },
    {
      Icon: FaInstagram,
      label: "Instagram",
      url: "https://instagram.com/chronixtech_",
    },
    {
      Icon: FaLinkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/chronixtech",
    },
    { Icon: FaTiktok, label: "TikTok", url: "https://tiktok.com/chronixtech" },
    {
      Icon: FaThreads,
      label: "Threads",
      url: "https://threads.com/chronixtech_",
    },
  ];

  return (
    <footer className="card-tertiary w-full px-6 pt-12 pb-4 md:px-16 flex flex-col gap-y-10">
      {/* Top section */}
      <div className="flex flex-col gap-y-10 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex flex-col items-center gap-y-1">
          <div className="w-24 h-24 relative">
            <Image
              fill
              src={"/images/home_page/chronix/reverse chronix logo 1.png"}
              alt="Chronix logo"
              className="object-contain"
            />
          </div>
          <span className="text-xl font-orbitron font-bold">Chronix</span>
          <span className="text-3xl mt-5 font-nebbulla font-bold">
            Innovation Beyond Time
          </span>
        </div>

        {/* Quick Links */}
        <nav aria-label="Quick links">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-y-2">
            {navigations.slice(1).map((nav, i) => (
              <li key={i}>
                <Link
                  href={nav.link}
                  className="hover:underline underline-offset-4 transition-colors duration-200 hover:opacity-70"
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter & Social */}
        <div className="flex flex-col gap-y-6 max-w-sm">
          {/* Newsletter */}
          <div className="flex flex-col gap-y-3">
            <p className="text-sm leading-relaxed opacity-80">
              Subscribe to stay tuned for new web design and latest updates.
              Let&apos;s do it!
            </p>
            <div className="flex items-center gap-x-2">
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 min-w-0 px-4 py-2 rounded-md border border-white/20 bg-white/10 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
              />
              <button
                onClick={handleSubscribe}
                className="font-orbitron btn btn-lg btn-white shrink-0 px-4 py-2 text-sm"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
              Follow Us
            </p>
            <div className="flex items-center gap-x-4">
              {socialMedia.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-xl hover:scale-110 hover:opacity-70 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider + Bottom bar */}
      <div className="flex flex-col gap-y-2">
        <div className="h-px bg-white/20 w-full" />
        <p className="text-xs opacity-60 text-center leading-none">
          &copy; 2026 Chronix. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default MainFooter;
