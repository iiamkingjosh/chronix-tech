import AboutHero from "@/components/page_components/services_page/ServicesHero";
import Offers from "@/components/page_components/services_page/Offers";
import Services from "@/components/page_components/services_page/Services";
import React from "react";

const page = () => {
  return (
    <div>
      <AboutHero />
      <Offers />
      <Services/>
    </div>
  );
};

export default page;
