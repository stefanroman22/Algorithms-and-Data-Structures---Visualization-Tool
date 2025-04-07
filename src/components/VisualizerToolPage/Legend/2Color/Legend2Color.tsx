import React from "react";
import "./Legend2Color.css"; // Assuming CSS is in a separate file

function Legend2Color() {
  return (
    <div className="legend">
      <div>
        <span className="node-undiscovered"></span> Node: Undiscovered
      </div>
      <div>
        <span className="node-discovered-red"></span> Node: Discovered (Red)
      </div>
      <div>
        <span className="node-discovered-blue"></span> Node: Discovered (Blue)
      </div>

      <div>
        <span className="edge-processed"></span> Edge: Processed
      </div>
    </div>
  );
}

export default Legend2Color;
