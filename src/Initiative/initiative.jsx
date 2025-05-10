import React, { useState } from "react";
// import encounter from "../../public/test/testEncounter.json";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative(encounter) {
  const [currentTurn, setCurrentTurn] = useState([0, null]);
  const [round, setRound] = useState(1);

  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <div className="header-menu">
        <h2>{encounter.name}</h2>
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
        <span>
          Round: {round || 0} | Turn:{" "}
          {encounter.creatures.find(
            (creature) => currentTurn[1] === creature.id
          )?.name || ""}
        </span>
      </div>
      <button onClick={nextTurn}>Next</button>
      <button onClick={nextRound}>New Round</button>
      <div className="creature-list">
        {encounter.creatures.map((creature) => {
          return (
            <Creature
              className="creature-active"
              data={creature}
              isActive={creature.id === currentTurn[1]}
              updateCreature={handleCreatureUpdate}
              deleteCreature={handleCreatureDelete}
              key={creature.name}
            />
          );
        })}
      </div>
      <div className="initiative-footer">
        <span>Footer</span>
      </div>
    </div>
  );
}
