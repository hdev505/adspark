"use client";
import { motion, Variants } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  delay?: number;
  per?: "word" | "char"; // animate by word or character
  className?: string;
};

export default function AnimatedText({
  text,
  delay = 0,
  per = "word",
  className = "",
}: AnimatedTextProps) {
  const items = per === "char" ? text.split("") : text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block whitespace-pre"
        >
          {item}
          {per === "word" ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
