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

  var symbols = [
    { key: "coin", url: "png/machine_coin.png" },
    { key: "star", url: "png/machine_star.png" },
    { key: "galaxy", url: "png/machine_galaxy.png" },
  ];

  var imgUrls = symbols.map((image) => image.url);

  //State Bet
  const [miseInitale, setMiseInitale] = useState(10);
  //State On/Off
  const [isOn, setIsOn] = useState(false);
  //State Balance
  const [balance, setBalance] = useState(500);
  //State Dernier changement (balance)
  const [lastChange, setLastChange] = useState(0);
  //State lors que ca spin
  const [isSpinning, setIsSpinning] = useState(false);

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
        repeat: 3,
        paused: true,
        onRepeat: () => {
          const randomUrl = gsap.utils.random(imgUrls);
          img.src = randomUrl;
        },
        onComplete: () => {
          showResults();
        },
      });

      tl.set(img, {
        y: -420,
      });

      tl.to(img, {
        y: 600,
        duration: 0.35,
        ease: "none",
        stagger: 0.1,
      });
      timelines.current.push(tl);
    });
  });

  function showResults() {
    const img = document.querySelectorAll(".object");
    gsap.set(img, { y: -420 });
    gsap.to(img, {
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.5)",
      stagger: 0.12,
    });

    setIsSpinning(false);
    console.log("is spining false");
  }

  function playAll() {
    if (!isOn || isSpinning) return;
    setIsSpinning(true);

    setBalance((prev) => prev - miseInitale);
    setLastChange(-miseInitale);
    timelines.current.forEach((tl) => tl.restart());
  }

  useGSAP(
    () => {
      const imgs = document.querySelectorAll(".object");
      if (!isOn) {
        timelines.current.forEach((tl) => tl.pause());
        gsap.to(imgs, { y: -450, duration: 0.2, overwrite: "auto" });
      } else {
        gsap.to(imgs, {
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1,0.5)",
        });

        timelines.current.forEach((tl) => tl.pause());
        setIsSpinning(false);
      }
      setTimeout(() => {
        setLastChange(0);
      }, 1000);
    },
    { dependencies: [isOn] }
  );

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
