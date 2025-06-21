import "../styles/DFSBFSPage.css";

import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import GraphInputsHeuristics from "../components/VisualizerToolPage/GraphInputs/GraphInputsHeuristics";
import LegendHeuristics from "../components/VisualizerToolPage/Legend/Heuristics/LegendHeuristics";
import InstructionsHeuristics from "../components/VisualizerToolPage/Instructions/Heuristics/InstructionsHeuristics";

function DijkstraPage() {
  const { handleParseGraph, handleStart, handlePause, handleRestart } =
    HandleVisualizationButtons();
  return (
    <div className="visualization-container">
      <div className="visualizer-label">Dijkstra</div>
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Graph Input Section */}
      <GraphInputsHeuristics handleParseGraph={() => handleParseGraph("Dijkstra")} />

      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <LegendHeuristics />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("Dijkstra")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("Dijkstra")}
        />
      </div>

      {/* Instructions for DFS */}
      <InstructionsHeuristics />
    </div>
  );
}
export default DijkstraPage;
