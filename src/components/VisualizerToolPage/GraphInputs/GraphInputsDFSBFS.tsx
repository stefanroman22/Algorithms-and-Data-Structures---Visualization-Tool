import React from "react";
import "./GraphInputsDFSBFS.css";

function GraphInputsDFSBFS({ handleParseGraph }) {
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      const textarea = e.target;

      if (textarea.value.trim() === "") {
        e.preventDefault();
        const sampleGraph = "1: 2, 3\n2: 4\n3: 4\n5:";

        textarea.value = sampleGraph;

        // Move cursor to the end of inserted text
        const cursorPos = sampleGraph.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
      }
    }
  };

  return (
    <div className="graph-inputs">
      <h3>Input Graph</h3>
      <textarea
        id="graph-input-textarea"
        className="graph-input-textarea"
        placeholder={`Enter adjacency list or matrix, e.g., \n1: 2, 3\n2: 4\n3: 4\n5:`}
        onKeyDown={handleKeyDown}
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
