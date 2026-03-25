import { useState, useRef } from "react";
import { ArrowDown } from "lucide-react";

const FAQItem = ({ text }) => {
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);

  return (
    <li
      onClick={() => setOpen((prev) => !prev)}
      className={`
        flex flex-col z-20 rounded-lg px-4 w-full
        max-w-[500px] bg-white text-black lg:max-w-[600px] shadow
        text-base sm:text-lg md:text-xl
        transition-shadow duration-300 hover:shadow-lg cursor-pointer relative
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between min-h-20 sm:h-24">
        <span className="py-3 sm:py-0 font-medium">{text.question}</span>

        <span className="ml-2 flex-shrink-0">
          <ArrowDown
            className={`
              w-5 h-5 sm:w-6 sm:h-6
              transition-transform duration-300 ease-in-out
              ${open ? "rotate-180" : "rotate-0"}
            `}
          />
        </span>
      </div>

      {/* Sliding answer */}
      <div
        ref={answerRef}
        style={{
          maxHeight: open
            ? `${answerRef.current?.scrollHeight ?? 500}px`
            : "0px",
        }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <p
          className={`
            pb-4 text-sm sm:text-base leading-relaxed
          `}
        >
          {text.answer}
        </p>
      </div>
    </li>
  );
};

export default FAQItem;
