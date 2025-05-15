/**
 * Colors a specific link and its associated marker gradually.
 * @param {Object} svg - The D3 SVG container.
 * @param {string} nodeId - The ID of the source node.
 * @param {string} neighborId - The ID of the target node.
 * @param {string} color - The color to apply to the link and marker.
 * @param {string} customMarkerId - The unique ID for the marker.
 * @param {number} delay - The delay for the transitions.
 */
export const colorLink = (
  svg,
  nodeId,
  neighborId,
  color,
  customMarkerId,
  delay
) => {
  if (svg.select(`#${customMarkerId}`).empty()) {
    svg
      .append("defs")
      .append("marker")
      .attr("id", customMarkerId) // Unique ID for this marker
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26) // Position the arrowhead relative to the end of the line
      .attr("refY", -2)
      .attr("markerWidth", 12) // Width of the marker
      .attr("markerHeight", 12) // Height of the marker
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse") // Add this line
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") // Arrowhead shape
      .attr("fill", "#bbbbbb"); // Default marker color
  }

  // Colour the specific link and assign the unique marker
  // Set default stroke width and dash style
  let edgeWidth = 1.5;
  let dashArray = "0"; // Default to solid line

  // Switch logic based on the color (i.e., type of edge)
  switch (color) {
    case "#dd1717": // Forward edge
      edgeWidth = 3;
      break;
    case "rgb(7, 130, 179)": //Back edge
    case "#ff6701":            //Edge Relaxed Bellman Ford 
      dashArray = 5,5;
      break;
    case "rgb(220, 220, 24)": // Cross edge
    case "#ff6700":
    case "#ff3300": 
      edgeWidth = 3;
      dashArray = 5,5;
      break;
  }
  svg
    .selectAll(".link, .self-loop")
    .filter((d) => d.source.id === nodeId && d.target.id === neighborId)
    .attr("stroke-dasharray", dashArray) // Apply dash BEFORE transition starts
    .transition()
    .duration(delay) // Link coloring duration
    .attr("stroke", color) // Change link color
    .attr("stroke-width", edgeWidth)
    .attr("marker-end", `url(#${customMarkerId})`) // Assign the unique marker
    .on("end", () => {
      // Gradually color the marker
      svg
        .select(`#${customMarkerId} path`)
        .transition()
        .delay(100) // Delay marker coloring slightly after the link
        .duration(200) // Marker coloring duration
        .attr("fill", color); // Match marker color to link
    });
};




/**
 * Waits until the algorithm is resumed if paused.
 * @param {() => boolean} getPausedRef - The function to check if the simulation is paused.
 * @returns {Promise<void>} - Resolves when the simulation is resumed.
 */
export const waitForResume = async (getPausedRef) => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  while (getPausedRef()) {
    console.log("Paused... Waiting to resume.");
    await sleep(100); // Check every 100 milliseconds
  }
};

/**
 * Checks if the current simulation ID is still valid.
 * @param {number} currentSimulationId - The ID of the current simulation.
 * @param {() => number} getSimulationIdRef - The function to get the active simulation ID.
 * @returns {boolean} - True if the simulation is valid, false otherwise.
 */
export const checkSimulationId = (currentSimulationId, getSimulationIdRef) => {
  if (currentSimulationId !== getSimulationIdRef()) {
    console.log(
      `Simulation with ID: ${currentSimulationId} has been terminated.`
    );
    return false; // Simulation is invalid
  }
  return true; // Simulation is valid
};

/**
 * Performs a Depth-First Search (DFS) on the graph.
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> }} graph - The graph to traverse.
 * @param {string} startNodeId - The ID of the node where DFS starts.
 * @param {() => boolean} getPausedRef - The function that gets the paused value
 * @param {number} currentSimulationId - The function that gets the running value
 * @param {() => number} getSimulationIdRef - The function that gets the running value
 * @returns {Array<string>} - The order of visited nodes.
 */
