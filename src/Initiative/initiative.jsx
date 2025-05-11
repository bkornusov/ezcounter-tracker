import React, { useState } from "react";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative({
  encounter,
  updateCreature,
  deleteCreature,
  createCreature,
  incrementTurn,
  incrementRound,
}) {
  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <div className="header-menu"></div>
      <div>
        <span>
          Round: {encounter.round || 0} | Turn: {encounter.turn[0] || 0}
        </span>
      </div>
      <button onClick={incrementTurn}>Next</button>
      <button onClick={incrementRound}>New Round</button>
      <div className="creature-list">
        {encounter.creatures.map((creature) => {
          return (
            <Creature
              className="creature-active"
              data={creature}
              isActive={creature.initiative === encounter.turn}
              updateCreature={updateCreature}
              deleteCreature={deleteCreature}
              key={creature.name}
            />
          );
        })}
      </div>
      <div className="initiative-footer">
        <span>Footer</span>
        <button onClick={createCreature}>Add Creature</button>
      </div>
    </div>
  );
}
