import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ReactSplit, { SplitDirection } from "@devbookhq/splitter";
import Initiative from "./Initiative/initiative";
import Sheet from "./Sheet/sheet";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ReactSplit
        SplitDirection={SplitDirection.Horizontal}
        minWidths={[200, 400]}
        initialSizes={[35, 65]}
        gutterClassName="custom-gutter-horizontal"
        draggerClassName="custom-dragger-horizontal"
      >
        <Initiative />
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
