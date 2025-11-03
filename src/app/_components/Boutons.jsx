import "./Boutons.css";

const Boutons = ({ togglePower, isOn }) => {
  return (
    <div className="boutons-container">
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
