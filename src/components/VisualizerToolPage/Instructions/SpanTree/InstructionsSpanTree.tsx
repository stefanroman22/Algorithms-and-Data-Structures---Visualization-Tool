import "../Instructions.css";
import Note from "../Note/Note";
function InstructionsSpanTree() {
  return (
    <div className="instructions">
      Please provide the graph data using the following format:
      <ul>
        <li>
          Start with the node identifier, followed by a colon (<code>:</code>
          ), then a space, and the nodes where edges originate, with their
          weights in parentheses, separated by commas. Note that for MST algorithms the edges are bidirectional.
        </li>
        <li>
          For example, <code>1: 2(4)</code> means there is a bidirectional edge{" "}
          <code>1 ↔ 2</code> with weight <code>4</code>.
        </li>
        <li>
          Make sure the graph that is parsed does not have isolated nodes(i.e., has no edges).
          Otherwise, at the end of the simulation an alert will be be displayed on the screen.
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
        the algorithm simulation.
      </Note>
    </div>
  );
}

export default InstructionsSpanTree;
