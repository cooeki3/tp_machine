import "./Accomplissements.css";

const Accomplissements = ({ isOn }) => {
  return (
    <div
      className={"accomplissements-container " + (isOn ? " brightness-in" : "")}
    >
      <h2 className="accomplissements-titre">Accomplissements</h2>
      <img className="accomplissements-img" src="png/legende.png" alt="" />
      <div className="recompenses">
        <img className="" src="png/recompense-mauve.png" alt="" />
        <img className="" src="png/recompense-bleu.png" alt="" />
        <img className="" src="png/recompense-vert.png" alt="" />
      </div>
    </div>
  );
};

export default Accomplissements;
