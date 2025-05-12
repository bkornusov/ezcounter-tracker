import "./creature.css";
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

  function creatureContextMenu(e) {
    e.preventDefault();
    console.log("Right-clicked on creature:", data.name);
    // You can also use the event object to get the mouse position
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    console.log("Mouse position:", mouseX, mouseY);
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
        <div className="initiative-name-field">
          <div className="initiative">
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
        </div>
        <div className="actions">
          {renderButton("action-button", action)}
          {renderButton("bonus-action-button", bonusAction)}
          {renderButton("reaction-button", reaction)}
        </div>
        <div className="status-field">
          {renderButton("concentration", concentration)}
          <span
            style={{
              backgroundImage: `url(https://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png)`,
            }}
          >
            {data.hp}
          </span>
          <span
            style={{
              backgroundImage: `url(https://cdn-icons-png.flaticon.com/512/361/361798.png)`,
            }}
          >
            {data.ac}
          </span>
          <span
            style={{
              backgroundImage: `url(https://cdn0.iconfinder.com/data/icons/st-patrick-s-day-solic/24/Leprechaun-Shoes-s-512.png)`,
            }}
          >
            {data.speed}
          </span>
        </div>
        <button
          className="context-menu-button"
          onClick={creatureContextMenu}
        ></button>
      </div>
    );
  }

  return isActive ? (
    <div className="creature-active">{displayCreatureStats()}</div>
  ) : (
    <div className="creature-inactive">{displayCreatureStats()}</div>
  );
}
