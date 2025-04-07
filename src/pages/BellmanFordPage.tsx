
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import NavbarVisualizerToolPage from '../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage';
import GraphInputsHeuristics from '../components/VisualizerToolPage/GraphInputs/GraphInputsHeuristics';
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import InstructionsHeuristics from "../components/VisualizerToolPage/Instructions/Heuristics/InstructionsHeuristics";
import LegendBellmanFord from '../components/VisualizerToolPage/Legend/Heuristics/LegendBellmanFord';

function BellmanFordPage() {
    const { handleParseGraph, handleStart, handlePause, handleRestart } =
        HandleVisualizationButtons();
  return (
    <div className="visualization-container">
    {/* NavBar */}
    <div className="navbar-visualization-page">
      <NavbarVisualizerToolPage />
    </div>

    {/* Graph Input Section */}
    <GraphInputsHeuristics handleParseGraph={() => handleParseGraph("Bellman-Ford")} />

    <div className="visusaltion-api">
      <div id="visualization-box" className="visualization-box"></div>

      {/* Legend Section */}
      <LegendBellmanFord />

      {/* Visualizer Buttons Section */}
      <VisualizerButtons
        handleStart={() => handleStart("Bellman-Ford")}
        handlePause={() => handlePause()}
        handleRestart={() => handleRestart("Bellman-Ford")}
      />
    </div>

    <InstructionsHeuristics />
  </div>
  )
}

export default BellmanFordPage
