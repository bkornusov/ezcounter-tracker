import React from "react";
import encounter from "../../public/test/testEncounter.json";
import Creature from "./creature";

export default function Initiative() {
  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <h1>{encounter.name}</h1>
      {encounter.creatures
        .sort(sortByInitiative)
        .map((creature) => Creature(creature))}
    </div>
  );
}

const sortByInitiative = (a, b) => {
  return b.initiative - a.initiative;
};
