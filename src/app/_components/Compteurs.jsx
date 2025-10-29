import "./Compteurs.css";
import { useState, useEffect } from "react";

const Compteurs = ({
  miseInitale,
  augmenterMise,
  diminuerMise,
  isOn,
  balance,
  currentBet,
  betPopupTrigger,
}) => {
  const [displayBetPopup, setDisplayBetPopup] = useState(false);

  useEffect(() => {
    if (betPopupTrigger > 0) {
      setDisplayBetPopup(true);
      const timer = setTimeout(() => {
        setDisplayBetPopup(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [betPopupTrigger]);

  return (
    <div className="compteurs-container">
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

          {displayBetPopup && <p className="bet-popup">-{currentBet}$</p>}
        </div>
      )}
    </div>
  );
};

export default Compteurs;
