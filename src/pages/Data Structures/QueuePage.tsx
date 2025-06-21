import { useState } from 'react'
import NavbarVisualizerToolPage from '../../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage';
import CommandsButtons from '../../components/VisualizerToolPage/Data Structures/Commands/CommandsButtons';
import "../../styles/Data Structures/ArraysPage.css";
import { handleQueueCommands } from '../../scripts/Data Structures/Queue/Handle Commands/handleQueueCommands';
import DataStructureInputs from '../../components/VisualizerToolPage/Data Structures/Data Structure Input/DataStructuresInputs';
import InstructionsDataStructures from '../../components/VisualizerToolPage/Data Structures/Instructions/InstructionsDataStructures';

function QueuePage() {
  const [parseInputPressed, setParseInputPressed] = useState(false);
  const [queue, setQueue] = useState<number[]>([]);

  const [showEnqueueForm, setShowEnqueueForm] = useState(false);
  const [enqueueValue, setEnqueueValue] = useState("");

  const [showPeekForm, setShowPeekForm] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false); // Common disabled state

  const handleButtonClick = (action: () => void
  ) => {
    if (isDisabled) return;
    setIsDisabled(true);
    action(); // Execute the action
    setTimeout(() => setIsDisabled(false), 800); // Re-enable after 800ms
  };

  const handleEnqueueClick = () => {
    setShowEnqueueForm((prev) => !prev);
  }
  const handlePeekClick = () => {
    setShowPeekForm((prev) => !prev);
  }

  return (
    <div className="visualization-container">
      <div className="visualizer-label">Queue</div>
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>



      <CommandsButtons buttons={[
        { label: "Enqueue", action: handleEnqueueClick },
        { label: "Dequeue", action: () => handleButtonClick(() => handleQueueCommands("Dequeue", queue, parseInputPressed, -1, setQueue)) },
        { label: "Peek", action: handlePeekClick },
        { label: "isEmpty", action: () => handleButtonClick(() => handleQueueCommands("isEmpty", queue, parseInputPressed, -1, setQueue)) },
      ]} />

      {showEnqueueForm && (
        <div className="enqueue-form">
          <input
            type="number"
            placeholder="Value"
            value={enqueueValue}
            onChange={(e) => setEnqueueValue(e.target.value)}
          />
          <button
            disabled={isDisabled}
            onClick={() => handleQueueCommands("Enqueue", queue, parseInputPressed, Number(enqueueValue), setQueue)}
          >
            Confirm
          </button>
        </div>
      )}

      {showPeekForm && (
        <div className="peek-form">
          <button
            disabled={isDisabled}
            onClick={() => handleQueueCommands("Peek Head", queue, parseInputPressed, Number(enqueueValue), setQueue)}
          >
            Head
          </button>
          <button
            disabled={isDisabled}
            onClick={() => handleQueueCommands("Peek Tail", queue, parseInputPressed, Number(enqueueValue), setQueue)}
          >
            Tail
          </button>
        </div>
      )}

      <DataStructureInputs
        setParseInputPressed={setParseInputPressed}
        setDataStructure={setQueue}
        type="Queue"
      />

      <InstructionsDataStructures type="Queue" />
    </div>
  )
}

export default QueuePage;
