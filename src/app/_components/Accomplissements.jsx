import "./Accomplissements.css";

const Accomplissements = ({ isOn }) => {
  return (
    <div
      className={"accomplissements-container " + (isOn ? " brightness-in" : "")}
    >
      <h2 className="accomplissements-titre">Accomplissements</h2>
      <img className="accomplissements-img" src="png/legende.png" alt="" />
    </div>
  );
};

export default Accomplissements;
