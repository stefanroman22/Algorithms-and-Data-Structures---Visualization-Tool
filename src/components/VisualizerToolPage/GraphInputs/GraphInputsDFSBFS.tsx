import React from "react";
import "./GraphInputsDFSBFS.css";
function GraphInputsDFSBFS({ handleParseGraph }) {
  return (
    <div className="graph-inputs">
      <h3>Input Graph</h3>
      <textarea
        id="graph-input-textarea"
        className="graph-input-textarea"
        placeholder="Enter adjacency list or matrix, e.g., &#10;1: 2, 3&#10;2: 4&#10;3: 4 &#10;5:"
      ></textarea>
      <div className="input-and-button">
        <input
          id="start-node-input"
          type="text"
          className="start-node-input"
          placeholder="StartNode Index"
        />
        <button className="parse-graph-button" onClick={handleParseGraph}>
          Parse Graph
        </button>
      </div>
    </div>
  );
}

export default GraphInputsDFSBFS;
