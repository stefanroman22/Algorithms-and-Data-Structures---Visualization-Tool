import React from "react";

function VisualizerButtons({ handleStart, handlePause, handleRestart }) {
  return (
    <div className="visualizer-buttons">
      <button className="button-visualizer" onClick={handleStart}>
        Start
      </button>
      <button
        id="button-visualizer-pause"
        className="button-visualizer"
        onClick={handlePause}
      >
        Pause
      </button>
      <button className="button-visualizer" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}

export default VisualizerButtons;
