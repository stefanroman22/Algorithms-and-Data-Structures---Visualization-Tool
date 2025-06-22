import {
  waitForResume,
  checkSimulationId,
  colorLink,
} from "../Basic(DFS+BFS)/runAlgorithm";
//Definiton for Priority Queue
export class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper to get parent and child indices
  parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  leftChildIndex(i) {
    return 2 * i + 1;
  }
  rightChildIndex(i) {
    return 2 * i + 2;
  }

  // Add an element to the priority queue
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this.heapifyUp();
  }

  // Remove and return the element with the highest priority (smallest priority value)
  dequeue() {
    if (this.size() === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return top;
  }

  // Peek at the element with the highest priority without removing it
  peek() {
    return this.heap[0] || null;
  }

  // Helper functions to restore the heap property
  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[this.parentIndex(index)].priority > this.heap[index].priority
    ) {
      [this.heap[this.parentIndex(index)], this.heap[index]] = [
        this.heap[index],
        this.heap[this.parentIndex(index)],
      ];
      index = this.parentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.leftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.leftChildIndex(index);
      if (
        this.rightChildIndex(index) < this.heap.length &&
        this.heap[this.rightChildIndex(index)].priority <
          this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = this.rightChildIndex(index);
      }
      if (this.heap[index].priority < this.heap[smallerChildIndex].priority) {
        break;
      }
      [this.heap[index], this.heap[smallerChildIndex]] = [
        this.heap[smallerChildIndex],
        this.heap[index],
      ];
      index = smallerChildIndex;
    }
  }

  // Get the size of the priority queue
  size() {
    return this.heap.length;
  }

  // Check if the priority queue is empty
  isEmpty() {
    return this.size() === 0;
  }
}

const updateDistanceLabel = (nodeId, newDistance, svg) => {
  svg
    .selectAll(".distance-label")
    .filter((d) => d.id === nodeId)
    .text(newDistance) // Update the distance text
    .style("opacity", 0) // Start with fully transparent
    .transition()
    .duration(800) // Example duration for the fade-in effect
    .style("opacity", 1) // Fade in to fully visible
    .style("fill", "#4ED7F1"); // Change the color to red
};

/**
 * Performs a Dijkstra on the graph.
 * @param {{
 *   nodes: Array<{ id: string }>,
 *   links: Array<{ source: string, target: string, weight: number }>
 * }} graph - The parsed graph with weights.
 * @param {string} startNodeId - The ID of the node where DFS starts.
 * @param {() => boolean} getPausedRef - The function that gets the paused value
 * @param {number} currentSimulationId - The function that gets the running value
 * @param {() => number} getSimulationIdRef - The function that gets the running value
 * @returns {Array<string>} - The order of visited nodes.
 */
export const runDijkstra = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const distances = new Map(); // Shortest distances from the start node
  const visited = new Map(); // To track visit state of nodes: 'discovered', 'explored'
  const previousNodes = new Map(); // Previous nodes in the shortest path
  const priorityQueue = new PriorityQueue(); // Min-heap priority queue
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;

  // Initialize distances, previousNodes, and update the label for the start node
  graph.nodes.forEach((node) => {
    if (node.id === startNodeId) {
      distances.set(node.id, 0);
      priorityQueue.enqueue(node.id, 0);

      // Update the distance label for the starting node
      svg
        .selectAll(".distance-label")
        .filter((d) => d.id === startNodeId)
        .text("0") // Set its value to "0"
        .attr("fill", "#4ED7F1"); // Color distance label for starting node 
      visited.set(node.id, "discovered");
    } else {
      distances.set(node.id, Infinity);
      visited.set(node.id, "unvisited");
    }
    previousNodes.set(node.id, null);
  });

  // Process nodes in the priority queue
  while (!priorityQueue.isEmpty()) {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);

    const { value: currentNode } = priorityQueue.dequeue();

    if (visited.get(currentNode) === "explored") {
      // Skip processing if the node is already explored
      continue;
    }

    visited.set(currentNode, "discovered");
    console.log(`Visited node: ${currentNode}`);

    // Highlight the current node as visited (orange)
    svg
      .selectAll(".node")
      .filter((d) => d.id === currentNode)
      .transition()
      .duration(delay)
      .style("fill", "#ff9a00")
      .attr("stroke-width", 3);
    await waitForResume(getPausedRef);
    await sleep(delay);

    // Find neighbors of the current node
    const neighbors = graph.links
      .filter((link) => link.source === currentNode)
      .map((link) => ({ id: link.target, weight: link.weight }));

    for (const neighbor of neighbors) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);

      const neighborId = neighbor.id;
      const neighborWeight = neighbor.weight;
      const customMarkerId = `arrowhead-${currentNode}-${neighborId}`;
      const newDistance = distances.get(currentNode) + neighborWeight;

      // Skip neighbor if already fully explored
      if (visited.get(neighborId) === "explored") {
        continue;
      }

      // Highlight the link from the current node to the neighbor
      colorLink(svg, currentNode, neighborId, "#317256", customMarkerId, delay);
      await sleep(delay);

      // Highlight the neighbor node as discovered (orange) only if unvisited
      if (visited.get(neighborId) === "unvisited") {
        svg
          .selectAll(".node")
          .filter((d) => d.id === neighborId)
          .transition()
          .duration(delay)
          .style("fill", "#ff9a00")
          .attr("stroke-width", 3);
        visited.set(neighborId, "discovered");
      }

      // Update distance and enqueue neighbor if a shorter path is found
      if (newDistance < distances.get(neighborId)) {
        distances.set(neighborId, newDistance);
        previousNodes.set(neighborId, currentNode);
        priorityQueue.enqueue(neighborId, newDistance);

        updateDistanceLabel(neighborId, newDistance, svg);
        console.log(`Updated distance for node ${neighborId}: ${newDistance}`);
      }
      await sleep(delay);
    }

    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    
    // Mark the current node as fully processed (red)
    svg
      .selectAll(".node")
      .filter((d) => d.id === currentNode)
      .transition()
      .duration(delay)
      .style("fill", "#ff4d4d")
      .attr("stroke-width", 4.5);
    visited.set(currentNode, "explored");
  }

  // Mark any unvisited nodes as unreachable (gray)
  graph.nodes.forEach((node) => {
    if (distances.get(node.id) === Infinity) {
      svg
        .selectAll(".node")
        .filter((d) => d.id === node.id)
        .transition()
        .duration(delay)
        .style("fill", "#9b9696"); // Gray for unreachable nodes

      svg
        .selectAll(".distance-label")
        .filter((d) => d.id === node.id)
        .text("∞") // Keep the distance label as "∞"
        .style("fill", "#9b9696"); // Gray for unreachable nodes
    }
  });

  if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
  console.log("Dijkstra completed!");
  console.log("Distances:", distances);
  console.log("Previous Nodes:", previousNodes);
  return { distances, previousNodes };
};

