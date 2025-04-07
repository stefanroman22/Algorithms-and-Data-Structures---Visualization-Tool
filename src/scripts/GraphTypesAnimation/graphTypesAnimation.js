import * as d3 from "d3";

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
  if (!container) {
    console.error("Graph container is null.");
    return;
  }

  // Clear the previous graph before creating a new one
  d3.select(container).selectAll("*").remove();

  // Define initial graph nodes
  const nodes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

  // Define initial links based on properties
  let links = [
    { source: 1, target: 2, weight: properties.weighted ? 5 : null },
    { source: 2, target: 3, weight: properties.weighted ? 10 : null },
    { source: 3, target: 4, weight: properties.weighted ? 2 : null },
  ];

  // Add an edge (1 → 5) if 'connected' is checked
  if (properties.connected) {
    links.push({
      source: 1,
      target: 5,
      weight: properties.weighted ? 7 : null,
    });
  }

  // Add a cycle (4 → 1) if 'cyclic' is checked
  if (properties.cyclic) {
    links.push({
      source: 4,
      target: 1,
      weight: properties.weighted ? 4 : null,
    });
  }

  // Add a self-loop on node 1 if 'selfLoop' is checked
  if (properties.selfLoop) {
    links.push({
      source: 1,
      target: 1,
      weight: properties.weighted ? 3 : null,
    });
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  // Append an SVG inside the container
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Define a force simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const defs = svg.append("defs");
  // Regular marker for normal edges
  defs
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 26) // Default for straight links
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");

  // Special marker for self-loops
  defs
    .append("marker")
    .attr("id", "self-loop-arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 27) // Adjust refX to position correctly for self-loops
    .attr("refY", -2)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");

  const link = svg
    .selectAll(".link")
    .data(links.filter((d) => d.source !== d.target)) // Exclude self-loops
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5)
    .attr("marker-end", properties.directed ? "url(#arrowhead)" : null);

  // Handle self-loops separately
  const selfLoops = svg
    .selectAll(".self-loop")
    .data(links.filter((d) => d.source === d.target)) // Only self-loops
    .enter()
    .append("path") // ✅ Correct - `path` allows curved edges
    .attr("class", "self-loop")
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round")
    .attr("marker-end", properties.directed ? "url(#self-loop-arrowhead)" : null);

  // Create nodes as circles
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .attr("fill", "#9b9696")
    .attr("stroke", "#3a3838")
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

  // Add labels inside the nodes
  const labels = svg
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .attr("fill", "black")
    .text((d) => d.id);

  // Add weight labels if 'weighted' is checked
  if (properties.weighted) {
    svg
      .selectAll(".weight-label")
      .data(links.filter((d) => d.source !== d.target))
      .enter()
      .append("text")
      .attr("class", "weight-label")
      .attr("dy", 0) // Move the label downward (increase the value for more distance)
      .attr("text-anchor", "middle") // Keep the label centered
      .attr("fill", "#999") // Same color as the edge
      .style("pointer-events", "none") // Prevent interference with interactions
      .style("font-weight", "bold") // Make the text bold
      .style("font-size", "16px") // Optionally increase the font size
      .text((d) => d.weight ?? "not found"); // Use d.weight for the label
    
    svg 
      .selectAll(".weight-label-self-loop")
      .data(links.filter((d) => d.source === d.target))
      .enter()
      .append("text")
      .attr("class", "weight-label-self-loop")
      .attr("dy", -66)
      .attr("text-anchor", "middle") // Keep the label centered
      .attr("fill", "#999") // Same color as the edge
      .style("pointer-events", "none") // Prevent interference with interactions
      .style("font-weight", "bold") // Make the text bold
      .style("font-size", "16px") // Optionally increase the font size
      .text((d) => d.weight ?? "not found"); // Use d.weight for the label
  }

  // Update positions dynamically
  simulation.on("tick", () => {
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels.attr("x", (d) => d.x).attr("y", (d) => d.y + 5);

    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // Update position of weight labels
    svg
      .selectAll(".weight-label")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5);
    
    svg 
      .selectAll(".weight-label-self-loop")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5);

    selfLoops.attr("d", (d) => {
      const r = 60; // Radius of the self-loop
      return `M ${d.source.x} ${d.source.y}
                C ${d.source.x - r} ${d.source.y - r * 1.5}, 
                  ${d.source.x + r} ${d.source.y - r * 1.5}, 
                  ${d.source.x} ${d.source.y}`;
    });
  });

  console.log("Graph successfully created.");
};
