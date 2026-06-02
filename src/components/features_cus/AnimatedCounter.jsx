"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AnimatedCounter({ to = 1600, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Only animate once when in view

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, to, duration]);

  return (
    <motion.span ref={ref}>
      {rounded}
    </motion.span>
  );
}
