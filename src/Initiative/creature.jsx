import "./initiative.css";
import React, { useState, useEffect, act } from "react";
import hp from "/icons/hp.png?url";
import ac from "/icons/ac.png?url";

export default function Creature({
  isActive,
  data,
  updateCreature,
  deleteCreature,
}) {
  const [initiative, setInitiative] = useState(data.initiative);
  const [action, setAction] = useState(data.action);
  const [bonusAction, setBonusAction] = useState(data.bonusAction);
  const [reaction, setReaction] = useState(data.reaction);
  const [concentration, setConcentration] = useState(data.concentration);
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    // Handle the delete action here
    // For example, you might want to remove this creature from the list
    // You can call a function passed as a prop to delete the creature
    deleteCreature(data.id);
  }

  function handleChange(e) {
    if (e.target.value > 99) {
      setInitiative(99);
    } else if (e.target.value < -99) {
      setInitiative(-99);
    } else {
      setInitiative(e.target.value);
    }
    setInitiative(e.target.value);
    updateCreature({ ...data, initiative: e.target.value });
  }

  function handleBlur() {
    setIsEditing(false);
    handleChange(data.name, initiative);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      setIsEditing(false);
      handleChange(data.name, initiative);
    }
  }

  function handleToggleAction(buttonClass) {
    let jsonEntry = "";
    if (buttonClass === "action-button") {
      jsonEntry = "action";
      setAction(!action);
    } else if (buttonClass === "bonus-action-button") {
      jsonEntry = "bonusAction";
      setBonusAction(!bonusAction);
    } else if (buttonClass === "reaction-button") {
      jsonEntry = "reaction";
      setReaction(!reaction);
    } else if (buttonClass === "concentration") {
      jsonEntry = "concentration";
      setConcentration(!concentration);
    }
    let updatedCreature = { ...data, [jsonEntry]: !data[jsonEntry] };
    updateCreature(updatedCreature);
  }

  function renderButton(buttonClass, active) {
    return active ? (
      <button
        className={`${buttonClass} active-button`}
        onClick={() => {
          handleToggleAction(buttonClass);
        }}
      >
        {buttonClass.slice(0, 1).toUpperCase()}
      </button>
    ) : (
      <button
        className={buttonClass}
        onClick={() => {
          handleToggleAction(buttonClass);
        }}
      >
        {buttonClass.slice(0, 1).toUpperCase()}
      </button>
    );
  }

  function displayCreatureStats() {
    return (
      <div className="creature-entry">
        <div className="delete-button">
          <button className="delete" onClick={handleDelete}>
            X
          </button>
        </div>
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
            {renderButton("action-button", action)}
            {renderButton("bonus-action-button", bonusAction)}
            {renderButton("reaction-button", reaction)}
          </div>
          {renderButton("concentration", concentration)}
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
