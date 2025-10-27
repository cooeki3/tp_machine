"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { GSDevTools } from "gsap/GSDevTools";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useAudio } from "@/app/_contexts/AudioContext.jsx";

import useLenis from "../_hooks/useLenis.jsx";

// import Citation from "./Citation.jsx";
// import Header from "./Header.jsx";
// import LandingPage from "./LandingPage.jsx";
// import LightModeToggle from "./LightModeToggle.jsx";
// import CustomCursor from "./CustomCursor.jsx";

import "./Machine.css";
// import "./Header.css";
// import "./LandingPage.css";
// import "./LightModeToggle.css";
// import "./CustomCursor.css";
// import "./Fonts.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, GSDevTools, SplitText, CustomEase);

const Machine = () => {
  useLenis();
  const timelines = useRef([]);
  const imgUrls = [
    "png/machine_coin.png",
    "png/machine_star.png",
    "png/machine_galaxy.png",
  ];

  useGSAP(() => {
    const imgs = document.querySelectorAll(".object");
    timelines.current = [];

    imgs.forEach((img, i) => {
      const tl = gsap.timeline({
        repeat: -1,
        paused: true,
        onRepeat: () => {
          const randomUrl = gsap.utils.random(imgUrls);
          img.src = randomUrl;
        },
      });
      tl.set(img, { y: -290, duration: 0.5 });
      tl.to(img, { y: 600, delay: gsap.utils.random(0, 0.1) });
      timelines.current.push(tl);
      GSDevTools.create({ animation: tl });
    });
  });

  function playAll() {
    timelines.current.forEach((tl) => tl.play());
  }

  return (
    <div className="object-wrap">
      <div className="object-container">
        <img className="object object-1" src="png/machine_coin.png" alt="" />
        <img className="object object-2" src="png/machine_star.png" alt="" />
        <img className="object object-3" src="png/machine_galaxy.png" alt="" />
      </div>
      <button onClick={playAll}>Jouer</button>
    </div>
  );
};

export default Machine;
