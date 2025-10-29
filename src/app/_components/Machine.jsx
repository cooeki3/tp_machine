"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect } from "react";
import { GSDevTools } from "gsap/GSDevTools";

import "./Machine.css";

import Legende from "./Legende.jsx";
import Jeu from "./Jeu.jsx";
import Compteurs from "./Compteurs.jsx";
import Boutons from "./Boutons.jsx";

gsap.registerPlugin(useGSAP, GSDevTools);

const Machine = () => {
  const timelines = useRef([]);

  var objects = [
    { url: "png/machine_coin.png" },
    { url: "png/machine_star.png" },
    { url: "png/machine_galaxy.png" },
  ];

  var imgUrls = objects.map((image) => image.url);

  //State On/Off
  const [isOn, setIsOn] = useState(false);
  //State Mise initiale
  const [miseInitale, setMiseInitale] = useState(10);
  //State Balance restante
  const [balanceRestante, setBalanceRestante] = useState(500);
  //State Spin des symboles
  const [isSpinning, setIsSpinning] = useState(false);
  //State Trigger mise popup
  const [misePopupTrigger, setMisePopupTrigger] = useState(0);
  //State Mise popup montant
  const [misePopupMontant, setBetPopupMontant] = useState(0);
  //State Win popup montant
  const [winPopupMontant, setWinPopupMontant] = useState(0);
  //State Trigger win popup
  const [winPopupTrigger, setWinPopupTrigger] = useState(0);
  //State Mise max
  const [isMiseMax, setIsMaxBet] = useState(false);
  //State Animation balance négative
  const [balanceAnimating, setBalanceAnimating] = useState(false);

  useEffect(() => {
    //Animation du popup de la mise quand le joueur appuie sur jouer
    if (misePopupTrigger > 0) {
      setMisePopupTrigger(true);
      const timer = setTimeout(() => {
        setMisePopupTrigger(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    //Animation lorsque la mise est au MAX
    if (isMiseMax) {
      gsap.fromTo(
        ".mise-max",
        { scale: 0, opacity: 0 },
        { scale: 1.5, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [misePopupTrigger, isMiseMax]);

  const miseRef = useRef(10);

  //Logique mise
  const augmenterMise = () => {
    if (miseInitale < 100) setMiseInitale(miseInitale + 5);
    if (miseInitale < 100) {
      setMiseInitale(miseInitale + 5);
    } else {
      setIsMaxBet(true);
      setTimeout(() => setIsMaxBet(false), 1500);
    }
  };

  const diminuerMise = () => {
    if (miseInitale > 5) setMiseInitale(miseInitale - 5);
  };

  //Logique on/off
  const togglePower = () => {
    if (isOn) {
      setBalanceRestante(balanceRestante);
      setMiseInitale(10);
      setIsSpinning(false);
      setBetPopupMontant(0);
      setWinPopupMontant(0);
      miseRef.current = 10;
    }
    setIsOn(!isOn);
  };

  useGSAP(() => {
    const imgs = document.querySelectorAll(".object");
    timelines.current = [];

    imgs.forEach((img, i) => {
      const tl = gsap.timeline({
        repeat: 4,
        paused: true,
        onRepeat: () => {
          const randomUrl = gsap.utils.random(imgUrls);
          img.src = randomUrl;
        },
        onComplete: () => {
          if (i === 0) showResults();
        },
      });

      tl.set(img, {
        y: -420,
        opacity: 1,
      });

      tl.to(img, {
        y: 600,
        duration: 0.3,
        ease: "none",
        stagger: 0.1,
      });
      timelines.current.push(tl);
    });
  });

  function showResults() {
    const imgs = document.querySelectorAll(".object");
    timelines.current.forEach((tl) => tl.pause());
    gsap.set(imgs, {
      y: -420,
    });
    gsap.to(imgs, {
      y: 0,
      duration: 0.4,
      ease: "elastic.out(1,0.5)",
      stagger: 0.12,
      onComplete: () => {
        setIsSpinning(false);
      },
    });
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
    const multipliers = {
      coin: { 2: 1.25, 3: 2 },
      star: { 2: 1.5, 3: 5 },
      galaxy: { 2: 1.8, 3: 20 },
    };

    const winAmount = mise * multipliers[matchedSymbol][matchNumber];

    setWinPopupMontant(winAmount);
    setWinPopupTrigger((prev) => prev + 1);
    setBalanceRestante((prev) => prev + winAmount);
  }

  function playAll() {
    if (miseInitale > balanceRestante && !balanceAnimating) {
      const tl = gsap.timeline({
        yoyo: true,
        repeat: 3,
        onComplete: () => setBalanceAnimating(false),
      });

      tl.to(".balance", {
        color: "red",
        duration: 0.32,
      });

      return;
    }
    setIsSpinning(true);

    const betAmount = miseInitale;

    setBetPopupMontant(miseInitale);
    setMisePopupTrigger((prev) => prev + 1);
    setBalanceRestante((prev) => prev - betAmount);

    miseRef.current = miseInitale;

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
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1,0.5)",
        });

        timelines.current.forEach((tl) => tl.pause());
        setIsSpinning(false);
      }
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
        balanceRestante={balanceRestante}
        misePopupMontant={misePopupMontant}
        misePopupTrigger={misePopupTrigger}
        winPopupMontant={winPopupMontant}
        winPopupTrigger={winPopupTrigger}
        isMiseMax={isMiseMax}
      />
    </>
  );
};

export default Machine;
