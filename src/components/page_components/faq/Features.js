import { Building2Icon, Mail, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

const Features = () => {
  const features = [
    {
      title: "Email Support",
      text: "our teams are ready to respond",
      icon: <Mail size={16} />,
    },
    {
      title: "FAQ",
      text: "What would you like to know?",
      icon: <Building2Icon size={16} />,
    },
    {
      title: "Email Support",
      text: "availble during workinghours",
      icon: <Phone size={16} />,
    },
  ];
  return (
    <div className="w-full h-auto flex flex-col gap-y-6 my-8 min-h-[60dvh] relative">
      <div className="absolute bottom-0 right-0 -z-10">
        <Image
          src={"/images/faq/vecteezy_blue-dots-world-map_13079258 (4).png"}
          alt="Loggo Image"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-1/2 translate-y-[87%] -z-0">
        <Image
          src={"/images/faq/vecteezy_blue-dots-world-map_13079258 (5).png"}
          alt="Loggo Image"
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex px-6 md:px-12 flex-col gap-y-4 items-start justify-around">
        <p className="px-3 py-1 rounded-full bg-gray-500 text-white">
          Service Team
        </p>
        <h1 className="text-4xl font-bold font-orbitron">
          We are waiting to hear from you
        </h1>
        <p>or reach out manually on info@chronixtech.com</p>
      </div>
      <div className="w-full bg-vibrant_orange h-auto py-4 flex flex-wrap justify-center gap-6 px-6 md:px-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start text-center p-6  rounded-lg min-w-[250px] flex-1"
          >
            <div className="flex items-center justify-center bg-white  rounded-full mb-3 w-8 h-8 text-black">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-white/80">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
