import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ReactSplit, { SplitDirection } from "@devbookhq/splitter";
import Initiative from "./Initiative/initiative";
import Sheet from "./Sheet/sheet";
import emptyEncounter from "./util/emptyEncounter.js";

function App() {
  const [count, setCount] = useState(0);
  const [encounter, setEncounter] = useState(emptyEncounter);

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
        setEncounter({ ...encounter, creatures: [] });
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
    <>
      <div className="header-menu">
        <h3>DnD Initiative Tracker</h3>
      </div>

      <ReactSplit
        SplitDirection={SplitDirection.Horizontal}
        minWidths={[350, 600]}
        initialSizes={[40, 60]}
        gutterClassName="custom-gutter-horizontal"
        draggerClassName="custom-dragger-horizontal"
      >
        <Initiative encounter={encounter} />
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
