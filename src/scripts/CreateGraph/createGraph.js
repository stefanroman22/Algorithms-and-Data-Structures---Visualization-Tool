import * as d3 from "d3";
import { runDFS, runBFS } from "../RunAlgorithm/Basic(DFS+BFS)/runAlgorithm";
import { runBellmanFord, runDijkstra } from "../RunAlgorithm/Heuristics/runAlgorithmHeuristics";
import { run2Color } from "../RunAlgorithm/2Color/runAlgorithm2Color";
import { runKruskal, runPrim } from "../RunAlgorithm/SpanTree/spantree";

/**
 * Parses the graph input into nodes and links for D3.js.
 * @param {string} graphInputContent - The raw graph input content from the textarea.
 * @param {string} algorithmName
 * @returns {{
 *   nodes: Array<{ id: string }>,
 *   links: Array<{ source: string, target: string, weight?: number }>
 * }} The parsed graph.
 */
export const parseGraphInput = (graphInputContent, algorithmName) => {
  const nodes = new Set();
  const links = [];
  const seenLinks = new Set(); // Track unique link identifiers
  const errors = [];
  const lines = graphInputContent.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const [startNode, edgesString] = line.split(":").map((part) => part.trim());
    if (startNode) nodes.add(startNode);

    if (edgesString) {
      const edges = edgesString.split(",").map((edge) => edge.trim());
      const isWeighted = ["Dijkstra", "Prim", "Kruskal", "Bellman-Ford"].includes(algorithmName);

      edges.forEach((edge) => {
        if (isWeighted) {
          const match = edge.match(/^(\w+)\((-?\d+)\)$/);
          if (match) {
            const [_, endNode, weight] = match;
            nodes.add(endNode);
            const key = `${startNode}->${endNode}(${weight})`;
            if (!seenLinks.has(key)) {
              seenLinks.add(key);
              links.push({
                source: startNode,
                target: endNode,
                weight: Number(weight),
              });
            }
          } else {
            errors.push(
              `Invalid edge format: "${line}". Use node(distance) format.`
            );
          }
        } else {
          // For unweighted edges
          nodes.add(edge);
          const key = `${startNode}->${edge}`;
          if (!seenLinks.has(key)) {
            seenLinks.add(key);
            links.push({
              source: startNode,
              target: edge,
            });
          }
        }
      });
    }
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
  }

  return {
    nodes: Array.from(nodes).map((id) => ({ id })),
    links,
  };
};

/**
 * Updates the content of the visualization box element with a D3 force-directed graph.
 * @param {HTMLElement | null} visualizationBoxElement - The target element to update.
 * @param {HTMLTextAreaElement | null} graphInputElement - The textarea element containing graph input.
 * @param {string} algorithmName
 */
export const updateVisualizationBox = (
  visualizationBoxElement,
  graphInputElement,
  algorithmName
) => {
  if (!visualizationBoxElement) {
    console.error("Visualization box element not found.");
    return;
  }

  if (!graphInputElement) {
    console.error("Graph input element not found.");
    return;
  }

  // Use .value to get the content of the textarea
  const graphInputContent = graphInputElement.value;
  console.log("Graph Input Content:", graphInputContent);

  // Parse the input
  const graph = parseGraphInput(graphInputContent, algorithmName);

  //Create the graph based on the algorithm
  createGraph(visualizationBoxElement, graph, algorithmName);
};

