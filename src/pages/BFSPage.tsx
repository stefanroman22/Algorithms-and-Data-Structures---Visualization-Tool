import "../styles/DFSBFSPage.css";

 
import NavbarVisualizerToolPage from "../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import InstructionsDFSBFS from "../components/VisualizerToolPage/Instructions/DFSBFS/InstructionsDFSBFS";
import HandleVisualizationButtons from "../scripts/HandleVisualizationButtons/HandleVisualizationButtons"
import GraphInputsDFSBFS from "../components/VisualizerToolPage/GraphInputs/GraphInputsDFSBFS";
import VisualizerButtons from "../components/VisualizerToolPage/VisualizerButtons/VisualizerButtons";
import LegendBFS from "../components/VisualizerToolPage/Legend/BFS/LegendBFS";

function BFSPage() {
  const { handleParseGraph, handleStart, handlePause, handleRestart } = HandleVisualizationButtons();
  return (
    <div className="visualization-container">

      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Graph Input Section */}
      <GraphInputsDFSBFS handleParseGraph={() => handleParseGraph("BFS")} />


      <div className="visusaltion-api">
        <div id="visualization-box" className="visualization-box"></div>

        {/* Legend Section */}
        <LegendBFS />

        {/* Visualizer Buttons Section */}
        <VisualizerButtons
          handleStart={() => handleStart("BFS")}
          handlePause={() => handlePause()}
          handleRestart={() => handleRestart("BFS")}
        />
      </div>

        {/* Instructions for DFS */}
        <InstructionsDFSBFS />
      
    </div>
  );
}
export default BFSPage;
