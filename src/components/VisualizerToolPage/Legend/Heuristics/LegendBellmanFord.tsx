import React from "react";
import "../Heuristics/LegendBellmanFord.css";
function LegendBellmanFord() {
  return (
    <div className="legend">
      <div>
        <span className="node-undiscovered"></span>Node: Undiscovered
      </div>
      <div>
        <span className="node-discovered-bellman-ford"></span>Node: Discovered
      </div>
      <div>
        <span className="edge-relaxed"></span>Edge: Relaxed
      </div>
      <div>
        <span className="edge-member-shortest-path"></span>Edge: Member Shortest Path
      </div>
    </div>
  );
}

export default LegendBellmanFord;
