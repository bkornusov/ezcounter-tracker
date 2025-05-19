import React, { useState, useEffect } from "react";
import "./App.css";
import ReactSplit, { SplitDirection } from "@devbookhq/splitter";
import Initiative from "./Initiative/initiative";
import Sheet from "./Sheet/sheet";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import emptyEncounter from "./util/emptyEncounter.js";
import emptyCreature from "./util/emptyCreature.js";

function App() {
  const [encounter, setEncounter] = useState(emptyEncounter);
  // const [currentTurn, setCurrentTurn] = useState([0, null]);

  // document.onkeydown = function (e) {
  //   if (e.key === "F5") {
  //     return false;
  //   }
  // };

  // Update dependent states when `encounter` changes
  useEffect(() => {
    // const sortedCreatures = (encounter.creatures || []).sort(
    //   (a, b) => b.initiative - a.initiative
    // );
    // const initiatives = [
    //   ...new Set(encounter.creatures.map((creature) => creature.initiative)),
    // ];
    // setEncounter((prev) => ({
    //   ...prev,
    //   creatures: sortedCreatures,
    //   initiatives,
    // }));
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
        setEncounter({});
        setEncounter(JSON.parse(fileContent));
        encounter.initiatives.sort().reverse();
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

  const handleCreatureCreate = (creatureId) => {
    const maxId = encounter.creatures.length
      ? Math.max(...encounter.creatures.map((c) => c.id))
      : 0;
    const newId = maxId + 1;

    // Clone the creature or use emptyCreature
    let newCreature;
    if (creatureId) {
      const found = encounter.creatures.find(
        (creature) => creature.id === creatureId
      );
      newCreature = found ? { ...found } : { ...emptyCreature };
    } else {
      newCreature = { ...emptyCreature };
    }
    newCreature.id = newId;

    // Clone arrays before modifying
    const newCreatures = [...encounter.creatures, newCreature].sort(
      (a, b) => b.initiative - a.initiative
    );
    const newInitiatives = [...new Set(newCreatures.map((c) => c.initiative))];

    setEncounter((prev) => ({
      ...prev,
      creatures: newCreatures,
      initiatives: newInitiatives,
    }));

    console.log("New creature created: ", newCreature);
  };

  const handleCreatureUpdate = (updatedCreature) => {
    console.log("Updating creature: ", updatedCreature);
    // Update the creature in the list
    const updatedList = encounter.creatures.map((creature) =>
      creature.id === updatedCreature.id
        ? { ...creature, ...updatedCreature }
        : creature
    );

    // Sort the updated list by initiative
    const sortedList = updatedList.sort((a, b) => b.initiative - a.initiative);

    // Update the global state
    setEncounter((prev) => ({
      ...prev,
      creatures: sortedList,
    }));
    const newInitiatives = [...new Set(sortedList.map((c) => c.initiative))];

    setEncounter((prev) => ({
      ...prev,
      initiatives: newInitiatives,
    }));

    console.log("new initiatives: ", newInitiatives);
    console.log("Initiatives: ", encounter.initiatives);
  };

  const handleCreatureDelete = (id) => {
    // Delete the creature from the list

    // Sort the updated list by initiative
    const sortedList = encounter.creatures
      .filter((creature) => creature.id !== id)
      .sort((a, b) => b.initiative - a.initiative);

    const newInitiatives = sortedList.map((c) => c.initiative);
    // Update the global state
    setEncounter((prev) => ({
      ...prev,
      creatures: sortedList,
      initiatives: newInitiatives,
    }));
    // Update the current turn if necessary
    // if (currentTurn[1] === id) {
    //   setEncounter(...encounter, [0, sortedList[0]?.id || null]);
    // }
  };

  const resetCreatureActions = (initiative) => {
    setEncounter((prev) => ({
      ...prev,
      creatures: prev.creatures.map((creature) =>
        creature.initiative === initiative
          ? { ...creature, action: true, bonusAction: true }
          : creature
      ),
    }));
  };

  const resetCreatureReaction = (initiative) => {
    setEncounter((prev) => ({
      ...prev,
      creatures: prev.creatures.map((creature) =>
        creature.initiative === initiative
          ? { ...creature, reaction: true }
          : creature
      ),
    }));
  };

  const nextRound = () => {
    setEncounter((prev) => ({
      ...prev,
      round: prev.round ? prev.round + 1 : 1,
      turn: 0,
    }));
  };

  const nextTurn = () => {
    // Get the initiative of the creature whose turn is ending
    const endingInitiative = encounter.initiatives[encounter.turn];

    // Calculate the next turn index
    let nextTurnIndex = encounter.turn;
    if (nextTurnIndex < encounter.initiatives.length - 1) {
      nextTurnIndex += 1;
    } else {
      nextTurnIndex = 0;
      nextRound();
    }

    // Get the initiative of the creature whose turn is starting
    const startingInitiative = encounter.initiatives[nextTurnIndex];

    // 1. Reset actions for the creature whose turn just ended
    resetCreatureActions(endingInitiative);

    // 2. Update the turn index
    setEncounter((prev) => ({
      ...prev,
      turn: nextTurnIndex,
    }));

    // 3. Reset reaction for the creature whose turn is starting
    resetCreatureReaction(startingInitiative);

    console.log("Turn advanced to: ", nextTurnIndex);
  };

  return (
    <>
      <div className="header-menu">
        <h3>{encounter.name}</h3>
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <ReactSplit
        SplitDirection={SplitDirection.Horizontal}
        minWidths={[400, 400]}
        initialSizes={[40, 60]}
        gutterClassName="custom-gutter-horizontal"
        draggerClassName="custom-dragger-horizontal"
      >
        <Initiative
          encounter={encounter}
          updateCreature={handleCreatureUpdate}
          deleteCreature={handleCreatureDelete}
          createCreature={handleCreatureCreate}
          incrementTurn={nextTurn}
          incrementRound={nextRound}
        />
        <Sheet />
      </ReactSplit>
    </>
  );
}

export default App;

// <div className="vite-react">
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src={viteLogo} className="logo" alt="Vite logo" />
//     </a>
//     <a href="https://react.dev" target="_blank">
//       <img src={reactLogo} className="logo react" alt="React logo" />
//     </a>
//   </div>
//   <h1>Vite + React</h1>
//   <div className="card">
//     <button onClick={() => setCount((count) => count + 1)}>
//       count is {count}
//     </button>
//     <p>
//       Edit <code>src/App.jsx</code> and save to test HMR
//     </p>
//   </div>
//   <p className="read-the-docs">
//     Click on the Vite and React logos to learn more
//   </p>
// </div>;
