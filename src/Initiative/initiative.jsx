import React, { useEffect, useState } from "react";
// import encounter from "../../public/test/testEncounter.json";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative() {
  const [encounter, setEncounter] = useState({
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
  });

  const [creatureList, setCreatureList] = useState([]);
  const [currentTurn, setCurrentTurn] = useState([0, null]);
  const [round, setRound] = useState(1);

  // Update dependent states when `encounter` changes
  useEffect(() => {
    const sortedCreatures = (encounter.creatures || []).sort(
      (a, b) => b.initiative - a.initiative
    );
    setCreatureList(sortedCreatures);
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
        console.log(fileContent);
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

  const sortByInitiative = (a, b) => b.initiative - a.initiative;

  // const [creatureList, setCreatureList] = useState(
  //   encounter.creatures.sort(sortByInitiative)
  // );
  // const [currentTurn, setCurrentTurn] = useState([0, creatureList[0].id]);
  // const [round, setRound] = useState(1);

  // const handleInitiativeChange = (name, newInitiative) => {
  //   console.log("initiative changed");
  //   const updatedList = creatureList.map((creature) =>
  //     creature.name === name
  //       ? { ...creature, initiative: newInitiative }
  //       : creature
  //   );
  //   const sortedList = updatedList.sort(sortByInitiative);
  //   setCreatureList(sortedList);
  // };

  const handleCreatureUpdate = (updatedCreature) => {
    // Update the creature in the list
    const updatedList = creatureList.map((creature) =>
      creature.id === updatedCreature.id ? updatedCreature : creature
    );

    // Sort the updated list by initiative
    const sortedList = updatedList.sort((a, b) => b.initiative - a.initiative);

    // Update the global state
    setCreatureList(sortedList);
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

  const nextRound = () => {
    setRound(round + 1);
    setCurrentTurn([0, creatureList[0].id]);
  };

  const nextTurn = () => {
    if (currentTurn[0] === creatureList.length - 1) {
      nextRound();
      return;
    }
    setCurrentTurn([currentTurn[0] + 1, creatureList[currentTurn[0] + 1].id]);
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
          {creatureList.find((creature) => currentTurn[1] === creature.id)
            ?.name || ""}
        </span>
      </div>
      <button onClick={nextTurn}>Next</button>
      <button onClick={nextRound}>New Round</button>
      <div className="creature-list">
        {creatureList.map((creature) => {
          return (
            <Creature
              className="creature-active"
              data={creature}
              isActive={creature.id === currentTurn[1]}
              updateCreature={handleCreatureUpdate}
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
