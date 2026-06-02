"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TypingText({ text = "", typingSpeed = 40, deletingSpeed = 80, pauseTime = 5000 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (!isDeleting && index <= text.length) {
      // Typing effect
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, index));
        setIndex(index + 1);
      }, typingSpeed);
    } else if (isDeleting && index >= 0) {
      // Deleting effect
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, index));
        setIndex(index - 1);
      }, deletingSpeed);
    }

    // When typing finishes, pause then start deleting
    if (index === text.length + 1 && !isDeleting) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
        setIndex(index - 1);
      }, pauseTime);
    }

    // When deleting finishes, start typing again
    if (index === -1 && isDeleting) {
      setIsDeleting(false);
      setIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <div 
    
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        style={{ display: "inline-block" }}
      >
        |
      </motion.span>
    </div>
  );
}
