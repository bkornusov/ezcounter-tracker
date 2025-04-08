import "./initiative.css";
import React, { useState, useEffect } from "react";
import hp from "/icons/hp.png?url";
import ac from "/icons/ac.png?url";

export default function Creature({ isActive, data, updateInitiative }) {
  const [initiative, setInitiative] = useState(data.initiative);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    if (e.target.value > 99) {
      setInitiative(99);
    } else if (e.target.value < -99) {
      setInitiative(-99);
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
        <div className="initiative-field">
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
        </div>
        <span className="creature-name">{data.name}</span>
        <div className="status-field">
          <div className="actions">
            <button className="action-button">A</button>
            <button className="bonus-action-button">BA</button>
            <button className="reaction-button">R</button>
          </div>
          <button className="concentration">C</button>
          <span style={{ backgroundImage: `url(${hp})` }}>{data.hp}</span>
          <span style={{ backgroundImage: `url(${ac})` }}>{data.ac}</span>
          <span>{data.speed}</span>
        </div>
      </div>
    );
  }

  return isActive ? (
    <div className="creature-active">{displayCreatureStats()}</div>
  ) : (
    <div className="creature-inactive">{displayCreatureStats()}</div>
  );
}