export const createGraph = (container, graph, algorithmName = "") => {
  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;
  const svg = createSVG(container, width, height);

  // Determine behavior flags based on algorithm
  const isHeuristic = ["Dijkstra", "Bellman-Ford"].includes(algorithmName);
  const showEdgeWeights = ["Prim", "Kruskal"].includes(algorithmName);
  const isBidirectional = ["2Color", "Prim", "Kruskal", "AdjacencyMatrixAnimation"].includes(algorithmName);
  const isTreeRooted = ["Tree"].includes(algorithmName);

  if (!isBidirectional) createArrowMarkers(svg);

  const linkWithDirection = annotateBidirectionality(graph.links);
  const { selfLoops, regularLinks } = splitLinks(linkWithDirection);
  const simulation = createSimulation(graph.nodes, linkWithDirection, width, height);

  // Annotate nodes with self-loop presence
  graph.nodes.forEach(node => {
    node.hasSelfLoop = graph.links.some(link => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      return sourceId === node.id && targetId === node.id;
    });
  });

  const linkPath = renderLinks(svg, regularLinks);
  const selfLoopPath = renderSelfLoops(svg, selfLoops);

  let edgeLabels = null;
  let selfLoopLabels = null;
  if (isHeuristic || showEdgeWeights) {
    edgeLabels = renderEdgeLabels(svg, linkWithDirection);
    if (showEdgeWeights) selfLoopLabels = renderSelfLoopLabels(svg, selfLoops);
  }

  const node = renderNodes(svg, graph.nodes, simulation, width, height)
    .attr("fill", (d, i) =>
      i === 0 && isTreeRooted ? "green" : "#bbbbbb"
    );

  const nodeLabels = renderNodeLabels(svg, graph.nodes);
  const distanceLabels = isHeuristic ? renderDistanceLabels(svg, graph.nodes) : null;

  simulation.on("tick", () => {
    updateLinkPaths(linkPath);
    updateSelfLoopPaths(selfLoopPath);
    if (edgeLabels) updateEdgeLabels(edgeLabels);
    if (selfLoopLabels) updateSelfLoopLabels(selfLoopLabels);
    updateNodePositions(node, width, height);
    updateNodeLabelPositions(nodeLabels);
    if (distanceLabels) updateDistanceLabels(distanceLabels);
  });

  console.log("Graph successfully created with", algorithmName);
};

/**
 * Creates the graph depending on the properties checked by the user.
 * @param {Object} properties - The properties structure.
 * @param {boolean} properties.weighted - Whether the graph is weighted.
 * @param {boolean} properties.connected - Whether the graph is connected.
 * @param {boolean} properties.directed - Whether the graph is directed.
 * @param {boolean} properties.cyclic - Whether the graph is cyclic.
 * @param {boolean} properties.selfLoop - Whether the graph allows self-loops.
 * @param {HTMLElement | null} container - Where the graph graphic will be stored
 */
export const createPropertiesGraph = (properties, container) => {
  container.innerHTML = "";

  let isBidirectional = true, isWeighted = false;

  const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  let links = [
    { source: 1, target: 2, weight: properties.weighted ? 5 : null },
    { source: 2, target: 3, weight: properties.weighted ? 10 : null },
    { source: 3, target: 4, weight: properties.weighted ? 2 : null },
  ];
  if (properties.connected) links.push({ source: 1, target: 5, weight: properties.weighted ? 7 : null });
  if (properties.cyclic) links.push({ source: 4, target: 1, weight: properties.weighted ? 4 : null });
  if (properties.selfLoop) links.push({ source: 1, target: 1, weight: properties.weighted ? 3 : null });
  if (properties.directed) isBidirectional = false;
  if (properties.weighted) isWeighted = true;

  links = annotateBidirectionality(links);
  const { selfLoops, regularLinks } = splitLinks(links);
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const svg = createSVG(container, width, height);
  if (!isBidirectional) createArrowMarkers(svg);
  const simulation = createSimulation(nodes, links, width, height);

  const linkSelection = renderLinks(svg, regularLinks);
  const selfLoopSelection = renderSelfLoops(svg, selfLoops);
  const nodeSelection = renderNodes(svg, nodes, simulation, width, height);
  const labelSelection = renderNodeLabels(svg, nodes);
  let edgeLabelSelection = null;
  if(isWeighted)
     edgeLabelSelection = renderEdgeLabels(svg, regularLinks);
  const selfLoopLabelSelection = renderSelfLoopLabels(svg, selfLoops);

  simulation.on("tick", () => {
    updateLinkPaths(linkSelection);
    updateSelfLoopPaths(selfLoopSelection);
    updateNodePositions(nodeSelection, width, height);
    updateNodeLabelPositions(labelSelection);
    if(isWeighted){
      updateEdgeLabels(edgeLabelSelection);
      updateSelfLoopLabels(selfLoopLabelSelection);
    }
    
  });
};

