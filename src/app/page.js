import About from "@/components/page_components/home_page/About";
import Advantages from "@/components/page_components/home_page/Advantages";
import CompanyLogos from "@/components/page_components/home_page/CompanyLogos";
import FAQ from "@/components/page_components/home_page/FAQ";
import Hero from "@/components/page_components/home_page/Hero";
import Services from "@/components/page_components/home_page/Services";
import React from "react";
import Script from "next/script";

// ✅ PAGE-LEVEL SEO
export const metadata = {
  title: "Chronix Tech",
  description:
    "Chronix Technology Limited is a leading IT company in Lagos, Nigeria offering cybersecurity, IT infrastructure, cloud solutions, and enterprise technology services.",
};

export default function HomePage() {
  return (
    <>
      {/* ✅ STRUCTURED DATA (UPDATED WITH SOCIAL LINKS) */}
      <Script
        id="chronix-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Chronix Technology Limited",
            url: "https://chronixtechnology.com",
            logo:
              "https://chronixtechnology.com/images/home_page/chronix-logo.png",
            description:
              "IT infrastructure, cybersecurity, and enterprise technology services in Lagos, Nigeria.",

            // ✅ THIS IS WHAT WAS MISSING
            sameAs: [
              "https://x.com/chronixtech",
              "https://facebook.com/chronixtech",
              "https://instagram.com/chronixtech_",
              "https://www.linkedin.com/in/chronixtech",
              "https://tiktok.com/chronixtech",
              "https://threads.com/chronixtech_",
            ],

            address: {
              "@type": "PostalAddress",
              addressCountry: "NG",
              addressLocality: "Lagos",
            },

            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              areaServed: "NG",
            },
          }),
        }}
      />

      <div>
        <Hero />
        <CompanyLogos />
        <Services />
        <About />
        <Advantages />
        <FAQ />
      </div>
    </>
  );
}