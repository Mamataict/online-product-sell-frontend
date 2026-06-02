"use client";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faMessage,
  faPhone,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useContext, useState } from "react";

const container = {
  hidden: {
    translateY: 50,
    opacity: 0,
  },
  show: {
    translateY: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemA = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemB = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const itemC = {
  hidden: { translateY: 25, opacity: 0 },
  show: { translateY: 0, opacity: 1 },
};

const FabButton = () => {
  const [isFabEnabled, setIsFabEnabled] = useState(false);

  const toggleFAB = useCallback(() => {
    setIsFabEnabled((prevState) => !prevState);
  }, []);

  return (
    // FAB button container
    <div className="bg-[#0F6939] z-999999 bg-primary h-16 w-16 rounded-full p-0.5 fixed bottom-5 right-5 flex items-center justify-center shadow-primary shadow-sm hover:shadow-md hover:shadow-primary cursor-pointer active:scale-95 transition-all ease-in">
      {/* <div
        onClick={toggleFAB}
        className={`select-none secondaryBorderThick rounded-full w-full h-full flex items-center justify-center transition-transform ease-in 
          
          ${
          isFabEnabled ? "rotate-[315deg]" : ""
        }
        `}
      > */}
      <div
        onClick={toggleFAB}
        className={`select-none secondaryBorderThick rounded-full w-full h-full flex items-center justify-center transition-transform ease-in 
          
        `}
      >
        {/* <svg
          className="floater__btn-icon floater__btn-icon-plus"
          width="18px"
          height="18px"
          viewBox="672 53 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
         
        </svg> */}

        <FontAwesomeIcon
          icon={isFabEnabled ? faXmark : faMessage}
          className={`text-white text-3xl transition-transform duration-200 ease-in ${isFabEnabled ? "rotate-[180deg]" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isFabEnabled && (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="absolute bottom-20 flex justify-between flex-col items-center gap-2"
          >
            <motion.li variants={itemA} className="h-14 w-14 rounded-full">
              <Link
                href="https://wa.me/8801896025050"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 48 48"
                  className="object-contain rounded-full"
                >
                  <circle cx="24" cy="24" r="24" fill="#25D366" />

                  <path
                    fill="#FFFFFF"
                    d="M24 12c-6.63 0-12 5.22-12 11.67
             0 2.05.55 4.04 1.59 5.8L12 36l6.77-1.76
             c1.61.85 3.41 1.3 5.23 1.3
             6.63 0 12-5.22 12-11.67S30.63 12 24 12z"
                  />

                  <path
                    fill="#25D366"
                    d="M29.35 27.43c-.29-.15-1.73-.84-2-.94
             -.27-.1-.47-.15-.67.15
             -.2.3-.77.94-.95 1.13
             -.17.2-.35.22-.64.08
             -1.72-.84-2.85-1.5-3.99-3.39
             -.3-.52.3-.48.87-1.61
             .1-.2.05-.37-.02-.52
             -.08-.15-.67-1.56-.92-2.14
             -.24-.57-.49-.49-.67-.5
             -.17-.01-.37-.01-.57-.01
             -.2 0-.52.08-.79.37
             -.27.3-1.04 1.01-1.04 2.46
             0 1.45 1.07 2.85 1.22 3.04
             .15.2 2.08 3.25 5.18 4.42
             1.95.74 2.71.8 3.68.64
             .59-.1 1.73-.71 1.97-1.39
             .25-.69.25-1.28.17-1.4
             -.07-.11-.27-.18-.56-.33z"
                  />
                </svg>
              </Link>
            </motion.li>

            <motion.li variants={itemB} className="h-14 w-14 rounded-full">
              <Link
                href="https://m.me/61590328600208"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 48 48"
                  className="object-contain rounded-full"
                >
                  <defs>
                    <linearGradient
                      id="messenger-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#00B2FF" />
                      <stop offset="100%" stopColor="#006AFF" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="24"
                    cy="24"
                    r="24"
                    fill="url(#messenger-gradient)"
                  />

                  <path
                    fill="#FFFFFF"
                    d="M24 11C16.82 11 11 16.41 11 23.09
             c0 3.81 1.89 7.21 4.84 9.43V37
             l4.42-2.43c1.18.33 2.43.52 3.74.52
             7.18 0 13-5.41 13-12.09S31.18 11 24 11z"
                  />

                  <path
                    fill="url(#messenger-gradient)"
                    d="M18.3 26.8
             l5.2-5.5
             l3.1 3.1
             l5.3-5.5
             l-5.9 7.8
             l-3.1-3.1
             l-4.6 3.2z"
                  />
                </svg>
              </Link>
            </motion.li>

            <motion.li variants={itemC} className="h-14 w-14 rounded-full">
              <Link
                href="tel:01896025050"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="object-contain rounded-full"
                >
                  <circle cx="24" cy="24" r="24" fill="#22C55E" />

                  <path
                    d="M32.6 28.4v2.8a1.8 1.8 0 0 1-2 1.8
             17.9 17.9 0 0 1-7.8-2.8
             17.7 17.7 0 0 1-5.4-5.4
             17.9 17.9 0 0 1-2.8-7.8
             1.8 1.8 0 0 1 1.8-2h2.8
             a1.8 1.8 0 0 1 1.8 1.5
             c.1.8.3 1.5.6 2.2
             a1.8 1.8 0 0 1-.4 1.9l-1.2 1.2
             a14.4 14.4 0 0 0 5.2 5.2
             l1.2-1.2
             a1.8 1.8 0 0 1 1.9-.4
             c.7.3 1.4.5 2.2.6
             a1.8 1.8 0 0 1 1.5 1.8z"
                    fill="white"
                  />
                </svg>
              </Link>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FabButton;
