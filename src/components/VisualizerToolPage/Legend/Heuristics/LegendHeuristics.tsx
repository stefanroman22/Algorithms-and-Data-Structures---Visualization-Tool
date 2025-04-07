import React from "react";

function LegendHeuristics() {
  return (
    <div className="legend">
      <div>
        <span className="node-undiscovered"></span>Node: Undiscovered
      </div>
      <div>
        <span className="node-discovered"></span>Node: Discovered
      </div>
      <div>
        <span className="node-explored"></span>Node: Explored
      </div>
    </div>
  );
}

export default LegendHeuristics;