export function createSVG(container, width = 600, height = 400) {
  return d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}

export function createSimulation(nodes, links, width, height) {
  return d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-165))
    .force("center", d3.forceCenter(width / 2, height / 2));
}

export function annotateBidirectionality(links) {
  const linkMap = new Set(links.map(link => `${link.source}-${link.target}`));
  return links.map(link => ({
    ...link,
    isBidirectional: linkMap.has(`${link.target}-${link.source}`)
  }));
}

export function splitLinks(links) {
  const selfLoops = links.filter(d => d.source === d.target);
  const regularLinks = links.filter(d => d.source !== d.target);
  return { selfLoops, regularLinks };
}

export function createArrowMarkers(svg) {
  const defs = svg.append("defs");

  defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 26)
    .attr("refY", -1.5)
    .attr("markerWidth", 12)
    .attr("markerHeight", 12)
    .attr("orient", "auto")
    .attr("markerUnits", "userSpaceOnUse")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#bbbbbb");

  defs.append("marker")
    .attr("id", "self-loop-arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 26)
    .attr("refY", -1.5)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#bbbbbb");
}

export function createDrag(simulation, width, height) {
  return d3.drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = Math.max(20, Math.min(width - 20, event.x));
      d.fy = Math.max(20, Math.min(height - 20, event.y));
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}

export function renderLinks(svg, regularLinks) {
  return svg.selectAll(".link")
    .data(regularLinks)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#bbbbbb")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");
}

export function renderSelfLoops(svg, selfLoops) {
  return svg.selectAll(".self-loop")
    .data(selfLoops)
    .enter()
    .append("path")
    .attr("class", "self-loop")
    .attr("fill", "none")
    .attr("stroke", "#bbbbbb")
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round")
    .attr("marker-end", "url(#self-loop-arrowhead)");
}

export function renderNodes(svg, nodes, simulation, width, height) {
  return svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#bbbbbb")
    .attr("stroke", "#1f1f1f")
    .attr("stroke-width", 1.5)
    .call(createDrag(simulation, width, height));
}

export function renderNodeLabels(svg, nodes) {
  return svg.selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text(d => d.id);
}

export function renderEdgeLabels(svg, links) {
  return svg.selectAll(".edge-label")
    .data(links)
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("dy", d => d.isBidirectional ? -10 : 10)
    .attr("text-anchor", "middle")
    .attr("fill", "#bbbbbb")
    .style("pointer-events", "none")
    .style("font-weight", "bold")
    .style("font-size", "18px")
    .text(d => d.weight ?? "not found");
}

export function renderSelfLoopLabels(svg, selfLoops) {
  return svg.selectAll(".self-loop-label")
    .data(selfLoops)
    .enter()
    .append("text")
    .attr("class", "self-loop-label")
    .attr("dy", -66)
    .attr("text-anchor", "middle")
    .attr("fill", "#bbbbbb")
    .style("pointer-events", "none")
    .style("font-weight", "bold")
    .style("font-size", "16px")
    .text(d => d.weight ?? "not found");
}

export function renderDistanceLabels(svg, nodes) {
  return svg.selectAll(".distance-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "distance-label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("dx", 15)
    .attr("dy", 0)
    .attr("fill", "#bbbbbb")
    .style("pointer-events", "none")
    .style("font-weight", "bold")
    .style("font-size", "18px")
    .text(() => "∞");
}

export function updateLinkPaths(linkSelection) {
  linkSelection.attr("d", d => curvedPath(d, d.isBidirectional));
}

export function updateSelfLoopPaths(selfLoopPath) {
  const r = 60;
  selfLoopPath.attr("d", d => 
    `M ${d.source.x} ${d.source.y}
     C ${d.source.x - r} ${d.source.y - r * 1.5}, 
       ${d.source.x + r} ${d.source.y - r * 1.5}, 
       ${d.source.x} ${d.source.y}`);
}

export function updateEdgeLabels(edgeLabels) {
  edgeLabels
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => {
      if (d.source === d.target) return d.source.y - 66;
      return (d.source.y + d.target.y) / 2 - 5;
    });
}

