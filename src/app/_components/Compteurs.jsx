import "./Compteurs.css";

const Compteurs = ({
  miseInitale,
  augmenterMise,
  diminuerMise,
  isOn,
  balance,
  lastChange,
}) => {
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
          {/* Pop up qui affiche si win ou lose et le montant */}
          {lastChange !== 0 && (
            <p className={`balance-change ${lastChange > 0 ? "win" : "lose"}`}>
              {lastChange > 0 ? "+" + lastChange + "$" : "" + lastChange + "$"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Compteurs;
