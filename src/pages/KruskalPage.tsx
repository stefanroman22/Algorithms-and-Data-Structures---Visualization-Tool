import "../styles/DFSBFSPage.css";
import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import GraphInputsKruskal from "../components/VisualizerToolPage/GraphInputs/GraphInputsKruskal";
import LegendSpanTree from "../components/VisualizerToolPage/Legend/SpanTree/LegendSpanTree";
import InstructionsSpanTree from "../components/VisualizerToolPage/Instructions/SpanTree/InstructionsSpanTree";

function KruskalPage() {
    const { handleParseGraph, handleStart, handlePause, handleRestart } =
    HandleVisualizationButtons();
  return (
    <div className="visualization-container">
      <div className="visualizer-label">Kruskal</div>
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Graph Input Section */}
      <GraphInputsKruskal handleParseGraph={() => handleParseGraph("Kruskal")} />

      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <LegendSpanTree />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("Kruskal")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("Kruskal")}
        />
      </div>

      {/* Instructions for SpanTree */}
      <InstructionsSpanTree />
    </div>
  );
}

export default KruskalPage
