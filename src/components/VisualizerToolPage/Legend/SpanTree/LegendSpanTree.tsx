import React from "react";
import "./LegendSpanTree.css"
function LegendSpanTree() {
  return (
    <div className="legend-container">
    <div className="legend">
      <div>
        <span className="node-undiscovered"></span>Node: Undiscovered
      </div>
      <div>
        <span className="node-member"></span>Node: Member of Span Tree
      </div>
      <div>
        <span className="edge-member"></span>Edge: Member of Span Tree
      </div>
    </div>

    <div className="legend-color-blind">
    <div>
      <span className="node-undiscovered-color-blind"></span>Node: Undiscovered
    </div>
    <div>
      <span className="node-member-color-blind"></span>Node: MST
    </div>
    <div>
      <span className="edge-member-color-blind"></span>Edge: MST
    </div>
    </div>
    </div>
  );
}

export default LegendSpanTree;
