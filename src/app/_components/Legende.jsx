const Legende = ({ isOn }) => {
  return (
    <div className="legende-container">
      {isOn && (
        <div className="legende-content">
          <h1 className="titre-legende">Légende</h1>
          <p>allo</p>
          <p>allo</p>
          <p>allo</p>
        </div>
      )}
    </div>
  );
};

export default Legende;