export const runDFS = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const visited = new Map(); // To track visit state of nodes: 'discovered', 'explored'
  const result = []; // To store the traversal order
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;
  let time = 0;
  const entry = new Map();
  const exit = new Map();

  const dfs = async (nodeId) => {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    // Mark the node as discovered (orange)
    svg
      .selectAll(".node")
      .filter((d) => d.id === nodeId) // Find the specific node by ID
      .transition()
      .duration(delay)
      .style("fill", "#ff9a00")
      .attr("stroke-width", 3); 

    visited.set(nodeId, "discovered");
    entry.set(nodeId, ++time); // Record entry time
    result.push(nodeId);

    console.log(`Visited node: ${nodeId}`);
    await sleep(delay); // Pause after marking as discovered

    // Create neighbors list
    const neighbors = graph.links
      .filter((link) => link.source === nodeId)
      .map((link) => link.target);

    for (const neighborId of neighbors) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
      // Generate a unique marker ID for this specific edge
      const customMarkerId = `arrowhead-${nodeId}-${neighborId}`;
      if (!visited.has(neighborId)) {
        // Tree edge: visit unvisited neighbor
        console.log(`Tree edge detected: ${nodeId} -> ${neighborId}`);
        colorLink(svg, nodeId, neighborId, "#317256", customMarkerId, delay);
        await sleep(delay);
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await dfs(neighborId);
      } else if (visited.get(neighborId) === "discovered") {
        // Back edge: neighbor is discovered but not fully explored
        console.log(`Back edge detected: ${nodeId} -> ${neighborId}`);
        colorLink(
          svg,
          nodeId,
          neighborId,
          "rgb(7, 130, 179)",
          customMarkerId,
          delay
        ); // Make back edge blue
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await sleep(delay);
      } else {
        // Distinguish forward and cross edges
        if (
          entry.get(nodeId) < entry.get(neighborId) &&
          exit.get(neighborId) < exit.get(nodeId)
        ) {
          console.log(`Forward edge detected: ${nodeId} -> ${neighborId}`);
          colorLink(svg, nodeId, neighborId, "#dd1717", customMarkerId, delay); // Forward edge red
        } else {
          console.log(`Cross edge detected: ${nodeId} -> ${neighborId}`);
          colorLink(svg, nodeId, neighborId, "rgb(220, 220, 24)", customMarkerId, delay); // Cross edge black
        }
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await sleep(delay);
      }
    }

    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);

    // Mark the node as fully explored (red)
    svg
      .selectAll(".node")
      .filter((d) => d.id === nodeId) // Find the specific node by ID
      .transition()
      .duration(delay)
      .style("fill", "#ff4d4d")
      .attr("stroke-width", 4.5);

    visited.set(nodeId, "explored");
    exit.set(nodeId, ++time); // Record exit time
    console.log(`Explored node: ${nodeId}`);
    await sleep(delay); // Pause after marking as explored
  };

  // Start DFS from the given start node
  await dfs(startNodeId);

  if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
  console.log("DFS completed!");
  console.log("Result from DFS: " + result);
  return result; // Return the complete traversal order
};

/**
 * Performs a Depth-First Search (DFS) on the graph.
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> }} graph - The graph to traverse.
 * @param {string} startNodeId - The ID of the node where DFS starts.
 * @param {() => boolean} getPausedRef - The function that gets the paused value
 * @param {number} currentSimulationId - The function that gets the running value
 * @param {() => number} getSimulationIdRef - The function that gets the running value
 * @returns {Array<string>} - The order of visited nodes.
 */
export const runBFS = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const visited = new Set(); // Track visited nodes
  const result = []; // To store the traversal order
  const parent = new Map(); // To track parents for identifying edges
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;

  const queue = [];
  queue.push(startNodeId); // Start BFS from the starting node
  visited.add(startNodeId);
  parent.set(startNodeId, null); // Root node has no parent

  // Mark the node as discovered (orange) only when dequeued
  svg
    .selectAll(".node")
    .filter((d) => d.id === startNodeId) // Find the specific node by ID
    .transition()
    .duration(delay)
    .style("fill", "#ff9a00")
    .attr("stroke-width", 3); 
  await waitForResume(getPausedRef);

  while (queue.length > 0) {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);

    const nodeId = queue.shift(); // Dequeue the first node
    result.push(nodeId);

    console.log(`Visited node: ${nodeId}`);
    await sleep(delay);

    // Find all neighbors of the current node
    const neighbors = graph.links
      .filter((link) => link.source === nodeId)
      .map((link) => link.target);

    for (const neighborId of neighbors) {
      await waitForResume(getPausedRef);
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      const customMarkerId = `arrowhead-${nodeId}-${neighborId}`;
      if (!visited.has(neighborId)) {
        // Add unvisited neighbors to the queue
        visited.add(neighborId);
        parent.set(neighborId, nodeId); // Set parent
        queue.push(neighborId); // Enqueue the neighbor

        // Mark tree edge
        console.log(`Tree edge detected: ${nodeId} -> ${neighborId}`);
        colorLink(svg, nodeId, neighborId, "#317256", customMarkerId, delay);
        await sleep(delay);
        svg
          .selectAll(".node")
          .filter((d) => d.id === neighborId) // Find the specific node by ID
          .transition()
          .duration(delay)
          .style("fill", "#ff9a00")
          .attr("stroke-width", 3); 
        await waitForResume(getPausedRef);
        await sleep(delay);
      } else {
        // Non-tree edge: classify as back or cross edge
        const parentOfNode = parent.get(nodeId);
        if (parentOfNode && parentOfNode !== neighborId) {
          console.log(`Cross edge detected: ${nodeId} -> ${neighborId}`);
          colorLink(svg, nodeId, neighborId, "rgb(220, 220, 24)", customMarkerId, delay); // Cross edge black
          await sleep(delay);
        } else {
          console.log(`Back edge detected: ${nodeId} -> ${neighborId}`);
          colorLink(
            svg,
            nodeId,
            neighborId,
            "rgb(7, 130, 179)",
            customMarkerId,
            delay
          ); // Back edge blue
          await waitForResume(getPausedRef);
          await sleep(delay);
        }
      }
    }

    await waitForResume(getPausedRef);
    // Mark the node as fully explored (red) after processing its neighbors
    svg
      .selectAll(".node")
      .filter((d) => d.id === nodeId) // Find the specific node by ID
      .transition()
      .duration(delay)
      .style("fill", "#ff4d4d")
      .attr("stroke-width", 4.5); 
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;

    console.log(`Explored node: ${nodeId}`);
    await waitForResume(getPausedRef);
  }

  console.log("BFS completed!");
  console.log("Result from BFS: " + result);
  return result; // Return the complete traversal order
};
