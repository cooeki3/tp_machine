const Boutons = ({ playAll, togglePower, isOn }) => {
  return (
    <div className="boutons-container">
      <button className="boutons jouer" onClick={playAll}>
        Jouer
      </button>
      <button className="boutons allumer" onClick={togglePower}>
        {isOn ? "OFF" : "ON"}
      </button>
    </div>
  );
};

export default Boutons;
