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
  const [round, setRound] = useState(1);

  // document.onkeydown = function (e) {
  //   if (e.key === "F5") {
  //     return false;
  //   }
  // };

  // Update dependent states when `encounter` changes
  useEffect(() => {
    const sortedCreatures = (encounter.creatures || []).sort(
      (a, b) => b.initiative - a.initiative
    );
    const initiatives = [
      ...new Set(encounter.creatures.map((creature) => creature.initiative)),
    ];
    // setEncounter((prev) => ({
    //   ...prev,
    //   creatures: sortedCreatures,
    //   initiatives,
    // }));
    // setEncounter({ ...encounter, creatures: sortedCreatures });
    // setEncounter({
    //   ...encounter,
    //   creatures: sortedCreatures,
    //   initiatives,
    //   turn: initiatives[0],
    // });
    // setRound(encounter.round || 1);
  }, [encounter]);

  const sortedCreatures = (creatures) => {
    return (encounter.creatures || []).sort(
      (a, b) => b.initiative - a.initiative
    );
  };

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
      setEncounter(...encounter, [0, sortedList[0].id]);
    }
    // Update the round if necessary
    if (currentTurn[0] >= sortedList.length) {
      setRound((prev) => prev + 1);
      setEncounter(...encounter, [0, sortedList[0].id]);
    }
  };

  const handleCreatureDelete = (id) => {
    // Delete the creature from the list

    // Sort the updated list by initiative
    const sortedList = encounter.creatures
      .filter((creature) => creature.id !== id)
      .sort((a, b) => b.initiative - a.initiative);
    // const newInitiatives = encounter.initiatives.filter(
    //   (initiative) => initiative !== id
    // );

    // Update the global state
    setEncounter((prev) => ({
      ...prev,
      creatures: sortedList,
    }));
    // Update the current turn if necessary
    // if (currentTurn[1] === id) {
    //   setEncounter(...encounter, [0, sortedList[0]?.id || null]);
    // }
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
    const newCreatures = [...encounter.creatures, newCreature];
    const newInitiatives = encounter.initiatives.includes(
      newCreature.initiative
    )
      ? [...encounter.initiatives]
      : [...encounter.initiatives, newCreature.initiative];

    setEncounter((prev) => ({
      ...prev,
      creatures: newCreatures,
      initiatives: newInitiatives,
    }));

    console.log("List of creatures: ", newCreatures);
    console.log("List of initiatives: ", newInitiatives);
    console.log(
      "List of creature Ids: ",
      newCreatures.map((c) => c.id)
    );
  };

  const nextRound = () => {
    setEncounter((prev) => ({
      ...prev,
      round: prev.round ? prev.round + 1 : 1,
    }));
    setEncounter(...encounter, [0, encounter.creatures[0].id]);
  };

  const nextTurn = () => {
    // if (currentTurn[0] === encounter.creatures.length - 1) {
    //   nextRound();
    //   return;
    // }
    // setCurrentTurn([
    //   currentTurn[0] + 1,
    //   encounter.creatures[currentTurn[0] + 1].id,
    // ]);
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
