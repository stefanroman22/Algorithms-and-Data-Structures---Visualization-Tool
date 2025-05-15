import React from 'react';
import "../../Instructions/Instructions.css"

interface InstructionsDataStructuresProps {
    type: string;
}

function InstructionsDataStructures({ type }: InstructionsDataStructuresProps) {
    const dataStructureNametoLower = type.toLowerCase();

    const commandEmptyDataStructure: Record<string, string> = {
        "Array": "Min",
        "Queue": "Dequeue",
        "Stack": "Pop",
    };

    const emptyCommand = commandEmptyDataStructure[type] || "N/A";

    return (
        <div className="instructions">
            After entering the page, first create the {dataStructureNametoLower} using the input text area below.
            <ul>
                <li>
                    Begin by typing the elements you want to add to the {dataStructureNametoLower}, separated by commas, in the input field provided below the visualization box.
                </li>
                <li>
                    Note that you can add an empty {dataStructureNametoLower} by not typing anything, but then some methods cannot be applied before you insert some elements (eg. {emptyCommand})
                </li>
                <li>
                    For example, entering <code>10,20,30</code> will create the {dataStructureNametoLower} with these elements, which will then be displayed visually.
                </li>
                <li>
                    Once you’ve typed your input, click the "Parse Input" button to process and initialize the {dataStructureNametoLower} for interaction.
                </li>
            </ul>
            Example:
            <pre>
                10,20,30{"\n"}
            </pre>
            <small style={{ fontSize: "14px" }}>
                <strong>Note:</strong> After parsing the input, use the buttons on the left panel to perform various operations on the data structure, such as insert, delete, or traverse, and observe how it behaves visually.
            </small>
        </div>
    );
}

export default InstructionsDataStructures; 