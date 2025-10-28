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
      <div className="btn-mise">
        <button className="boutons-compteurs" onClick={diminuerMise}></button>
        {isOn && <p className="btn-mise-text">Mise: {miseInitale}$</p>}
        <button className="boutons-compteurs" onClick={augmenterMise}></button>
      </div>

      <div className="balance">
        {isOn && <p className="balance-text">Balance: {balance}$</p>}
        {/* Pop up qui affiche si win ou lose et le montant */}
        {lastChange !== 0 && (
          <p className={`balance-change ${lastChange > 0 ? "win" : "lose"}`}>
            {lastChange > 0 ? "+" + lastChange : "" + lastChange}
          </p>
        )}
      </div>
    </div>
  );
};

export default Compteurs;
