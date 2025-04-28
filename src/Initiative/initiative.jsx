import React, { useEffect, useState } from "react";
import encounter from "../../public/test/testEncounter.json";
import { readTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { resolveResource } from "@tauri-apps/api/path";
import Creature from "./creature";
import "./initiative.css";

export default function Initiative() {
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
        setContent(fileContent);
        console.log("File opened successfully!");
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const sortByInitiative = (a, b) => b.initiative - a.initiative;

  const [creatureList, setCreatureList] = useState(
    encounter.creatures.sort(sortByInitiative)
  );
  const [currentTurn, setCurrentTurn] = useState([0, creatureList[0].id]);
  const [round, setRound] = useState(1);

  const handleInitiativeChange = (name, newInitiative) => {
    console.log("initiative changed");
    const updatedList = creatureList.map((creature) =>
      creature.name === name
        ? { ...creature, initiative: newInitiative }
        : creature
    );
    const sortedList = updatedList.sort(sortByInitiative);
    setCreatureList(sortedList);
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
      <h2>{encounter.name}</h2>
      <div>
        <span>
          Round: {round} | Turn:{" "}
          {creatureList.find((creature) => currentTurn[1] === creature.id).name}
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
              updateInitiative={handleInitiativeChange}
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
