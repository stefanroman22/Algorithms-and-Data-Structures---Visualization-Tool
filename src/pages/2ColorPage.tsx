import "../styles/DFSBFSPage.css";
import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import GraphInputsDFSBFS from "../components/VisualizerToolPage/GraphInputs/GraphInputsDFSBFS";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import Legend2Color from "../components/VisualizerToolPage/Legend/2Color/Legend2Color";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons";
import Instructions2Color from "../components/VisualizerToolPage/Instructions/2Color/Instructions2Color";

function Color2Page() {
  const { handleParseGraph, handleStart, handlePause, handleRestart } =
    HandleVisualizationButtons();
  return (
    <div className="visualization-container">
      <div className="visualizer-label">2Color</div>
      {/* NavBar */}
      <div className="navbar-visualization-page" style={{display: "inline-block"}}>
        <NavbarVisualizerToolPage />
      </div>

      {/*
      {/* Graph Input Section */}
      <GraphInputsDFSBFS handleParseGraph={() => handleParseGraph("2Color")} />

      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <Legend2Color />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("2Color")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("2Color")}
        />
      </div>

      {/* Instructions for DFS */}
      <Instructions2Color />
      
    </div>
  );
}

export default Color2Page;
