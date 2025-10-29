import "./Jeu.css";

const Jeu = ({ isOn }) => {
  return (
    <div className="object-wrap">
      <div className={"jeuCadre" + (isOn ? " brightness-in" : "")}></div>
      <div className={"object-container" + (isOn ? " brightness-in" : "")}>
        <img className="object object-1" src="/png/machine_coin.png" alt="" />
        <img className="object object-2" src="/png/machine_star.png" alt="" />
        <img className="object object-3" src="/png/machine_galaxy.png" alt="" />
      </div>
    </div>
  );
};

export default Jeu;
