import "./Clavier.css";

const Clavier = ({ isOn, afficherChiffre, confirmerMise, clavierRef }) => {
  return (
    <div className={"legende-container " + (isOn ? " brightness-in" : "")}>
      <img
        ref={clavierRef}
        className="legende-img"
        src="png/legende.png"
        alt=""
      />
      <h2 className="keypad-titre">Mise</h2>
      <div className="keypad">
        <div className="button_cont">
          <button className="btn-keypad" onClick={() => afficherChiffre(1)}>
            1
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(2)}>
            2
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(3)}>
            3
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(4)}>
            4
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(5)}>
            5
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(6)}>
            6
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(7)}>
            7
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(8)}>
            8
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(9)}>
            9
          </button>
          <button className="btn-keypad" onClick={confirmerMise}>
            #
          </button>
          <button className="btn-keypad" onClick={() => afficherChiffre(0)}>
            0
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clavier;
