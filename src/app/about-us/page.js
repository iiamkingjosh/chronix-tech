import AboutUs from '@/components/page_components/about_us_page/AboutUs'
import AboutUsHero from '@/components/page_components/about_us_page/AboutUsHero'
import CoreValues from '@/components/page_components/about_us_page/CoreValues'
import OurStory from '@/components/page_components/about_us_page/OurStory'
import React from 'react'
import Script from "next/script";

// ✅ PAGE SEO
export const metadata = {
  title: "About Chronix Technology Limited",
  description:
    "Learn about Chronix Technology Limited, a leading IT infrastructure and cybersecurity company based in Lagos, Nigeria. Discover our mission, vision, and core values.",
};

export default function AboutPage() {
  return (
    <>
      {/* ✅ STRUCTURED DATA FOR GOOGLE */}
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Chronix Technology Limited",
            description:
              "Chronix Technology Limited is a Nigerian IT company specializing in cybersecurity, IT infrastructure, and enterprise technology solutions.",
            url: "https://chronixtechnology.com/about",
            mainEntity: {
              "@type": "Organization",
              name: "Chronix Technology Limited",
              url: "https://chronixtechnology.com",
              logo:
                "https://chronixtechnology.com/images/home_page/chronix-logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressCountry: "NG",
              },
            },
          }),
        }}
      />

      <div className='overflow-hidden'>
        <AboutUsHero/>
        <OurStory/>
        <CoreValues/>
        <AboutUs/>
      </div>
    </>
  )
}