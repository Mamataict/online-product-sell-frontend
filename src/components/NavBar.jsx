"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";



const menu = [
  {
    label: "Who we are",
    key: "who_we_are",
    children: [
      {
        label: "Health Population and Nutrition",
        key: "health_population_nutration",
        children: [],
      },
    ],
  },
  {
    label: "What we do",
    key: "what_we_do",
    children: [
      {
        label: "Health Population and Nutrition",
        key: "health_population_nutration",
        children: [
          {
            label: "ESB+",
            key: "esb",
            children: [],
          },
          {
            label: "TB Control",
            key: "tb_control",
            children: [],
          },
        ],
      },
      {
        label: "Poverty Alleviation",
        key: "poverty_alleviation",
        children: [
          {
            label: "ESB+",
            key: "esb",
            children: [],
          },
          {
            label: "TB Control",
            key: "tb_control",
            children: [],
          },
        ],
      },
    ],
  },
  {
    label: "News & events",
    key: "news_events",
    children: [
      {
        label: "Health Population and Nutrition",
        key: "health_population_nutration",
        children: [],
      },
    ],
  },
  {
    label: "Publications",
    key: "publications",
    children: [
      {
        label: "Health Population and Nutrition",
        key: "health_population_nutration",
        children: [],
      },
    ],
  },
  {
    label: "Gallery",
    key: "gallery",
    children: [],
  },
  {
    label: "Contact",
    key: "contact",
    children: [],
  },
  {
    label: "Career",
    key: "career",
    children: [],
  },
];
const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);

  const toggle = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = (key) =>
    setActiveDropdown((prev) => (prev === key ? null : key));
  const toggleSubDropdown = (key) =>
    setActiveSubDropdown((prev) => (prev === key ? null : key));

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0F6939] w-full py-2 px-3 sm:px-4 lg:px-[initial]">
        <div className="container m-auto flex items-center justify-between">
          <div className="text-white">Since 1983</div>
          <div className="flex gap-4">
            <FontAwesomeIcon icon={faFacebookF} color="white" />
            <FontAwesomeIcon icon={faTwitter} color="white" />
            <FontAwesomeIcon icon={faInstagram} color="white" />
            <FontAwesomeIcon icon={faYoutube} color="white" />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div
        className={`w-full sticky top-0 z-[99999]
          transition-all duration-500 ease-out main-nav shadow-m px-3 sm:px-4 lg:px-[initial]
          ${scrolled ? "py-1" : "py-4"}`}
      >
        <div className="container m-auto flex items-center justify-between h-full w-full">
          {/* Logo */}

          <Image
            src="https://mamatabd.org/images/logo.png"
            alt="Mamata BD"
            width={70}
            height={70}
            className="transition-transform duration-500"
          />

          {/* Desktop Menu */}
          <ul className="lg:flex gap-1 hidden">
            {menu.map(({ label, key, children }) => (
              <li key={key} className="relative group text-[17px]  text-wrap">
                <button
                  className=" cursor-pointer p-2 flex gap-1"
                  onMouseEnter={() => setHoveredMenu(key)}
                  onMouseLeave={() => setHoveredMenu(null)}
                  disabled={children.length === 0}
                >
                  <div>{label}</div>
                  {children.length > 0 && (
                    <span className="transition-transform duration-500">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`transition-transform duration-500 ${
                          hoveredMenu === key ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  )}
                </button>

                {children.length > 0 && (
                  <ul
                    className="absolute rounded left-0 mt-0 w-40  bg-white text-black shadow-2xl px-2
                      opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto z-[9999999]"
                  >
                    {children.map((child, i) => (
                      <li
                        key={i}
                        className="py-[8px] text-[14px] hover:text-[#0F6939] border-b border-b-[#e5f3e7ee] cursor-pointer"
                        onMouseEnter={() => setHoveredMenu(child.key)}
                        onMouseLeave={() => setHoveredMenu(null)}
                      >
                        <div className="flex">
                          <div className="w-[90%]">{child.label}</div>

                          {child.children.length > 0 && (
                            <div className="w-[10%] flex justify-center items-center relative">
                              <span className="transition-transform duration-500 ">
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className={`transition-transform duration-500 ${
                                    hoveredMenu === child.key ? "rotate-90" : ""
                                  }`}
                                />
                              </span>

                              <ul
                                onMouseEnter={() => setHoveredMenu(child.key)}
                                onMouseLeave={() => setHoveredMenu(null)}
                                className={`absolute rounded left-[-20px] top-[32px] mt-0 w-40 bg-white text-black shadow-2xl px-2
      opacity-0 translate-y-[-10px]
      ${
        hoveredMenu === child.key
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
      transition-all duration-500 z-[9999999]`}
                              >
                                {child.children.map((subChild, i) => (
                                  <li
                                    key={i}
                                    className="py-[8px] text-[14px] hover:text-[#0F6939] border-b border-b-[#e5f3e7ee] cursor-pointer"
                                  >
                                    {subChild.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <div className="lg:hidden py-2">
            <button
              onClick={toggle}
              className="relative z-50 flex flex-col justify-between w-8 h-6 cursor-pointer"
            >
          
              {/* Menu would be here */}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="left-0 w-full absolute  lg:hidden bg-white shadow-xl z-[999999] overflow-y-auto border-t-[#917373] py-8 px-4 sm:px-5 lg:px-[initial] sidebar-scroll">
          <div className="flex flex-col gap-2 text-sm container m-auto ">
            {menu.map((item) => (
              <li key={item.key} className="flex flex-col  ">
                <button
                  className="flex justify-between items-center py-1 text-[20px] text-left"
                  onClick={() => toggleDropdown(item.key)}
                >
                  <span>{item.label}</span>

                  {item.children.length > 0 && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`transition-transform duration-300 ${
                        activeDropdown === item.key ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {item.children.length > 0 && (
                  <ul
                    className={`overflow-hidden transition-all duration-500 ease-in-out
    ${activeDropdown === item.key ? "h-auto opacity-100 py-3" : "max-h-0 opacity-0"}
  `}
                  >
                    {item.children.map((sub, i) => (
                      <li
                        key={i}
                        className="py-1 pl-4 last:border-none hover:text-[#0F6939] text-[18px] cursor-pointer"
                      >
                        <div
                          className="flex"
                          onClick={() => toggleSubDropdown(sub.key)}
                        >
                          <div className="w-[90%]">{sub.label}</div>
                          <div className="w-[10%] flex justify-center items-center">
                            {sub.children.length > 0 && (
                              <FontAwesomeIcon
                                icon={faChevronRight}
                                className={`transition-transform duration-300 ${
                                  activeSubDropdown === sub.key
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            )}
                          </div>
                        </div>

                        <ul
                          className={`overflow-hidden transition-all duration-500 ease-in-out 
    ${
      activeSubDropdown === sub.key
        ? "h-auto opacity-100 py-3"
        : "max-h-0 opacity-0"
    }
  `}
                        >
                          {sub.children.map((subItem, i) => (
                            <li
                              key={i}
                              className="py-2 pl-4 last:border-none hover:text-[#0F6939] cursor-pointer"
                            >
                              <div className="flex">
                                <div className="w-[90%]">{subItem.label}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
