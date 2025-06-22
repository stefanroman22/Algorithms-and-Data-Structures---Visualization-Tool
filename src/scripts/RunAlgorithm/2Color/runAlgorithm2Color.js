import {
  waitForResume,
  checkSimulationId,
} from "../Basic(DFS+BFS)/runAlgorithm";

/**
 * Performs a 2-coloring (bipartite check) on the graph using DFS with animation.
 * Colors nodes and edges to visualize the bipartite check, handling disconnected components.
 * Pauses and aborts gracefully based on simulation state.
 * 
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> }} graph - The graph object containing nodes and edges.
 * @param {string} startNodeId - The ID of the node where the 2-color DFS starts.
 * @param {d3.Selection} svg - The D3 SVG selection for animating nodes and edges.
 * @param {() => boolean} getPausedRef - Function returning true if the animation is paused.
 * @param {number} currentSimulationId - Current simulation's unique ID for validation.
 * @param {() => number} getSimulationIdRef - Function returning the latest simulation ID.
 * @returns {Promise<boolean>} - Resolves to true if graph is bipartite, otherwise terminates early.
 */
export const run2Color = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const visitedNodes = new Map(); // To track visit state of nodes
  const visitedEdges = new Set(); // To track discovered edges
  const nodeColors = new Map(); // To track colors of nodes
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;
  const colors = ["#ff4d4d", "#3399ff"]; // Red and Blue

  let bipartiteConflict = false; // Flag to avoid multiple alerts

  const getReversedColor = (nodeColor) =>
    nodeColor === colors[0] ? colors[1] : colors[0];


  const validateAndColorNode = async (nodeId, color) => {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);

    // Check if the node has already been visited
    if (nodeColors.has(nodeId)) {
      const existingColor = nodeColors.get(nodeId);
      if (existingColor !== color && !bipartiteConflict) {
        bipartiteConflict = true; // Set conflict flag
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        alert(
          `Graph is not Bipartite because of a conflict between node ${nodeId} and a neighbour. Please try parsing a new graph.`
        );
      }
      return; // Node already colored, skip further processing
    }

    // Assign color to the node
    nodeColors.set(nodeId, color);
    let strokeWidthValue = 3;
    if(color === "#3399ff")
        strokeWidthValue = 4.5
    svg
      .selectAll(".node")
      .filter((d) => d.id === nodeId)
      .transition()
      .duration(delay)
      .style("fill", color)
      .attr("stroke-width", strokeWidthValue); 

    visitedNodes.set(nodeId, "discovered");
    await sleep(delay);
  };

  if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
  await waitForResume(getPausedRef);

  const Coloring2DFS = async (nodeId, currentColor) => {
    if (!bipartiteConflict) {
      await validateAndColorNode(nodeId, currentColor);
      console.log(`Visited node: ${nodeId}`);
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);

      const neighbors = graph.links
        .filter(
          (link) =>
            (link.source === nodeId &&
              !visitedEdges.has(`${nodeId}-${link.target}`)) ||
            (link.target === nodeId &&
              !visitedEdges.has(`${link.target}-${nodeId}`))
        )
        .map((link) => (link.source === nodeId ? link.target : link.source));

      for (const neighborId of neighbors) {
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);

        // Mark the edge as visited in both directions
        visitedEdges.add(`${nodeId}-${neighborId}`);
        visitedEdges.add(`${neighborId}-${nodeId}`);

        // Color the edge
        svg
          .selectAll(".link")
          .filter(
            (d) =>
              (d.source.id === nodeId && d.target.id === neighborId) ||
              (d.source.id === neighborId && d.target.id === nodeId)
          )
          .transition()
          .duration(delay)
          .attr("stroke", "#ff6700") // Change link color
          .attr("stroke-width", 3)           // Increase thickness
         .attr("stroke-dasharray", "5,5"); 

        console.log(`Edge Processed: ${nodeId} <-> ${neighborId}`);
        await sleep(delay);

        if (!visitedNodes.has(neighborId)) {
          // Recursively process neighbors with the reversed color
          await Coloring2DFS(neighborId, getReversedColor(currentColor));
        } else if (
          nodeColors.get(neighborId) === currentColor &&
          !bipartiteConflict
        ) {
          bipartiteConflict = true; // Set conflict flag
          if (!checkSimulationId(currentSimulationId, getSimulationIdRef))
            return;
          await waitForResume(getPausedRef);
          alert(
            `Graph is not Bipartite because of a conflict between nodes ${nodeId} and ${neighborId}. Please try parsing a new graph.`
          );
          return;
        }
      }
    }else return;
  };

  // Always start with the startNodeId
  await Coloring2DFS(startNodeId, colors[0]);

  // Process any remaining unvisited nodes (handle disconnected components)
  for (const node of graph.nodes) {
    if (!visitedNodes.has(node.id) && !bipartiteConflict) {
      await Coloring2DFS(node.id, colors[0]);
    }
  }

  if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
  if (!bipartiteConflict) alert("Graph is Bipartite");

  return true;
};
