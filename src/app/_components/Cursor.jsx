//Pour changer le curseur uwu!

"use client";
import { useEffect } from "react";

import "./Cursor.css";

export default function CursorProvider({ children }) {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const moveCursor = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      {children}
      <div id="cursor"></div>
    </>
  );
}
