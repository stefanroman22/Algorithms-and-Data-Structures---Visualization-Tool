import React from "react";
import "./LegendSpanTree.css"
function LegendSpanTree() {
  return (
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
  );
}

export default LegendSpanTree;
