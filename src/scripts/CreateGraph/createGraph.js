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

const createGraph = (visualizationBoxElement, graph, algorithmName) => {
  switch (algorithmName) {
    case "2Color":
    case "Prim":
    case "Kruskal":
      createGraphBidirectional(visualizationBoxElement, graph, algorithmName);
      break;
    case "DFS":
    case "BFS":
      createD3GraphBasic(visualizationBoxElement, graph);
      break;
    case "Dijkstra":
    case "Bellman-Ford":
      createD3GraphHeuristics(visualizationBoxElement, graph);
      break;
    default:
      break;
  }
};

/**
 * Creates a D3.js force-directed graph visualization.
 * @param {HTMLElement} container - The target container element.
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> }} graph - The parsed graph.
 */
const createD3GraphBasic = (container, graph) => {
  // Clear the container
  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3
    .forceSimulation(graph.nodes)
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Detect bidirectional links
  const linkMap = new Set();
  graph.links.forEach((link) => {
    linkMap.add(`${link.source}-${link.target}`);
  });

  const linkWithDirection = graph.links.map((link) => {
    const isBidirectional = linkMap.has(`${link.target}-${link.source}`);
    return { ...link, isBidirectional };
  });

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10") // Define the coordinate system for the marker
    .attr("refX", 26) // Position the arrowhead relative to the end of the line
    .attr("refY", -2)
    .attr("markerWidth", 12) // Width of the marker
    .attr("markerHeight", 12) // Height of the marker
    .attr("orient", "auto") // Orient the arrowhead automatically based on the link direction
    .attr("markerUnits", "userSpaceOnUse") // prevents scaling
    .append("path")
    .attr("d", "M0,-5L10,0L0,5") // Path for the arrowhead
    .attr("fill", "#bbbbbb"); // Arrowhead color

  const link = svg
    .selectAll(".link")
    .data(linkWithDirection)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#bbbbbb")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");

  const node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#bbbbbb")
    .attr("stroke", "#121212")
    .attr("stroke-width", 1.5)
    .call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  const labels = svg
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((d) => d.id);

  simulation.on("tick", () => {
    link.attr("d", (d) => curvedPath(d, d.isBidirectional));

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });
};

/**
 * Creates a D3.js force-directed graph visualization with heuristics additions.
 * @param {HTMLElement} container - The target container element.
 * @param {{
 *   nodes: Array<{ id: string }>,
 *   links: Array<{ source: string, target: string, weight?: number }>
 * }} graph - The parsed graph with weights.
 */
const createD3GraphHeuristics = (container, graph) => {
  // Clear the container
  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3
    .forceSimulation(graph.nodes)
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Detect bidirectional links
  const linkMap = new Set();
  graph.links.forEach((link) => {
    linkMap.add(`${link.source}-${link.target}`);
  });

  const linkWithDirection = graph.links.map((link) => {
    const isBidirectional = linkMap.has(`${link.target}-${link.source}`);
    return { ...link, isBidirectional };
  });

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10") // Define the coordinate system for the marker
    .attr("refX", 26) // Position the arrowhead relative to the end of the line
    .attr("refY", -2)
    .attr("markerWidth", 12) // Width of the marker
    .attr("markerHeight", 12) // Height of the marker
    .attr("orient", "auto") // Orient the arrowhead automatically based on the link direction
    .attr("markerUnits", "userSpaceOnUse") // prevents scaling
    .append("path")
    .attr("d", "M0,-5L10,0L0,5") // Path for the arrowhead
    .attr("fill", "#bbbbbb"); // Arrowhead color

  const link = svg
    .selectAll(".link")
    .data(linkWithDirection)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#bbbbbb")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");

  const edgeLabels = svg
    .selectAll(".edge-label")
    .data(linkWithDirection)
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("dy", (d) => (d.isBidirectional ? -10 : 10)) // Move the label downward (increase the value for more distance)
    .attr("text-anchor", "middle") // Keep the label centered
    .attr("fill", "#bbbbbb") // Same color as the edge
    .style("pointer-events", "none") // Prevent interference with interactions
    .style("font-weight", "bold") // Make the text bold
    .style("font-size", "18px") // Optionally increase the font size
    .text((d) => d.weight ?? "not found"); // Use d.weight for the label

  const node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#bbbbbb")
    .attr("stroke", "#1f1f1f")
    .attr("stroke-width", 1.5)
    .call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  // Add node labels (node IDs)
  const labels = svg
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((d) => d.id);

  // Add distance labels above each node
  const distanceLabels = svg
    .selectAll(".distance-label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "distance-label")
    .attr("text-anchor", "middle") // Center the text horizontally with the node
    .attr("alignment-baseline", "middle") // Center the text vertically with the node
    .attr("dx", 15) // Slightly to the right of the node
    .attr("dy", 0) // Vertically aligned with the node
    .style("pointer-events", "none")
    .attr("fill", "#bbbbbb") // Same color as the node
    .style("font-weight", "bold") // Make the text bold
    .style("font-size", "18px") // Optionally increase the font size
    .text(() => "∞"); // Initial distance set to "∞"

  simulation.on("tick", () => {
    link.attr("d", (d) => curvedPath(d, d.isBidirectional));

    edgeLabels
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);

    distanceLabels.attr("x", (d) => d.x).attr("y", (d) => d.y - 25);
  });
};

/**
 * Creates a D3.js force-directed graph visualization for bidirectional graphs.
 * @param {HTMLElement} container - The target container element.
 * @param {{ nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> }} graph - The parsed graph.
 * @param {string} algorithmName
 */
const createGraphBidirectional = (container, graph, algorithmName) => {
  // Clear the container
  // Clear the container
  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3
    .forceSimulation(graph.nodes)
    .force(
      "link",
      d3
        .forceLink(graph.links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Detect bidirectional links
  const linkMap = new Set();
  graph.links.forEach((link) => {
    linkMap.add(`${link.source}-${link.target}`);
  });

  const linkWithDirection = graph.links.map((link) => {
    const isBidirectional = linkMap.has(`${link.target}-${link.source}`);
    return { ...link, isBidirectional };
  });

  const link = svg
    .selectAll(".link")
    .data(linkWithDirection)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#bbbbbb")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");

  let edgeLabels = null;
  if (algorithmName === "Prim" || algorithmName === "Kruskal") {
    edgeLabels = svg
      .selectAll(".edge-label")
      .data(linkWithDirection)
      .enter()
      .append("text")
      .attr("class", "edge-label")
      .attr("dy", 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#bbbbbb")
      .style("pointer-events", "none")
      .style("font-weight", "bold")
      .style("font-size", "18px")
      .text((d) => d.weight ?? "not found");
  }

  const node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#bbbbbb")
    .attr("stroke", "#1f1f1f")
    .attr("stroke-width", 1.5)
    .call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  const labels = svg
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((d) => d.id);

  simulation.on("tick", () => {
    link.attr("d", (d) => curvedPath(d, d.isBidirectional));
    if (edgeLabels && (algorithmName === "Prim" || algorithmName === "Kruskal")) {
      edgeLabels
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);
    }

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });
};

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
