import { useState } from 'react'
import NavbarVisualizerToolPage from '../../components/VisualizerToolPage/NavBar/NavBarVisualizerToolPage';
import CommandsButtons from '../../components/VisualizerToolPage/Data Structures/Commands/CommandsButtons';
import "../../styles/Data Structures/ArraysPage.css";
import { handleStackCommands } from '../../scripts/Data Structures/Stack/Create Stack/Handle Commands/handleStackCommands';
import DataStructureInputs from '../../components/VisualizerToolPage/Data Structures/Data Structure Input/DataStructuresInputs';
import InstructionsDataStructures from '../../components/VisualizerToolPage/Data Structures/Instructions/InstructionsDataStructures';

function StackPage() {
    const [parseInputPressed, setParseInputPressed] = useState(false);
    const [stack, setStack] = useState<number[]>([]);

    const [showPushForm, setShowPushForm] = useState(false);
    const [pushValue, setPushValue] = useState("");

    const [isDisabled, setIsDisabled] = useState(false); // Common disabled state

    const handleButtonClick = (action: () => void
    ) => {
        if (isDisabled) return;
        setIsDisabled(true);
        action(); // Execute the action
        setTimeout(() => setIsDisabled(false), 800); // Re-enable after 800ms
    };

    const handlePushClick = () => {
        setShowPushForm((prev) => !prev);
    }
    return (
        <div className="visualization-container">
            <div className="visualizer-label">Stack</div>
            {/* NavBar */}
            <div className="navbar-visualization-page">
                <NavbarVisualizerToolPage />
            </div>

            <CommandsButtons buttons={[
                { label: "Push", action: handlePushClick },
                { label: "Pop", action: () => handleButtonClick(() => handleStackCommands("Pop", stack, parseInputPressed, -1, setStack)) },
                { label: "Top", action: () => handleButtonClick(() => handleStackCommands("Top", stack, parseInputPressed, -1, setStack)) },
                { label: "isEmpty", action: () => handleButtonClick(() => handleStackCommands("isEmpty", stack, parseInputPressed, -1, setStack)) },
            ]} />

            {showPushForm && (
                <div className="push-form">
                    <input
                        type="number"
                        placeholder="Value"
                        value={pushValue}
                        onChange={(e) => setPushValue(e.target.value)}
                    />
                    <button
                        disabled={isDisabled}
                        onClick={() => handleStackCommands("Push", stack, parseInputPressed, Number(pushValue), setStack)}
                    >
                        Confirm
                    </button>
                </div>
            )}

            <DataStructureInputs
                setParseInputPressed={setParseInputPressed}
                setDataStructure={setStack}
                type="Stack"
            />

            <InstructionsDataStructures type="Stack" />
        </div>
    );
}

export default StackPage
