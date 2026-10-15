"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";
import Image from "next/image";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="bg-[#0F6939] py-3 px-8 sm:px-[initial]">
        <div className="container m-auto text-white text-[14px] text-center sm:flex sm:justify-between justify-center items-center sm:items-start">
          <div className="pb-2 sm:pb-[initial] ">© {new Date().getFullYear()} <Link href="https://www.mamatabd.org" target="_blank" className="text-white hover:underline">Mamata</Link>, All right reserved.</div>
        </div>
      </div>
    </>
  );
};

export default Footer;
