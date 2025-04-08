import React from "react";

function LegendHeuristics() {
  return (
    <div className="legend-container">
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

      <div className="legend-color-blind">
      <div>
        <span className="node-undiscovered-color-blind"></span>Node: Undiscovered
      </div>
      <div>
        <span className="node-discovered-color-blind"></span>Node: Discovered
      </div>
      <div>
        <span className="node-explored-color-blind"></span>Node: Explored
      </div>
    </div>
    </div>
  );
}

export default LegendHeuristics;
