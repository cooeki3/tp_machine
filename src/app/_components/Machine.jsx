"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/app/_contexts/AudioContext";
import { Draggable } from "gsap/all";

import "./Machine.css";

import Jeu from "./Jeu.jsx";
import Compteurs from "./Compteurs.jsx";
import Boutons from "./Boutons.jsx";
import Clavier from "./Clavier.jsx";
import Levier from "./Levier.jsx";
import Accomplissements from "./Accomplissements.jsx";

gsap.registerPlugin(useGSAP, Draggable);

const Machine = () => {
  const timelines = useRef([]);
  const tlLevier = useRef();
  const miseInitiale = 5;
  const balanceInitiale = 100;

  const btnBalanceRef = useRef();
  const btnMiseRef = useRef();
  const cadreRef = useRef();
  const clavierRef = useRef();
  const levierRef = useRef();
  const logoRef = useRef();
  const backgroundRef = useRef();
  const gaugeFillRef = useRef();

  var objects = [
    { url: "png/machine_coin.png" },
    { url: "png/machine_star.png" },
    { url: "png/machine_galaxy.png" },
  ];

  var imgUrls = objects.map((image) => image.url);

  const [isOn, setIsOn] = useState(false);
  const [miseInitale, setMiseInitale] = useState(miseInitiale);
  const [miseSaisie, setmiseSaisie] = useState("5");
  const [balanceRestante, setBalanceRestante] = useState(balanceInitiale);
  const [isSpinning, setIsSpinning] = useState(false);
  const [misePopupTrigger, setMisePopupTrigger] = useState(0);
  const [misePopupMontant, setBetPopupMontant] = useState(0);
  const [winPopupMontant, setWinPopupMontant] = useState(0);
  const [winPopupTrigger, setWinPopupTrigger] = useState(0);
  const [balanceAnimating, setBalanceAnimating] = useState(false);
  const { changeSource, play } = useAudio(false);

  useEffect(() => {
    if (misePopupTrigger > 0) {
      setMisePopupTrigger(true);
      const timer = setTimeout(() => {
        setMisePopupTrigger(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [misePopupTrigger]);

  const miseRef = useRef(miseSaisie);

  const afficherChiffre = (chiffre) => {
    if (!isOn || isSpinning) return;
    let fieldValue = miseSaisie + chiffre;
    if (fieldValue.length === 3) {
      fieldValue = fieldValue.substring(1);
    }
    setmiseSaisie(fieldValue);
  };

  const togglePower = () => {
    if (isOn) {
      setBalanceRestante(balanceInitiale);
      setmiseSaisie("5");
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

    const getSymbol = (img) =>
      img.includes("machine_coin.png") ? "coin" :
        img.includes("machine_star.png") ? "star" :
          "galaxy";

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

    if (
      (miseSaisie > balanceRestante && !balanceAnimating) ||
      Number(miseSaisie) === 0
    ) {
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

    if (isSpinning) return;

    setIsSpinning(true);
    setBetPopupMontant(miseSaisie);
    timelines.current.forEach((tl) => tl.restart());
    setMisePopupTrigger((prev) => prev + 1);
    setBalanceRestante((prev) => prev - miseSaisie);
    miseRef.current = miseSaisie;
  }

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
      gsap.to(".levier-container", {
        scale: 1,
        duration: 0.3,
      });
    } else if (isOn && !isSpinning) {
      tlLevier.current = gsap.timeline({ repeat: -1, yoyo: true });
      tlLevier.current.to(".levier-container", {
        duration: 0.6,
        ease: "power1.inOut",
        scale: 1.08
      });
    } else {
      gsap.to(".jouer", {
        filter: "brightness(2)",
        ease: "none",
        duration: 0,
      });
    }
  }, [isSpinning, isOn]);

  var couleurDefault = [
    [btnBalanceRef, "btnBalance.png"],
    [btnMiseRef, "btnMise.png"],
    [cadreRef, "jeuCadre.png"],
    [clavierRef, "keypad.png"],
    [levierRef, "levier.png"],
    [logoRef, "logo.png"],
    [backgroundRef, "pageBackground.png"],
  ];

  useEffect(() => {
    const percentage = (balanceRestante / 1000) * 100;

    gsap.to(gaugeFillRef.current, {
      width: percentage + "%",
      duration: 0.5,
      ease: "power2.out"
    });

    if (balanceRestante >= 250) {
      gsap.to(".recompense1", {
        filter: "brightness(1)",
        pointerEvents: "auto"
      })
    }
    if (balanceRestante >= 500) {
      gsap.to(".recompense2", {
        filter: "brightness(1)",
        pointerEvents: "auto"
      })
    }
    if (balanceRestante >= 1000) {
      gsap.to(".recompense3", {
        filter: "brightness(1)",
        pointerEvents: "auto"
      })
    }
  }, [balanceRestante]);

  function changerCouleur(couleur) {
    var prefix = "/png/" + couleur + "/" + couleur + "-";
    couleurDefault.map((i) => {
      var ref = i[0];
      var path = i[1];
      if (ref && ref.current) {
        ref.current.style.backgroundImage = "url(" + prefix + path + ")";
      }
    });
  }



  return (
    <>
      <div ref={backgroundRef} className="page-background"></div>

      <div className="logo-container" ref={logoRef}>
      </div>

      <Jeu isOn={isOn} cadreRef={cadreRef} />

      <Boutons playAll={playAll} togglePower={togglePower} isOn={isOn} />

      <Accomplissements isOn={isOn} gaugeFillRef={gaugeFillRef} changerCouleur={changerCouleur} />

      <Clavier
        isOn={isOn}
        afficherChiffre={afficherChiffre}
        clavierRef={clavierRef}
      />

      <Compteurs
        isOn={isOn}
        miseSaisie={miseSaisie}
        balanceRestante={balanceRestante}
        misePopupMontant={misePopupMontant}
        misePopupTrigger={misePopupTrigger}
        winPopupMontant={winPopupMontant}
        winPopupTrigger={winPopupTrigger}
        btnBalanceRef={btnBalanceRef}
        btnMiseRef={btnMiseRef}
      />

      <Levier isOn={isOn} playAll={playAll} levierRef={levierRef} />
    </>
  );
};

export default Machine;
