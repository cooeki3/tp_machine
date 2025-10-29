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

  var objects = [
    { url: "png/machine_coin.png" },
    { url: "png/machine_star.png" },
    { url: "png/machine_galaxy.png" },
  ];

  var imgUrls = objects.map((image) => image.url);

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
  //state current mise
  const [mise, setMise] = useState(10);
  const miseRef = useRef(10);

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

    imgs.forEach((img, i) => {
      const tl = gsap.timeline({
        repeat: 3,
        paused: true,
        onRepeat: () => {
          const randomUrl = gsap.utils.random(imgUrls);
          img.src = randomUrl;
        },
        onComplete: () => {
          if (i === 1) showResults();
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
    const imgs = document.querySelectorAll(".object");
    gsap.set(imgs, { y: -420 });
    gsap.to(imgs, {
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.5)",
      stagger: 0.12,
    });

    setIsSpinning(false);

    calculateResults();
  }

  function calculateResults() {
    const imgs = document.querySelectorAll(".object");
    const img1 = imgs[0].src;
    const img2 = imgs[1].src;
    const img3 = imgs[2].src;

    const getSymbol = (img) => {
      switch (true) {
        case img.includes("machine_coin.png"):
          return "coin";
        case img.includes("machine_star.png"):
          return "star";
        default:
          return "galaxy";
      }
    };

    const [symbol1, symbol2, symbol3] = [img1, img2, img3].map(getSymbol);

    if (symbol1 === symbol2 && symbol2 === symbol3) {
      calculateMatch(3, symbol1, miseRef.current);
    } else if (
      symbol1 === symbol2 ||
      symbol2 === symbol3 ||
      symbol3 === symbol1
    ) {
      const matchedSymbol =
        symbol1 === symbol2 ? symbol1 : symbol2 === symbol3 ? symbol2 : symbol1;
      calculateMatch(2, matchedSymbol, miseRef.current);
    }
  }

  function calculateMatch(matchNumber, matchedSymbol, mise) {
    console.log("MISE: " + mise);

    const multipliers = {
      coin: { 2: 1.25, 3: 5 },
      star: { 2: 2, 3: 8 },
      galaxy: { 2: 5, 3: 20 },
    };

    const winAmount = mise * multipliers[matchedSymbol][matchNumber];
    console.log("WIN AMOUNT: " + winAmount);
  }

  function playAll() {
    if (!isOn || isSpinning) return;
    setIsSpinning(true);

    miseRef.current = miseInitale;
    setMise(miseInitale);
    setBalance((prev) => prev - miseInitale);
    setLastChange(-miseInitale);
    timelines.current.forEach((tl) => tl.restart());
  }

  useGSAP(
    () => {
      const imgs = document.querySelectorAll(".object");
      if (!isOn) {
        timelines.current.forEach((tl) => tl.pause());
        gsap.set(imgs, { y: -450, overwrite: "auto" });
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

      <Jeu isOn={isOn} />

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
