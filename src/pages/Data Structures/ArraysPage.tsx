import { useState } from "react";
import NavbarVisualizerToolPage from "../../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage";
import CommandsButtons from "../../components/VisualizerToolPage/Data Structures/Commands/CommandsButtons";
import "../../styles/Data Structures/ArraysPage.css";
import { handleArrayCommands } from "../../scripts/Data Structures/Arrays/Handle Commands/handleArrayCommands";
import DataStructureInputs from "../../components/VisualizerToolPage/Data Structures/Data Structure Input/DataStructuresInputs";
import InstructionsDataStructures from "../../components/VisualizerToolPage/Data Structures/Instructions/InstructionsDataStructures";

function ArraysPage() {
  const [parseInputPressed, setParseInputPressed] = useState(false);
  const [array, setArray] = useState<number[]>([]);

  const [showAppendForm, setShowAppendForm] = useState(false);
  const [appendValue, setAppendValue] = useState("");

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateIndex, setUpdateIndex] = useState("");
  const [updateValue, setUpdateValue] = useState("");

  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [isDisabled, setIsDisabled] = useState(false); // Common disabled state


  // Toggle form visibility
  const handleAppendClick = () => {
    setShowAppendForm((prev) => !prev); // Show/Hide input fields
  };

  const handleDeleteClick = () => {
    setShowDeleteForm((prev) => !prev); // Show/Hide input fields
  };

  const handleUpdateClick = () => {
    setShowUpdateForm((prev) => !prev); // Show/Hide input fields
  }

  const handleSearchClick = () => {
    setShowSearchForm((prev) => !prev); // Show/Hide input fields
  }

  // 📌 scripts/helpers/handleButtonClick.ts
  const handleButtonClick = (action: () => void
  ) => {
    if (isDisabled) return;
    setIsDisabled(true);
    action(); // Execute the action
    setTimeout(() => setIsDisabled(false), 800); // Re-enable after 800ms
  };

  return (
    <div className="visualization-container">
      <div className="visualizer-label">Array</div>
      {/* NavBar */}
      <div className="navbar-visualization-page">
        <NavbarVisualizerToolPage />
      </div>

      {/* Command Buttons */}
      <CommandsButtons
        buttons={[
          { label: "Append", action: handleAppendClick },
          { label: "Delete", action: handleDeleteClick },
          { label: "Update", action: handleUpdateClick },
          { label: "Min", action: () => handleButtonClick(() => handleArrayCommands("Min", array, parseInputPressed, -1, -1, -1, -1, -1, setArray)) },
          { label: "Max", action: () => handleButtonClick(() => handleArrayCommands("Max", array, parseInputPressed, -1, -1, -1, -1, -1, setArray)) },
          { label: "Search", action: handleSearchClick },
        ]} />
      
      {showAppendForm && (
        <div className="append-form">
          <input
            type="number"
            placeholder="Value"
            value={appendValue}
            onChange={(e) => setAppendValue(e.target.value)}
          />
          <button
            disabled={isDisabled}
            onClick={() => handleButtonClick(() => handleArrayCommands("Append", array, parseInputPressed, Number(appendValue), -1, -1, -1, -1, setArray))}
          >
            Confirm
          </button>
        </div>
      )}

      {showDeleteForm && (
        <div className="delete-form">
          <input
            type="number"
            placeholder="Index"
            value={deleteIndex}
            onChange={(e) => setDeleteIndex(e.target.value)}
          />
          <button
            disabled={isDisabled}
            onClick={() => handleButtonClick(() => handleArrayCommands("Delete", array, parseInputPressed, -1, Number(deleteIndex), -1, -1, -1, setArray))}
          >
            Confirm
          </button>
        </div>
      )}

      {showUpdateForm && (
        <div className="update-form">
          <input
            type="number"
            placeholder="Index"
            value={updateIndex}
            onChange={(e) => setUpdateIndex(e.target.value)}
          />
          <input
            type="number"
            placeholder="Value"
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
          />
          <button
            disabled={isDisabled}
            onClick={() => handleButtonClick(() => handleArrayCommands("Update", array, parseInputPressed, -1, -1, Number(updateIndex), Number(updateValue), -1, setArray))}
          >
            Confirm
          </button>
        </div>
      )}

      {showSearchForm && (
        <div className="search-form">
          <input
            type="number"
            placeholder="Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            disabled={isDisabled}
            onClick={() => handleButtonClick(() => handleArrayCommands("Search", array, parseInputPressed, -1, -1, -1, -1, Number(searchValue), setArray))}
          >
            Confirm
          </button>
        </div>
      )}

      <DataStructureInputs
        setParseInputPressed={setParseInputPressed}
        setDataStructure={setArray}
        type= "Array"
      />
      <InstructionsDataStructures type="Array"/>
    </div>
  );
}

export default ArraysPage;
