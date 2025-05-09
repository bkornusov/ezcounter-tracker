import React, { useEffect, useState } from "react";
// import encounter from "../../public/test/testEncounter.json";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative() {
  const emptyEncounter = {
    name: "",
    date: "",
    round: 0,
    turn: 0,
    creatures: [
      {
        id: "0",
        name: "",
        initiative: 0,
        hp: 0,
        ac: 0,
        speed: 0,
        action: true,
        bonusAction: true,
        reaction: false,
        concentration: false,
      },
    ],
  };
  const [encounter, setEncounter] = useState(emptyEncounter);
  const [currentTurn, setCurrentTurn] = useState([0, null]);
  const [round, setRound] = useState(1);

  // Update dependent states when `encounter` changes
  useEffect(() => {
    const sortedCreatures = (encounter.creatures || []).sort(
      (a, b) => b.initiative - a.initiative
    );
    // setEncounter({ ...encounter, creatures: sortedCreatures });
    setCurrentTurn([0, sortedCreatures[0]?.id || null]);
    setRound(encounter.round || 1);
  }, [encounter]);

  const handleOpen = async () => {
    try {
      // Open a file selection dialog
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Text",
            extensions: ["json"],
          },
        ],
      });

      if (selected) {
        // Read the file content using our Rust command
        const fileContent = await invoke("open_file", {
          path: selected,
        });
        setEncounter(emptyEncounter);
        setEncounter(JSON.parse(fileContent));
        console.log(encounter);
        console.log("File opened successfully!");
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Open a file selection dialog
      const selected = await save({
        defaultPath: "encounter.json",
        filters: [
          {
            name: "json",
            extensions: ["json"],
          },
        ],
      });

      if (selected) {
        // Write the file content using our Rust command
        await invoke("save_file", {
          path: selected,
          content: JSON.stringify(encounter, null, 2),
        });
        console.log("File saved successfully!");
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const handleCreatureUpdate = (updatedCreature) => {
    // Update the creature in the list
    const updatedList = encounter.creatures.map((creature) =>
      creature.id === updatedCreature.id ? updatedCreature : creature
    );

    // Sort the updated list by initiative
    const sortedList = updatedList.sort((a, b) => b.initiative - a.initiative);

    // Update the global state
    setEncounter((prev) => ({
      ...prev,
      creatures: sortedList,
    }));
    // Update the current turn if necessary
    if (currentTurn[1] === updatedCreature.id) {
      setCurrentTurn([0, sortedList[0].id]);
    }
    // Update the round if necessary
    if (currentTurn[0] >= sortedList.length) {
      setRound((prev) => prev + 1);
      setCurrentTurn([0, sortedList[0].id]);
    }
  };

  const handleCreatureDelete = (id) => {
    // Delete the creature from the list
    const updatedList = encounter.creatures.filter(
      (creature) => creature.id !== id
    );

    // Sort the updated list by initiative
    const sortedList = updatedList.sort((a, b) => b.initiative - a.initiative);

    // Update the global state
    setEncounter((prev) => ({
      ...prev,
      creatures: sortedList,
    }));
    // Update the current turn if necessary
    if (currentTurn[1] === id) {
      setCurrentTurn([0, sortedList[0]?.id || null]);
    }
  };

  const nextRound = () => {
    setRound(round + 1);
    setCurrentTurn([0, encounter.creatures[0].id]);
  };

  const nextTurn = () => {
    if (currentTurn[0] === encounter.creatures.length - 1) {
      nextRound();
      return;
    }
    setCurrentTurn([
      currentTurn[0] + 1,
      encounter.creatures[currentTurn[0] + 1].id,
    ]);
  };

  return (
    <div className="initiative-panel" style={{ background: "beige" }}>
      <div className="header-menu">
        <h2>{encounter.name}</h2>
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
        <span>
          Round: {round || 0} | Turn:{" "}
          {encounter.creatures.find(
            (creature) => currentTurn[1] === creature.id
          )?.name || ""}
        </span>
      </div>
      <button onClick={nextTurn}>Next</button>
      <button onClick={nextRound}>New Round</button>
      <div className="creature-list">
        {encounter.creatures.map((creature) => {
          return (
            <Creature
              className="creature-active"
              data={creature}
              isActive={creature.id === currentTurn[1]}
              updateCreature={handleCreatureUpdate}
              deleteCreature={handleCreatureDelete}
              key={creature.name}
            />
          );
        })}
      </div>
      <div className="initiative-footer">
        <span>Footer</span>
      </div>
    </div>
  );
}
