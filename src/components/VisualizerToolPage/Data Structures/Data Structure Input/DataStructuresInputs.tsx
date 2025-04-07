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
        Array: "Enter array elements (e.g., 1,2,3,4)",
        Queue: "Enter queue elements (e.g., 1,2,3,4)",
        Stack: "Enter stack elements (e.g., 1,2,3,4)",
    };

    const inputIds: Record<string, string> = {
        Array: "array-input-field",
        Queue: "queue-input-field",
        Stack: "stack-input-field",
    };

    const handleInputParsing = type === "Stack" ? handleStackParse : handleArrayOrQueueParse;


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

