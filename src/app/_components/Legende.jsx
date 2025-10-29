import "./Legende.css";

const Legende = ({ isOn }) => {
  return (
    <div className={"legende-container " + (isOn ? " brightness-in" : "")}>
      {isOn && (
        <div className="legende-content fade-in">
          <h1 className="titre-legende">Multiplicateurs</h1>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_coin.png" />
            <img className="legende-symbols" src="/png/machine_coin.png" />{" "}
            <p>= 1.25x</p>
          </div>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_coin.png" />
            <img className="legende-symbols" src="/png/machine_coin.png" />
            <img className="legende-symbols" src="/png/machine_coin.png" />
            <p> = 2x</p>
          </div>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_star.png" />
            <img className="legende-symbols" src="/png/machine_star.png" />
            <p> = 1.5x</p>
          </div>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_star.png" />
            <img className="legende-symbols" src="/png/machine_star.png" />
            <img className="legende-symbols" src="/png/machine_star.png" />
            <p> = 5x</p>
          </div>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_galaxy.png" />
            <img className="legende-symbols" src="/png/machine_galaxy.png" />
            <p> = 1.8x</p>
          </div>
          <div className="legende-multipliers">
            <img className="legende-symbols" src="/png/machine_galaxy.png" />
            <img className="legende-symbols" src="/png/machine_galaxy.png" />
            <img className="legende-symbols" src="/png/machine_galaxy.png" />
            <p> = 20x</p>
            <p className="jackpot"> JACKPOT</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legende;
