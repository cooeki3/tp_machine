"use client";

import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { useEffect } from "react";
import "./Levier.css";

const Levier = ({ playAll, isOn, levierRef }) => {
  useEffect(() => {
    Draggable.create(".levier", {
      type: "rotation",
      bounds: {
        minRotation: 20,
        maxRotation: 130,
      },
      onDrag: function () {
        if (this.rotation == 130) {
          playAll();
        }
      },
      onDragEnd: function () {
        gsap.to(".levier", {
          rotation: 20,
          duration: 0.7,
          ease: "power2.out",
        });
      },
    });
  });

  return (
    <div ref={levierRef} className={"levier-container levier" + (isOn ? " brightness-in" : "")}>
    </div>
  );
};

export default Levier;
