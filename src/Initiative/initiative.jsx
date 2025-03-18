import React from "react";
import encounter from "../../public/test/testEncounter.json";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative() {
  let creatureList = encounter.creatures;

  function handleInitiativeChange() {
    console.log("initiative changed");
    creatureList.sort(sortByInitiative);
  }

  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <h2>{encounter.name}</h2>
      {creatureList.map((creature) => {
        return (
          <Creature
            data={creature}
            onChange={handleInitiativeChange}
            updateInitiative={handleInitiativeChange}
            key={creature.name}
          />
        );
      })}
    </div>
  );
}

const sortByInitiative = (a, b) => {
  return b.initiative - a.initiative;
};
