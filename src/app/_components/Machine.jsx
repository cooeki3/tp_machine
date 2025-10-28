"use client";
import { useState, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { GSDevTools } from "gsap/GSDevTools";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import useLenis from "../_hooks/useLenis.jsx";
import "./Machine.css";

import Legende from "./Legende.jsx";
import Jeu from "./Jeu.jsx";
import Compteurs from "./Compteurs.jsx";
import Boutons from "./Boutons.jsx";

gsap.registerPlugin(useGSAP, ScrollTrigger, GSDevTools, SplitText, CustomEase);

const Machine = () => {
  useLenis();
  const timelines = useRef([]);

  const imgUrls = [
    "png/machine_coin.png",
    "png/machine_star.png",
    "png/machine_galaxy.png",
  ];

  //State Bet
  const [miseInitale, setMiseInitale] = useState(10);
  //State On/Off
  const [isOn, setIsOn] = useState(false);
  //State Balance
  const [balance, setBalance] = useState(500);
  //State Dernier changement (balance)
  const [lastChange, setLastChange] = useState(0);

  //Logique bet
  const augmenterMise = () => {
    if (miseInitale < 100) setMiseInitale(miseInitale + 5);
  };

  const diminuerMise = () => {
    if (miseInitale > 5) setMiseInitale(miseInitale - 5);
  };

  //Logique on/off
  const togglePower = () => {
    setIsOn(!isOn);
  };

  useGSAP(() => {
    const imgs = document.querySelectorAll(".object");
    timelines.current = [];

    imgs.forEach((img) => {
      const tl = gsap.timeline({
        repeat: -1,
        paused: true,
        onRepeat: () => {
          const randomUrl = gsap.utils.random(imgUrls);
          img.src = randomUrl;
        },
      });

      tl.set(img, { y: -420 });
      tl.to(img, { y: 600, duration: 0.35, ease: "none" });
      timelines.current.push(tl);
    });
  });

  function playAll() {
    if (!isOn) return;

    setBalance((prev) => prev - miseInitale);
    setLastChange(-miseInitale);

    timelines.current.forEach((tl) => tl.play());

    setTimeout(() => {
      setLastChange(0);
    }, 1000);
  }

  return (
    <>
      <div className="page-background"></div>

      <div className="logo-container">
        <img className="logo" src="/png/logo.png" alt="Logo" />
      </div>

      <Legende isOn={isOn} />

      <Jeu />

      <Boutons playAll={playAll} togglePower={togglePower} isOn={isOn} />

      <Compteurs
        isOn={isOn}
        miseInitale={miseInitale}
        augmenterMise={augmenterMise}
        diminuerMise={diminuerMise}
        balance={balance}
        lastChange={lastChange}
      />
    </>
  );
};

export default Machine;
