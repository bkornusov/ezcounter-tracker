import "./initiative.css";
import React, { useState, useEffect } from "react";
import hp from "../../public/icons/hp.png";
import ac from "../../public/icons/ac.png";

export default function Creature(data, { updateInitiative }) {
  const creature = data.data;
  const [initiative, setInitiative] = useState(creature.initiative);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    if (e.target.value > 99) {
      setInitiative(99);
    } else {
      setInitiative(e.target.value);
    }
    updateInitiative();
  }

  return (
    <div className="creature-entry">
      {isEditing ? (
        <input
          className="stat-value-input"
          type="number"
          min="-99"
          max="99"
          autoFocus
          onChange={(e) => {
            handleChange(e);
          }}
          onBlur={() => {
            setIsEditing(false);
          }}
          value={initiative}
        />
      ) : (
        <span
          className="stat-value"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {initiative}
        </span>
      )}

      <span>{creature.name}</span>
      <span style={{ backgroundImage: `url(${hp})` }}>{creature.hp}</span>
      <span style={{ backgroundImage: `url(${ac})` }}>{creature.ac}</span>
    </div>
  );
}
