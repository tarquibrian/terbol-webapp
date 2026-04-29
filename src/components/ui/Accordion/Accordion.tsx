"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: AccordionItemProps) {
  return (
    <div className="bg-primary-soft-gray-balance rounded-lg overflow-hidden flex flex-col">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-6 py-6 text-left focus:outline-none"
      >
        <span className="text-[18px] font-bold text-gray-900">{question}</span>
        <ChevronRight
          size={24}
          className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              {/* <div className="w-full h-px bg-gray-200 mb-6"></div> */}
              <p className="text-body-medium text-gray-500">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  items: { id: string; question: string; answer: string }[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openId === item.id}
          onClick={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
