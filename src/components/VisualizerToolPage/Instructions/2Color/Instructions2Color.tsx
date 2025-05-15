import "../Instructions.css"
import Note from "../Note/Note";
function Instructions2Color() {
  return (
    <div className="instructions">
      Please provide the graph data using the following format:
      <ul>
        <li>
          Start with the node identifier, followed by a colon (<code>:</code>
          ), then a space, and the nodes where edges originate, separated by
          commas. Note that for the 2 Colour algorithm the edges are bidirectional.
        </li>
        <li>
          For example, <code>1: 2, 3</code> means there are edges{" "}
          <code>1 → 2</code>, <code>1 → 3</code>, <code>2 → 1</code> and <code>3 → 1</code>.
        </li>
        <li>
          If a node is isolated (i.e., has no edges), type the node identifier
          followed by a colon (<code>:</code>) and leave it blank. For example,{" "}
          <code>1:</code> means node <code>1</code> is isolated.
        </li>
      </ul>
      Example:
      <pre>
        1: 2, 3{"\n"}
        2: 4{"\n"}
        3: 4{"\n"}
        5:
      </pre>
      <Note>
        First provide the input graph, then specify the
        Start Node index. After that, click "Parse Graph" to validate the input,
        and finally, click "Start" to begin the algorithm simulation.
      </Note>
    </div>
  );
}

export default Instructions2Color;
