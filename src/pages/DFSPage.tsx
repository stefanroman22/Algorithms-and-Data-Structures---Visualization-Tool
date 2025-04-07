import "../styles/DFSBFSPage.css";

import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import InstructionsDFSBFS from "../components/VisualizerToolPage/Instructions/DFSBFS/InstructionsDFSBFS";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import GraphInputsDFSBFS from "../components/VisualizerToolPage/GraphInputs/GraphInputsDFSBFS";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import LegendDFS from "../components/VisualizerToolPage/Legend/DFS/LegendDFS";

function DFSPage() {
  const { handleParseGraph, handleStart, handlePause, handleRestart } =
    HandleVisualizationButtons();
  return (
    <div className="visualization-container">
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Graph Input Section */}
      <GraphInputsDFSBFS handleParseGraph={() => handleParseGraph("DFS")} />

      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <LegendDFS />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("DFS")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("DFS")}
        />
      </div>

      {/* Instructions for DFS */}
      <InstructionsDFSBFS />
    </div>
  );
}
export default DFSPage;
