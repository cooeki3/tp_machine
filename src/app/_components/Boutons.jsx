import "./Boutons.css";

const Boutons = ({ playAll, togglePower, isOn }) => {
  return (
    <div className="boutons-container">
      {isOn && (
        <button className="boutons jouer" onClick={playAll}>
          Jouer
        </button>
      )}
      <button className="boutons allumer" onClick={togglePower}>
        {isOn ? "Éteindre" : "Allumer"}
      </button>
    </div>
  );
};

export default Boutons;
