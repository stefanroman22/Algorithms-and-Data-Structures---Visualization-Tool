import {
  waitForResume,
  checkSimulationId,
  colorLink,
} from "../Basic(DFS+BFS)/runAlgorithm";
import { PriorityQueue } from "../Heuristics/runAlgorithmHeuristics";

/**
 * Runs Prim's algorithm to find the Minimum Spanning Tree (MST) of a graph,
 * starting from a given node, with animated visualization using D3.js.
 * Supports pausing and aborting via simulation IDs and pause state.
 * 
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string, weight: number }> }} graph - The graph data.
 * @param {string} startNodeId - The ID of the node where Prim's algorithm starts.
 * @param {d3.Selection} svg - The D3 SVG selection for visualization.
 * @param {() => boolean} getPausedRef - Function that returns true if animation is paused.
 * @param {number} currentSimulationId - Current simulation ID to allow aborting old simulations.
 * @param {() => number} getSimulationIdRef - Function returning latest simulation ID for validation.
 * @returns {Promise<void>} - Resolves when the MST is found or aborted.
 */
export const runPrim = async (
  graph,
  startNodeId,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const visitedNodes = new Set(); // To track visited nodes
  const visitedEdges = new Set(); // To track MST edges
  const edgeQueue = new PriorityQueue(); // Min-heap priority queue for edges
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;

  // Helper function to add edges to the priority queue
  const enqueueEdges = (nodeId) => {
    graph.links.forEach((link) => {
      const isOutgoing =
        link.source === nodeId && !visitedNodes.has(link.target);
      const isIncoming =
        link.target === nodeId && !visitedNodes.has(link.source);

      if (isOutgoing || isIncoming) {
        const target = isOutgoing ? link.target : link.source;
        edgeQueue.enqueue(
          { source: nodeId, target: target, weight: link.weight },
          link.weight
        );
      }
    });
  };

  const Prim = async () => {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    // Add starting node to the MST
    visitedNodes.add(startNodeId);
    enqueueEdges(startNodeId);
    svg
      .selectAll(".node")
      .filter((d) => d.id === startNodeId)
      .transition()
      .duration(delay)
      .attr("fill", "#ff9a00")
      .attr("stroke-width", 4.5);
    await sleep(delay);

    while (!edgeQueue.isEmpty()) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);

      // Get the smallest weight edge from the queue
      const { value: edge } = edgeQueue.dequeue();
      const { source, target, weight } = edge;

      if (visitedNodes.has(target)) continue; // Skip if the target is already visited

      // Add the edge to the MST
      visitedEdges.add(`${source} <-> ${target}`);
      visitedNodes.add(target);

      console.log(
        `Edge added to MST: ${source} <-> ${target} (Weight: ${weight})`
      );

      // Highlight the edge
      svg
        .selectAll(".link")
        .filter(
          (link) =>
            (link.source.id === source && link.target.id === target) ||
            (link.source.id === target && link.target.id === source)
        )
        .attr("stroke-dasharray", 5,5)
        .transition()
        .duration(delay)
        .attr("stroke", "#ff6f00")
        .attr("stroke-width", 3);
      await sleep(delay);

      // Highlight the target node
      svg
        .selectAll(".node")
        .filter((d) => d.id === target)
        .transition()
        .duration(delay)
        .attr("fill", "#ff9a00")
        .attr("stroke-width", 4.5);
      await sleep(delay);

      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
      // Add new edges from the target node
      enqueueEdges(target);
    }

    // Final check for isolated nodes
    if (visitedNodes.size < graph.nodes.length) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
      alert(
        "MST cannot be computed! Please parse a graph that has no isolated nodes!"
      );
      return;
    }

    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    console.log("MST construction complete.");
    console.log("Edges in MST:", Array.from(visitedEdges));
  };

  await Prim();
};

