import { useRef, useState } from "react";
import { updateVisualizationBox, startAlgorithmSimulation } from "../CreateGraph/createGraph";
import { showErrorPopup } from "../utils/displayAlert";

/**
 * Custom hook managing handlers for graph visualization controls:
 * parse graph input, start simulation, pause/resume, and restart.
 * 
 * Handles state and refs for pause status, parsed state, and simulation ID
 * to control simulation lifecycle and UI feedback.
 * 
 * @returns {object} - Handlers: handleParseGraph, handleStart, handlePause, handleRestart
 */
export default function HandleVisualizationButtons() {
  const [pressedParsed, setPressedParsed] = useState(false);

  const pausedRef = useRef(false);
  const simulationIdRef = useRef(0);

  const getPausedRef = () => pausedRef.current;
  const getSimulationIdRef = () => simulationIdRef.current;

  let visualizationBox = null;
  let graphInputElement = null;
  let startNodeInputValue = "";
  let pauseButton = null;

  const updateGlobalElements = () => {
    visualizationBox = document.getElementById("visualization-box");
    graphInputElement = document.getElementById("graph-input-textarea");
    pauseButton = document.getElementById("button-visualizer-pause");
  };

  const resetPauseButton = () => {
    pausedRef.current = false;
    if (pauseButton) {
      pauseButton.textContent = "Pause";
    }
  };

  const handleParseGraph = (algorithmName) => {
    console.clear();
    updateGlobalElements();

    if (!graphInputElement.value) {
      showErrorPopup("Please insert a valid graph input!");
      return;
    }

    setPressedParsed(true);
    console.log(
      pressedParsed ? "Graph parsed successfully." : "Graph not parsed"
    );
    resetPauseButton();
    updateVisualizationBox(visualizationBox, graphInputElement, algorithmName);
  };

  const getStartNodeInputValue = () => {
    const startNodeInputElement = document.getElementById("start-node-input");
    if (
      startNodeInputElement &&
      startNodeInputElement instanceof HTMLInputElement
    ) {
      const value = startNodeInputElement.value.trim();
      if (value === "") {
        showErrorPopup("Please insert a value for the Start Node Index!");
        return null;
      }
      return value;
    }
    return null;
  };

  const handleStart = (algorithmName) => {
    if (!pressedParsed) {
      showErrorPopup("Please parse the graph first!");
      return;
    }

    updateGlobalElements();

    let startNodeValue = -1;
    if(algorithmName !== "Kruskal"){
      startNodeValue = getStartNodeInputValue();
    }
    
    if (startNodeValue === null) return;

    startNodeInputValue = startNodeValue;
    const currentSimulationID = ++simulationIdRef.current;

    startAlgorithmSimulation(
      visualizationBox,
      startNodeInputValue,
      graphInputElement,
      getPausedRef,
      currentSimulationID,
      getSimulationIdRef,
      algorithmName
    );
  };

  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    if (pauseButton) {
      pauseButton.textContent = pausedRef.current ? "Resume" : "Pause";
    }
    console.log(`Paused state: ${pausedRef.current ? "Paused" : "Resumed"}`);
  };

  const handleRestart = async (algorithmName) => {
    const sleep = (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    updateGlobalElements();
    simulationIdRef.current++;
    console.clear();
    console.log("All previous simulation will be terminated!");
    await sleep(100);

    console.log("Algorithm will be restarted now!");
    resetPauseButton();


    updateVisualizationBox(visualizationBox, graphInputElement, algorithmName);
    await sleep(1000);

    const currentSimulationId = simulationIdRef.current;
    startAlgorithmSimulation(
      visualizationBox,
      startNodeInputValue,
      graphInputElement,
      getPausedRef,
      currentSimulationId,
      getSimulationIdRef,
      algorithmName
    );
  };

  return {
    handleParseGraph,
    handleStart,
    handlePause,
    handleRestart,
  };
}
