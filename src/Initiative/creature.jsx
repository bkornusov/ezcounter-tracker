import "./initiative.css";
import React, { useState, useEffect } from "react";
import hp from "../../public/icons/hp.png";
import ac from "../../public/icons/ac.png";

export default function Creature({ isActive, data, updateInitiative }) {
  const [initiative, setInitiative] = useState(data.initiative);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    if (e.target.value > 99) {
      setInitiative(99);
    } else {
      setInitiative(e.target.value);
    }
  }

  function handleBlur() {
    setIsEditing(false);
    updateInitiative(data.name, initiative);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      setIsEditing(false);
      updateInitiative(data.name, initiative);
    }
  }

  function displayCreatureStats() {
    return (
      <div className="creature-entry">
        {isEditing ? (
          <input
            className="stat-value-input"
            type="number"
            min="-99"
            max="99"
            autoFocus
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyPress(e)}
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

        <span className="creature-name">{data.name}</span>
        <span style={{ backgroundImage: `url(${hp})` }}>{data.hp}</span>
        <span style={{ backgroundImage: `url(${ac})` }}>{data.ac}</span>
      </div>
    );
  }

  return isActive ? (
    <div className="creature-active">{displayCreatureStats()}</div>
  ) : (
    <div className="creature-inactive">{displayCreatureStats()}</div>
  );
}