export function updateSelfLoopLabels(selfLoopLabels) {
  selfLoopLabels
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2 - 5);
}

export function updateNodePositions(nodeSelection, width, height) {
  nodeSelection
    .attr("cx", d => d.x = Math.max(20, Math.min(width - 20, d.x)))
    .attr("cy", d => d.y = Math.max(20, Math.min(height - 20, d.y)));
}

export function updateNodeLabelPositions(labelSelection) {
  labelSelection
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}

export function updateDistanceLabels(distanceLabels) {
  distanceLabels
    .attr("x", d => d.hasSelfLoop ? d.x + 16 : d.x)
    .attr("y", d => d.y - 25);
}

/**
 * Highlights a node in the D3 graph by its ID and starts the algorithm simulation.
 * @param {HTMLElement} container - The container holding the SVG graph.
 * @param {string} startNodeId - The ID of the node to highlight.
 * @param {string} graphInputContent - The raw graph input content to parse and simulate.
 * @param {() => boolean} getPausedRef - Retrieve the paused state
 * @param {number} currentSimulationId
 * @param {string} algorithmName
 * @param {() => number} getSimulationIdRef
 * @param
 */
export const startAlgorithmSimulation = (
  container,
  startNodeId,
  graphInputElement,
  getPausedRef,
  currentSimulationId,
  getSimulationIdRef,
  algorithmName
) => {
  if (!container) {
    console.error("Visualization container not found.");
    return;
  }

  // Use D3 to select the SVG element and find the node by ID
  const svg = d3.select(container).select("svg");

  if (svg.empty()) {
    console.error("SVG graph not found in the container.");
    return;
  }

  // Use .value to get the content of the textarea
  const graphInputContent = graphInputElement.value;

  // Parse the input
  const graph = parseGraphInput(graphInputContent, algorithmName);

  // Check if the startNodeId exists in the parsed graph nodes
  const nodeExists = graph.nodes.some((node) => node.id == startNodeId);

  if (!nodeExists && algorithmName !== "Kruskal") {
    console.log(`Node with ID "${startNodeId}" not found in the graph.`);
    alert(`Node with ID "${startNodeId}" not found in the graph.`);
    return;
  }

  if(algorithmName !==  "Kruskal"){
    console.log("Start Node Id:", startNodeId);
  }

  console.log(
    `Input is valid, the algorithm: "${algorithmName}" will start running!`
  );

  switch (algorithmName) {
    case "DFS":
      runDFS(
        graph,
        startNodeId,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "BFS":
      runBFS(
        graph,
        startNodeId,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "Dijkstra":
      runDijkstra(
        graph,
        startNodeId,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "2Color":
      run2Color(
        graph,
        startNodeId,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "Prim":
      runPrim(
        graph,
        startNodeId,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "Kruskal":
      runKruskal(
        graph,
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      );
      break;
    case "Bellman-Ford":
      runBellmanFord(
        graph,
        startNodeId, 
        svg,
        getPausedRef,
        currentSimulationId,
        getSimulationIdRef
      )
    default:   
      break;
  }
};

const curvedPath = (d, isBidirectional) => {
  const dx = d.target.x - d.source.x; // x-distance between source and target
  const dy = d.target.y - d.source.y; // y-distance between source and target
  const dr = Math.sqrt(dx * dx + dy * dy); // Distance between source and target

  // Curvature adjustment
  const offset = isBidirectional ? 30 : 0; // Add offset for bidirectional edges

  return `M${d.source.x},${d.source.y}A${dr + offset},${dr + offset} 0 0,1 ${
    d.target.x
  },${d.target.y}`;
};
