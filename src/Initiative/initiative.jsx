import React, { useState } from "react";
import encounter from "../../public/test/testEncounter.json";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative() {
  const sortByInitiative = (a, b) => {
    return b.initiative - a.initiative;
  };
  const [creatureList, setCreatureList] = useState(
    encounter.creatures.sort(sortByInitiative)
  );
  const [currentTurn, setCurrentTurn] = useState(creatureList[0].name);
  const [round, setRound] = useState(1);

  const handleInitiativeChange = (name, newInitiative) => {
    console.log("initiative changed");
    const updatedList = creatureList.map((creature) =>
      creature.name === name
        ? { ...creature, initiative: newInitiative }
        : creature
    );
    const sortedList = updatedList.sort(sortByInitiative);
    setCreatureList(sortedList);
  };

  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <h2>{encounter.name}</h2>
      <div>
        <span>
          Round: {round} | Turn: {currentTurn}
        </span>
      </div>
      <button>Next</button>
      <button>New Round</button>
      {creatureList.map((creature) => {
        return (
          <Creature
            className="creature-active"
            data={creature}
            isActive={creature.name === currentTurn}
            updateInitiative={handleInitiativeChange}
            key={creature.name}
          />
        );
      })}
    </div>
  );
}
