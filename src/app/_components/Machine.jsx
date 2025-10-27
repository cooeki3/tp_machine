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
      // GSDevTools.create({ animation: tl });
    });
  });

  function playAll() {
    timelines.current.forEach((tl) => tl.play());
  }

  return (
    <>
      {/* Jai fait ca de meme juste pour la mise en pase, on fera des components apres uwu */}
      <div className="page-background"></div>
      <div className="logo-container">
        <img className="logo" src="/png/logo.png" alt="" />
      </div>

      {/* Espace légende */}
      <div className="legende-container"></div>

      {/* Espace jeu */}
      <div className="object-wrap">
        <div className="jeuCadre"></div>
        <div className="object-container">
          <img className="object object-1" src="/png/machine_coin.png" alt="" />
          <img className="object object-2" src="/png/machine_star.png" alt="" />
          <img
            className="object object-3"
            src="/png/machine_galaxy.png"
            alt=""
          />
        </div>
      </div>

      {/* Boutons jouer + ON */}
      <div className="boutons-container">
        <button className="boutons jouer" onClick={playAll}>
          Jouer
        </button>
        <button className="boutons allumer">ON / OFF</button>
      </div>

      {/* Boutons mise + balance */}
      <div className="compteurs-container">
        <div className="btn-mise">
          <button className="boutons-compteurs"></button>
          <p className="btn-mise-text">Mise: 200$</p>
          <button className="boutons-compteurs"></button>
        </div>
        <div className="balance">
          <p className="balance-text">Balance: 500000$</p>
        </div>
      </div>
    </>
  );
};

export default Machine;
