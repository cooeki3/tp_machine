import "./Boutons.css";

const Boutons = ({ playAll, togglePower, isOn }) => {
  return (
    <div className="boutons-container">
      {/* {isOn && (
        <button className="boutons jouer on fade-in" onClick={playAll}>
          Jouer
        </button>
      )} */}
      <button
        className={"boutons allumer" + (isOn ? " on" : "")}
        onClick={togglePower}
      >
        {isOn ? "Éteindre" : "Allumer"}
      </button>
    </div>
  );
};

export default Boutons;
