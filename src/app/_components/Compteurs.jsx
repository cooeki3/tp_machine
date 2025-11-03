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
  btnBalanceRef,
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
    <div className={"compteurs-container " + (isOn ? " brightness-in" : "")}
      style={{ opacity: isOn ? 1 : 0 }}>
      <div
        className="btn-mise"
        ref={btnMiseRef}
      >
        <p className="btn-mise-text" >
          Mise: {miseSaisie ? miseSaisie : miseInitale}$
        </p>
      </div>

      <div
        className="btn-balance"
        ref={btnBalanceRef}
      >
        <p className="btn-balance-text">Balance: {balanceRestante}$</p>

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
    </div>
  );
};

export default Compteurs;