"use client";

import { faqPageText } from "@/app/index/text_contents";
import Image from "next/image";
import React, { useState } from "react";

const FAQForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED"); // Debug

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (data.success) {
        alert("✅ Message sent successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("❌ Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center md:justify-between pt-8 md:pt-[20vh]">
      {/* Image */}
      <div className="hidden md:flex md:w-1/2 rounded-r-4xl overflow-hidden md:min-h-screen relative">
        <Image
          src={faqPageText.image}
          fill
          alt="FAQ Images"
          className="object-cover object-top"
        />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center">
          {faqPageText.heading}
        </h1>

        <p className="max-w-sm text-center mt-2 mb-6">
          {faqPageText.subHeading}
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-4"
        >
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="px-4 py-3 border rounded-full"
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="px-4 py-3 border rounded-full"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-3 border rounded-full"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="px-4 py-3 border rounded-full"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="px-4 py-3 border rounded-xl"
          />

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-full"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FAQForm;