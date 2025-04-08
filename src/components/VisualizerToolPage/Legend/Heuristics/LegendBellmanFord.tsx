import React from "react";
import "../Heuristics/LegendBellmanFord.css";
function LegendBellmanFord() {
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
        <span className="edge-relaxed"></span>Edge: Relaxed
      </div>
      <div>
        <span className="edge-member-shortest-path"></span>Edge: Member Shortest Path
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
            <span className="edge-relaxed-color-blind"></span>Edge: Relaxed
          </div>
          <div>
            <span className="edge-member-shortest-path-color-blind"></span>Edge: Member Shortest Path
          </div>
      </div>
    </div>  
  );
}

export default LegendBellmanFord;
