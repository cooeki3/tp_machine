const Compteurs = ({ miseInitale, augmenterMise, diminuerMise, isOn }) => {
  return (
    <div className="compteurs-container">
      <div className="btn-mise">
        <button className="boutons-compteurs" onClick={diminuerMise}></button>
        {isOn && <p className="btn-mise-text">Mise: {miseInitale}$</p>}
        <button className="boutons-compteurs" onClick={augmenterMise}></button>
      </div>
      <div className="balance">
        {isOn && <p className="balance-text">Balance: 500000$</p>}
      </div>
    </div>
  );
};

export default Compteurs;
