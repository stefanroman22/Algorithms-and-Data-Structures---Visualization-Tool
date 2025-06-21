import "../styles/DFSBFSPage.css";
import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import GraphInputsHeuristics from "../components/VisualizerToolPage/GraphInputs/GraphInputsHeuristics";
import LegendSpanTree from "../components/VisualizerToolPage/Legend/SpanTree/LegendSpanTree";
import InstructionsSpanTree from "../components/VisualizerToolPage/Instructions/SpanTree/InstructionsSpanTree";

function PrimPage() {
  const { handleParseGraph, handleStart, handlePause, handleRestart } =
    HandleVisualizationButtons();
  return (
    <div className="visualization-container">
      <div className="visualizer-label">Prim</div>
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Graph Input Section */}
      <GraphInputsHeuristics handleParseGraph={() => handleParseGraph("Prim")} />

      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <LegendSpanTree />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("Prim")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("Prim")}
        />
      </div>

      {/* Instructions for SpanTree */}
      <InstructionsSpanTree />
    </div>
  );
}

export default PrimPage;
