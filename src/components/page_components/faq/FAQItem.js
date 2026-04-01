import { useRef } from "react";
import { ArrowDown } from "lucide-react";

const FAQItem = ({ text, isOpen, onToggle }) => {
  const answerRef = useRef(null);

  return (
    <li
      onClick={onToggle}
      className={`
        flex flex-col z-20 rounded-lg px-4 w-full
        max-w-125 lg:max-w-150 bg-white text-black
        text-base sm:text-lg md:text-xl
        cursor-pointer relative
        transition-all duration-300 ease-in-out
        ${isOpen
          ? "shadow-[0_8px_24px_rgba(0,0,0,0.18)] -translate-y-0.5"
          : "shadow-[0_4px_10px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
        }
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between min-h-20 sm:h-24">
        <span className="py-3 sm:py-0 font-medium">{text.question}</span>

        <span className="ml-2 shrink-0">
          <ArrowDown
            className={`
              w-5 h-5 sm:w-6 sm:h-6
              transition-transform duration-300 ease-in-out
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          />
        </span>
      </div>

      {/* Sliding answer */}
      <div
        ref={answerRef}
        style={{
          maxHeight: isOpen
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
