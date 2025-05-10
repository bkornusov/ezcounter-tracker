import "./sheet.css";

export default function Sheet() {
  return (
    <div className="sheet-panel" style={{ background: "#7CB9E8" }}>
      <h2>Sheet Panel</h2>
      <div className="sheet-content">
        <div className="sheet-header">
          <h3>Character Name</h3>
          <h4>Class and Level</h4>
        </div>
        <div className="sheet-body">
          <div className="sheet-statistics">
            <div className="statistic">Strength</div>
            <div className="statistic">Dexterity</div>
            <div className="statistic">Constitution</div>
            <div className="statistic">Intelligence</div>
            <div className="statistic">Wisdom</div>
            <div className="statistic">Charisma</div>
          </div>
        </div>
      </div>
    </div>
  );
}
