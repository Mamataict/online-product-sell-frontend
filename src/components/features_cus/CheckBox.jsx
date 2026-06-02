"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckBox({ checked, onChange }) {
    
    return (
        <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="
        cursor-pointer
        h-5 w-5
        rounded
        border
        border-gray-300
        bg-white
        checked:bg-blue-600
        checked:border-blue-600
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        transition
        duration-200
        ease-in-out
      "
    />
    );
}