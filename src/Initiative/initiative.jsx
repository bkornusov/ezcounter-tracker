import React, { useState, useEffect } from "react";
import Creature from "./creature";
import ContextMenu from "./contextMenu";
import "./initiative.css";
import { create } from "@tauri-apps/plugin-fs";

export default function Initiative({
  encounter,
  updateCreature,
  deleteCreature,
  createCreature,
  incrementTurn,
  incrementRound,
}) {
  const contextMenuRef = React.useRef(null);
  const [contextCreatureId, setContextCreatureId] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    isToggled: false,
    positionX: 0,
    positionY: 0,
  });

  function resetContextMenu() {
    setContextMenu({
      isToggled: false,
      positionX: 0,
      positionY: 0,
    });
  }

  useEffect(() => {}, [encounter, updateCreature, createCreature]);

  useEffect(() => {
    if (!contextMenu.isToggled) {
      return;
    }

    function handler(e) {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        resetContextMenu();
      }
    }

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [contextMenu.isToggled]);

  function handleOnContextMenu(e, data) {
    e.stopPropagation();
    e.preventDefault();
    console.log("Clicked on creatureId:", data.id);
    setContextCreatureId(data.id);
    // You can also use the event object to get the mouse position

    setContextMenu({
      isToggled: true,
      positionX: e.clientX + 10,
      positionY: e.clientY + 10,
    });
  }

  function handleCopy() {
    // Handle the copy action here
    // For example, you might want to copy the creature's data to the clipboard
    // You can call a function passed as a prop to copy the creature
    createCreature(contextCreatureId);
  }

  function handleDelete() {
    // Handle the delete action here
    // For example, you might want to remove this creature from the list
    // You can call a function passed as a prop to delete the creature
    deleteCreature(contextCreatureId);
  }

  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <div className="initiative-header">
        <span>
          Round: {encounter.round || 0} | Curr. Initiative:{" "}
          {encounter.initiatives[encounter.turn]}
        </span>
        <button onClick={incrementTurn}>Next Turn</button>
        <button onClick={incrementRound}>New Round</button>
      </div>

      <div className="creature-list">
        {encounter.creatures.map((creature) => {
          return (
            <Creature
              data={creature}
              isActive={
                creature.initiative === encounter.initiatives[encounter.turn]
              }
              updateCreature={updateCreature}
              deleteCreature={deleteCreature}
              contextMenu={handleOnContextMenu}
              key={
                creature.id +
                "-" +
                creature.action +
                "-" +
                creature.bonusAction +
                "-" +
                creature.reaction
              }
              {...creature}
            />
          );
        })}
      </div>
      {/* <div className="initiative-footer">
        <span>Footer</span>
        <button onClick={createCreature}>Add Creature</button>
      </div> */}
      <ContextMenu
        contextMenuRef={contextMenuRef}
        isToggled={contextMenu.isToggled}
        positionX={contextMenu.positionX}
        positionY={contextMenu.positionY}
        buttons={[
          {
            text: "Copy",
            icon: "📋",
            onClick: () => {
              handleCopy();
            },
          },
          {
            text: "Delete",
            icon: "🗑️",
            onClick: () => {
              handleDelete();
            },
          },
        ]}
      />
    </div>
  );
}
