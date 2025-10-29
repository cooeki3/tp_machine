import "./Compteurs.css";
import { useState, useEffect } from "react";

const Compteurs = ({
  miseInitale,
  augmenterMise,
  diminuerMise,
  isOn,
  balance,
  currentBet,
  betPopupAmount,
  betPopupTrigger,
  winPopupAmount,
  winPopupTrigger,
}) => {
  const [displayBetPopup, setDisplayBetPopup] = useState(false);
  const [displayWinPopup, setDisplayWinPopup] = useState(false);

  useEffect(() => {
    if (betPopupTrigger > 0) {
      setDisplayBetPopup(true);
      const timer = setTimeout(() => {
        setDisplayBetPopup(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [betPopupTrigger]);

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
        <div className="btn-mise fade-in">
          <button className="boutons-compteurs" onClick={diminuerMise}></button>
          <p className="btn-mise-text">Mise: {miseInitale}$</p>
          <button
            className="boutons-compteurs"
            onClick={augmenterMise}
          ></button>
        </div>
      )}

      {isOn && (
        <div className="balance fade-in">
          <p className="balance-text">Balance: {balance}$</p>

          {displayBetPopup && (
            <p className="bet-popup bet">-{betPopupAmount}$</p>
          )}

          {displayWinPopup && (
            <p className={"bet-popup win"}>
              {winPopupAmount > 0 && "+"}
              {winPopupAmount}$
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Compteurs;
