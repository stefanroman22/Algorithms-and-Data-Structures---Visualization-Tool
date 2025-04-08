import React from "react";
import "./Legend2Color.css";
function Legend2Color() {
  return (
    <div className="legend-container">
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
      <div className="legend-color-blind">
      <div>
        <span className="node-undiscovered-color-blind"></span> Node: Undiscovered
      </div>
      <div>
        <span className="node-discovered-red-color-blind"></span> Node: Discovered (Red)
      </div>
      <div>
        <span className="node-discovered-blue-color-blind"></span> Node: Discovered (Blue)
      </div>

      <div>
        <span className="edge-processed-color-blind"></span> Edge: Processed
      </div>
    </div>
    </div>
  );
}

export default Legend2Color;
