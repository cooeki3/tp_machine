"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/app/_contexts/AudioContext";
import { Draggable } from "gsap/all";

import "./Machine.css";

import Legende from "./Clavier.jsx";
import Jeu from "./Jeu.jsx";
import Compteurs from "./Compteurs.jsx";
import Boutons from "./Boutons.jsx";
import Clavier from "./Clavier.jsx";
import Levier from "./Levier.jsx";

gsap.registerPlugin(useGSAP, Draggable);

const Machine = () => {
  const timelines = useRef([]);
  const tlLevier = useRef();
  const initialBet = 0;
  const initialBalance = 500;

  var objects = [
    { url: "png/machine_coin.png" },
    { url: "png/machine_star.png" },
    { url: "png/machine_galaxy.png" },
  ];

  var imgUrls = objects.map((image) => image.url);

  //State Bet
  const [miseInitale, setMiseInitale] = useState(initialBet);
  //State On/Off
  const [isOn, setIsOn] = useState(false);
  //Input mise
  const [typedBet, setTypedBet] = useState("");
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
  const [isMiseMax, setIsMiseMax] = useState(false);
  //State Animation balance négative
  const [balanceAnimating, setBalanceAnimating] = useState(false);
  const { changeSource, play } = useAudio(false);

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

  const afficherChiffre = (chiffre) => {
    if (!isOn || isSpinning) return;
    let fieldValue = typedBet + chiffre;
    
    // fieldValue = fieldValue.substring(1);
    if (fieldValue > 100) return;
    setTypedBet(fieldValue);

  };

  //Logique on/off
  const togglePower = () => {
    if (isOn) {
      setBalanceRestante(initialBalance);
      setMiseInitale(initialBet);
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
    const tl = gsap.timeline();
    tl.call(() => {
      changeSource("/Audio/casino.mp3", true);
    });

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
    if (!isOn) return;

    // Determine the bet amount
    let betAmount = typedBet ? Number(typedBet) : miseInitale;

    // Clamp between 5 and 100
    betAmount = Math.min(Math.max(betAmount, 5), 100);

    // Update state for new typed bet
    if (typedBet) {
      setMiseInitale(betAmount);
      setTypedBet("");
    }

    // Not enough balance?
    if (betAmount > balanceRestante && !balanceAnimating) {
      setBalanceAnimating(true);
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

    // Prevent new spins if already spinning
    if (isSpinning) return;

    // Start the spin
    setIsSpinning(true);
    setBetPopupMontant(betAmount);
    timelines.current.forEach((tl) => tl.restart());
    setMisePopupTrigger((prev) => prev + 1);
    setBalanceRestante((prev) => prev - betAmount);
    miseRef.current = betAmount;
  }

  //Reset objets
  useGSAP(
    () => {
      const imgs = document.querySelectorAll(".object");
      if (!isOn) {
        timelines.current.forEach((tl) => tl.pause());
        gsap.set(imgs, { y: -450, overwrite: "auto" });
        setIsSpinning(false);
      } else {
        gsap.to(imgs, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1,0.5)",
          onComplete: () => {
            setIsSpinning(false);
          },
        });
        timelines.current.forEach((tl) => tl.pause());
      }
    },
    { dependencies: [isOn] }
  );

  //Bouton Jouer brightness
  useGSAP(() => {
    if (tlLevier.current) {
      tlLevier.current.kill();
    }
    if (isSpinning) {
      gsap.to(".jouer", {
        filter: "brightness(0.8)",
        ease: "none",
        duration: 0,
      });
      gsap.to(".levier", {
        filter: "none",
        duration: 0.3,
      });
    } else if (isOn && !isSpinning) {
      tlLevier.current = gsap.timeline({ repeat: -1, yoyo: true });
      tlLevier.current.to(".levier", {
        duration: 0.6,
        filter:
          "drop-shadow(2px 2px 15px #ffcc00) drop-shadow(2px 2px 20px #ffbb00)",
      });
    } else {
      gsap.to(".jouer", {
        filter: "brightness(2)",
        ease: "none",
        duration: 0,
      });
    }
  }, [isSpinning, isOn]);

  return (
    <>
      <div className="page-background"></div>

      <div className="logo-container">
        <img className="logo" src="/png/logo.png" alt="Logo" />
      </div>

      <Jeu isOn={isOn} />

      <Boutons playAll={playAll} togglePower={togglePower} isOn={isOn} />

      <Clavier isOn={isOn} afficherChiffre={afficherChiffre} />

      <Compteurs
        isOn={isOn}
        miseInitale={miseInitale}
        // augmenterMise={augmenterMise}
        // diminuerMise={diminuerMise}
        typedBet={typedBet}
        balanceRestante={balanceRestante}
        misePopupMontant={misePopupMontant}
        misePopupTrigger={misePopupTrigger}
        winPopupMontant={winPopupMontant}
        winPopupTrigger={winPopupTrigger}
        isMiseMax={isMiseMax}
      />

      <Levier isOn={isOn} playAll={playAll} />
    </>
  );
};

export default Machine;
