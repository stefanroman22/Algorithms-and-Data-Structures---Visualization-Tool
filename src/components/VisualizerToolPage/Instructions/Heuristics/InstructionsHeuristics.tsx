import "../Instructions.css"
import Note from "../Note/Note";
function InstructionsHeuristics() {
  return (
    <div className="instructions">
      Please provide the graph data using the following format:
      <ul>
        <li>
          Start with the node identifier, followed by a colon (<code>:</code>
          ), then a space, and the nodes where edges originate, with their
          weights in parentheses, separated by commas.
        </li>
        <li>
          For example, <code>1: 2(4), 3(1)</code> means there are edges{" "}
          <code>1 → 2</code> with weight <code>4</code>, and{" "}
          <code>1 → 3</code> with weight <code>1</code>.
        </li>
        <li>
          If a node is isolated (i.e., has no edges), type the node identifier
          followed by a colon (<code>:</code>) and leave it blank. For example,{" "}
          <code>5:</code> means node <code>5</code> is isolated.
        </li>
      </ul>
      Example:
      <pre>
        1: 2(4), 3(1){"\n"}
        2: 4(6){"\n"}
        3: 4(8){"\n"}
        5:
      </pre>
      <Note>
        First provide the input graph, then specify the Start Node index. After that,
        click "Parse Graph" to validate the input, and finally, click "Start" to begin
        the simulation.
      </Note>
    </div>
  );
}

export default InstructionsHeuristics;
