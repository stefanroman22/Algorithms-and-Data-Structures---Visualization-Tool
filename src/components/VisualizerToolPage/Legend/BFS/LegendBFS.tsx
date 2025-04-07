import "./LegendBFS.css";
function LegendBFS() {
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
        <div>
          <span className="edge-tree"></span>Edge: Tree Edge
        </div>
        <div>
          <span className="edge-back"></span>Edge: Back Edge
        </div>
        <div>
          <span className="edge-cross"></span>Edge: Cross Edge
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
    <div>
      <span className="edge-tree-color-blind"></span>Edge: Tree Edge
    </div>
    <div>
      <span className="edge-back-color-blind"></span>Edge: Back Edge
    </div>
    <div>
      <span className="edge-cross-color-blind"></span>Edge: Cross
    </div>
    </div>
  </div>
  );
}

export default LegendBFS;
