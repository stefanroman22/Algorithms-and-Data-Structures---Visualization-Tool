import React from "react";
import "./CommandsButtons.css";
const CommandsButtons = ({ buttons }: { buttons: { label: string; action: () => void }[] }) => {
  return (
      <div className="data-structures-commands-container">
        {buttons.map((btn, index) => (
          <button key={index} onClick={btn.action} className="button-visualizer">
            {btn.label}
          </button>
        ))}
      </div>
    
  );
};

export default CommandsButtons;