/**
 * Runs the Bellman-Ford shortest path algorithm on the graph with animated visualization.
 * Updates distance labels and colors nodes and edges to reflect the algorithm's progress.
 * Detects negative cycles and alerts the user if found.
 * Supports pause and abort controls via simulation IDs and pause state.
 * 
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string, weight: number }> }} graph - The graph object with nodes and weighted edges.
 * @param {string} startNodeId - The ID of the start node for shortest paths.
 * @param {d3.Selection} svg - The D3 SVG selection for visualization.
 * @param {() => boolean} getPausedRef - Function returning true if animation is paused.
 * @param {number} currentSimulationId - Current unique simulation ID to allow safe abort.
 * @param {() => number} getSimulationIdRef - Function returning latest simulation ID for validation.
 * @returns {Promise<void>} - Completes when algorithm finishes or aborts.
 */
export const runBellmanFord = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const distances = new Map();
  const previousEdge = new Map();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;

  graph.nodes.forEach((node) => {
    if (node.id === startNodeId) {
      distances.set(node.id, 0);
      svg
        .selectAll(".distance-label")
        .filter((d) => d.id === startNodeId)
        .text("0") // Set its value to "0"
        .attr("fill", "#4ED7F1"); // Optionally style it
    } else distances.set(node.id, Infinity);
  });

  for (let i = 1; i < graph.nodes.length; i++) {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    console.log("Round: " + i);
    for (const link of graph.links) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
      const customMarkerId = `arrowhead-${link.source}-${link.target}`;
      if (
        distances.get(link.source) + link.weight <
        distances.get(link.target)
      ) {
        previousEdge.set(link.target, link);
        //We update the distances both in memory and visually
        distances.set(link.target, distances.get(link.source) + link.weight);
        //Color source node
        svg
          .selectAll(".node")
          .filter((d) => d.id === link.source)
          .transition()
          .duration(delay)
          .style("fill", "#ff9a00")
          .attr("stroke-width", 3);
        await sleep(delay);
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);

        //Color link between source and target
        colorLink(
          svg,
          link.source,
          link.target,
          "#ff6701",
          customMarkerId,
          delay
        );
        await sleep(delay + 100);
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);

        //color the target node
        svg
          .selectAll(".node")
          .filter((d) => d.id === link.target)
          .transition()
          .duration(delay)
          .style("fill", "#00FFFF");
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);

        //Color the distance label at same time target node gets coloured - no delay
        updateDistanceLabel(
          link.target,
          distances.get(link.source) + link.weight,
          svg
        );
        await sleep(delay);
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);

        //Uncolor the link between source and target
        colorLink(svg, link.source, link.target, "#999", customMarkerId, delay);
      } else {
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);
        colorLink(
          svg,
          link.source,
          link.target,
          "#ff6700",
          customMarkerId,
          delay
        );
        await sleep(delay + 100);
        if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
        await waitForResume(getPausedRef);
        colorLink(svg, link.source, link.target, "#999", customMarkerId, delay);
        await sleep(delay);
      }
    }
  }

  graph.nodes.forEach((node) => {
    const dist = distances.get(node.id);
    if (dist !== Infinity) {
      svg
        .selectAll(".node")
        .filter((d) => d.id === node.id)
        .transition()
        .duration(600)
        .style("fill", "#ff9a00") // final color to indicate discovered
        .attr("stroke-width", 3);
    }
  });

  //Check for presence of negative cycle
  for (const link of graph.links) {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    if (
      distances.get(link.source) + link.weight <
      distances.get(link.target)
    ) {
      
      alert("Negative cycle detected! Please a parse a different graph for finding the shortest path distances!");
      return;
    }
  }


  for (const [targetId, edge] of previousEdge.entries()) {
    const customMarkerId = `arrowhead-${edge.source}-${edge.target}`;
    colorLink(svg, edge.source, edge.target, "#ff3300", customMarkerId, delay);
    await sleep(delay);
  }
  console.log("Bellman Ford completed!");
  console.log("Distances:", distances);
};
