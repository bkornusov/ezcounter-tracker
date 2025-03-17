import "./initiative.css";
import React, { useState, useEffect } from "react";

export default function Creature(creature) {
  const [initiative, setInitiative] = useState(creature.initiative);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="creature-entry">
      {isEditing ? (
        <input
          type="number"
          onChange={(e) => setInitiative(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
          }}
          value={initiative}
        />
      ) : (
        <h2
          onDoubleClick={() => {
            setIsEditing(true);
          }}
        >
          {initiative}
        </h2>
      )}

      <h2>{creature.name}</h2>
      <h2>HP: {creature.hp}</h2>
      <h2>AC: {creature.ac}</h2>
    </div>
  );
}
