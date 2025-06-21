import "./DataStructuresInputs.css";
import { handleParseInput as handleArrayOrQueueParse } from "../../../../scripts/Data Structures/Arrays/Create Array/createArray";
import { handleParseInput as handleStackParse } from "../../../../scripts/Data Structures/Stack/Create Stack/createStack";


interface DataStructureInputsProps {
    setParseInputPressed: (value: boolean) => void;
    setDataStructure: (value: number[]) => void;
    type: "Array" | "Queue" | "Stack";
}

function DataStructureInputs({ setParseInputPressed, setDataStructure, type }: DataStructureInputsProps) {

    const placeholders: Record<string, string> = {
        Array: "Enter array elements (e.g., 10,20,30)",
        Queue: "Enter queue elements (e.g., 10,20,30)",
        Stack: "Enter stack elements (e.g., 10,20,30)",
    };

    const inputIds: Record<string, string> = {
        Array: "array-input-field",
        Queue: "queue-input-field",
        Stack: "stack-input-field",
    };

    const handleInputParsing = type === "Stack" ? handleStackParse : handleArrayOrQueueParse;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            const input = e.currentTarget;

            if (input.value.trim() === "") {
                e.preventDefault();
                const sampleInput = "10,20,30";
                input.value = sampleInput;

                // Move cursor to the end
                input.selectionStart = input.selectionEnd = sampleInput.length;
            }
        }
    };


    return (
        <div className='visualization-and-inputs-data-structures'>
            {/* Visualization Box */}
            <div className="visualization-box-data-structures" id="visualization-box-data-structures"></div>

            {/* Input and Button */}
            <div className="input-container">
                <input
                    type="text"
                    placeholder={placeholders[type]}
                    className="input-text-area"
                    id={inputIds[type]}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="button-visualizer-data-structures"
                    onClick={() => handleInputParsing(
                        inputIds[type],
                        "visualization-box-data-structures",
                        setParseInputPressed,
                        setDataStructure,
                        type
                    )}
                >
                    Parse Input
                </button>


            </div>
        </div>
    );
}

export default DataStructureInputs;

