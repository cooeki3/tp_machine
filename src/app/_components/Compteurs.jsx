import { useState, useEffect } from "react";

import "./Compteurs.css";

const Compteurs = ({
  isOn,
  balanceRestante,
  misePopupMontant,
  misePopupTrigger,
  winPopupMontant,
  winPopupTrigger,
  miseSaisie,
  balanceRef,
  btnMiseRef,
}) => {
  const [displayBetPopup, setDisplayBetPopup] = useState(false);
  const [displayWinPopup, setDisplayWinPopup] = useState(false);
  const miseInitale = 0;

  useEffect(() => {
    if (misePopupTrigger > 0) {
      setDisplayBetPopup(true);
      const timer = setTimeout(() => {
        setDisplayBetPopup(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [misePopupTrigger]);

  useEffect(() => {
    if (winPopupTrigger > 0) {
      setDisplayWinPopup(true);
      const timer = setTimeout(() => {
        setDisplayWinPopup(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [winPopupTrigger]);

  return (
    <div className={"compteurs-container " + (isOn ? " brightness-in" : "")}>
      {isOn && (
        <div className="btn-mise fade-in" ref={btnMiseRef}>
          <p className="btn-mise-text">
            {" "}
            Mise: {miseSaisie ? miseSaisie : miseInitale}$
          </p>
        </div>
      )}

      {isOn && (
        <div ref={balanceRef} className="balance fade-in">
          <p className="balance-text">Balance: {balanceRestante}$</p>

          {displayBetPopup && (
            <p className="bet-popup bet">-{misePopupMontant}$</p>
          )}

          {displayWinPopup && (
            <p className={"bet-popup win"}>
              {winPopupMontant > 0 && "+"}
              {winPopupMontant}$
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Compteurs;
