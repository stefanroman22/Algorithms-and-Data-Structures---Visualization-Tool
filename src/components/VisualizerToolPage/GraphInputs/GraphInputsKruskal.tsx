import React, { useState } from "react";
import "./GraphInputsDFSBFS.css";

function GraphInputsKruskal({ handleParseGraph }) {
 
  return (
    <div className="graph-inputs">
      <h3>Input Graph</h3>
      <textarea
        id="graph-input-textarea"
        className="graph-input-textarea"
        placeholder={`Enter adjacency list with weights, e.g., \n1: 2(4), 3(1)\n2: 4(6)\n3: 4(8)\n5:`}
      ></textarea>
      <div className="input-and-button">
        <button className="parse-graph-button" onClick={handleParseGraph}>
          Parse Graph
        </button>
      </div>
    </div>
  );
}



export default GraphInputsKruskal;
