import {
  waitForResume,
  checkSimulationId,
} from "../Basic(DFS+BFS)/runAlgorithm";

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
  const colors = ["#d00000", "#005b96"]; // Red and Blue

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
    svg
      .selectAll(".node")
      .filter((d) => d.id === nodeId)
      .transition()
      .duration(delay)
      .style("fill", color);

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
          .attr("stroke", "#ff6700"); // Change link color

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