class UnionFind {
  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }

  // Find the root of a node with path compression
  find(node) {
    if (this.parent.get(node) !== node) {
      this.parent.set(node, this.find(this.parent.get(node))); // Path compression
    }
    return this.parent.get(node);
  }

  // Union by rank: Attach the smaller tree to the larger tree
  union(node1, node2) {
    let root1 = this.find(node1);
    let root2 = this.find(node2);

    if (root1 === root2) return false; // They are already in the same set (cycle detected)

    // Union by rank
    if (this.rank.get(root1) > this.rank.get(root2)) {
      this.parent.set(root2, root1);
    } else if (this.rank.get(root1) < this.rank.get(root2)) {
      this.parent.set(root1, root2);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, this.rank.get(root1) + 1);
    }
    return true; // Successfully merged
  }

  // Initialize nodes
  makeSet(nodes) {
    nodes.forEach((node) => {
      this.parent.set(node.id, node.id);
      this.rank.set(node.id, 0);
    });
  }
}


/**
 * Runs Kruskal's algorithm to find the Minimum Spanning Tree (MST) of a graph,
 * with animated visualization of nodes and edges using D3.js.
 * Supports pausing and aborting via simulation IDs and pause state.
 * 
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string, weight: number }> }} graph - The graph data.
 * @param {d3.Selection} svg - The D3 SVG selection for visualization.
 * @param {() => boolean} getPausedRef - Function that returns true if animation is paused.
 * @param {number} currentSimulationId - Current simulation ID to allow aborting old simulations.
 * @param {() => number} getSimulationIdRef - Function returning latest simulation ID for validation.
 * @returns {Promise<void>} - Resolves when the MST is found or aborted.
 */
export const runKruskal = async (
  graph,
  svg,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef
) => {
  const visitedNodes = new Set(); // To track visited nodes
  const visitedEdges = new Set(); // To track MST edges
  const edgeQueue = new PriorityQueue(); // Min-heap priority queue for edges
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const delay = 800;


  //1 --> 2 (5)
  //3 --> 4  ()
  //4 --> 2 (1)
  //1 --> 3 (6)

  const enqueueEdges = () => {
    graph.links.forEach((link) => {
      edgeQueue.enqueue(
        { source: link.source, target: link.target, weight: link.weight },
        link.weight
      );
    });
  };

  const Kruskal = async () => {
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
  
    // Initialize Union-Find for cycle detection
    const uf = new UnionFind();
    uf.makeSet(graph.nodes); // Initialize all nodes
  
    enqueueEdges(); // Add all edges to the priority queue
  
    while (!edgeQueue.isEmpty()) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
  
      // Get the smallest weight edge from the queue
      const { value: edge } = edgeQueue.dequeue();
      const { source, target, weight } = edge;
  
      // Cycle Detection: If source and target are already connected, skip the edge
      if (!uf.union(source, target)) {
        console.log(`Edge ${source} <-> ${target} (Weight: ${weight}) skipped (Cycle detected)`);
        continue;
      }
  
      // Add the edge to the MST
      visitedEdges.add(`${source} <-> ${target}`);
      visitedNodes.add(source);
      visitedNodes.add(target);
  
      console.log(`Edge added to MST: ${source} <-> ${target} (Weight: ${weight})`);
  
      // Highlight the source node
      svg
        .selectAll(".node")
        .filter((d) => d.id === source)
        .transition()
        .duration(delay)
        .attr("fill", "#ff9a00")
        .attr("stroke-width", 4.5);
      await sleep(delay);
  
      // Highlight the edge
      svg
        .selectAll(".link")
        .filter(
          (link) =>
            (link.source.id === source && link.target.id === target) ||
            (link.source.id === target && link.target.id === source)
        )
        .attr("stroke-dasharray", 5,5)        
        .transition()
        .duration(delay)
        .attr("stroke", "#ff6f00")
        .attr("stroke-width", 3);
      await sleep(delay);
  
      // Highlight the target node
      svg
        .selectAll(".node")
        .filter((d) => d.id === target)
        .transition()
        .duration(delay)
        .attr("fill", "#ff9a00")
        .attr("stroke-width", 4.5);
      await sleep(delay);
  
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
    }
  
    // Final check for isolated nodes
    if (visitedNodes.size < graph.nodes.length) {
      if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
      await waitForResume(getPausedRef);
      alert("MST cannot be computed! Please parse a graph that has no isolated nodes!");
      return;
    }
  
    if (!checkSimulationId(currentSimulationId, getSimulationIdRef)) return;
    await waitForResume(getPausedRef);
    console.log("MST construction complete.");
    console.log("Edges in MST:", Array.from(visitedEdges));
  };
  
  await Kruskal();
};