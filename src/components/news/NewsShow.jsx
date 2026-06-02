'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const animationVariants = {
  0: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  1: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  2: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  3: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

export default function NewsShow({ item, animationType = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const variants = animationVariants[animationType] || animationVariants[0];

  return (
     <motion.div
      ref={ref}
      initial={variants.initial}
      animate={inView ? variants.animate : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container hover:shadow-lg rounded overflow-hidden transition-shadow duration-300 relative"
    >
      <Image
        src={item.img}
        alt={item.title}
        width={300}
        height={200}
        className="w-full h-[250px] object-cover"
      />
      <div className="py-4 px-3">
        <div className=" text-[18px] line-clamp-2">
          {item.title}
        </div>
        <div className="py-2 text-[14px] text-gray-600">{item.date}</div>
      </div>
      <div className="absolute bottom-1 right-2">
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-[#0F6939] rotate-[320deg] text-2xl p-2 rounded-full bg-[#eeeeee]"
        />
      </div>
    </motion.div>
  );
}
