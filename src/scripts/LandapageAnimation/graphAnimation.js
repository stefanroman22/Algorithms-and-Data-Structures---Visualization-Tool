import * as d3 from "d3";

export function initGraphAnimation(containerId) {
  // Clear any existing SVG in the container
  d3.select(`#${containerId}`).selectAll("*").remove();

  const svgSize = 550; // Define the size of the circular SVG
  let radius = svgSize / 2; // Radius of the circular SVG

  // Set up the SVG with a circular clip path
  const svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", svgSize)
    .attr("height", svgSize)
    .append("g");

  // Add a circular clip path
  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip-circle")
    .append("circle")
    .attr("cx", radius)
    .attr("cy", radius)
    .attr("r", radius);

  // Apply the clip path to the SVG content
  svg.attr("clip-path", "url(#clip-circle)");

  // Parameters
  const numberNodes = 90; // Total number of nodes
  const radiusNode = 10; // Radius of each node
  const minDistance = 20; // Minimum distance between nodes
  const speed = 0.6; // Maximum speed for node movement

  const palette = [
    "#9eccb1",
    "#f8b234",
    "#00ebbe",
    "#f9edc6",
    "#e75f3f",
    "#0f64d2",
    "#0c6d49",
  ];

  const getDistance = (x1, y1, x2, y2) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const getPaletteColor = () =>
    palette[Math.floor(Math.random() * palette.length)];

  const nodes = [];
  while (nodes.length < numberNodes) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (radius - radiusNode);
    const x = radius + Math.cos(angle) * distance;
    const y = radius + Math.sin(angle) * distance;

    const isOverlapping = nodes.some(
      (node) => getDistance(x, y, node.x, node.y) < minDistance
    );

    const color = getPaletteColor();

    if (!isOverlapping && color !== "#000000") {
      nodes.push({
        id: nodes.length + 1,
        x,
        y,
        color,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      });
    }
  }

  const links = [];
  const numLinks = Math.min(200, nodes.length * 2);
  for (let i = 0; i < numLinks; i++) {
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    const target = nodes[Math.floor(Math.random() * nodes.length)];
    if (source !== target) {
      links.push({ source, target });
    }
  }

  const linkElements = svg
    .selectAll(".link") // Select all elements with the class "link" (initially none exist)
    .data(links) // Bind the `links` data array to these elements
    .enter() // Create a placeholder for each data point (link) that doesn’t have a corresponding DOM element
    .append("line") // Append a new `<line>` element for each placeholder
    .attr("class", "link") // Assign the class "link" to the created elements for styling and future selection
    .attr("stroke", "#cccccc") // Set the stroke color of the lines
    .attr("stroke-width", 1); // Set the width of the lines

  const nodeElements = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", radiusNode)
    .style("fill", (d) => d.color)
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  function dragStarted(event, d) {
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x; // Fix the position to follow the mouse
    d.fy = event.y;
    d.x = d.fx;
    d.y = d.fy;

    // Define the interaction radius for the dragged node
    const interactionRadius = 100; // Larger radius for impact area

    // Push nearby nodes dynamically
    nodes.forEach((node) => {
      if (node !== d) {
        const distance = getDistance(d.x, d.y, node.x, node.y);

        if (distance < interactionRadius) {
          // If within the interaction radius
          const angle = Math.atan2(node.y - d.y, node.x - d.x);
          const overlap = interactionRadius - distance;

          // Apply a stronger push for closer nodes
          const force = Math.min(overlap / interactionRadius, 1); // Normalize the force
          node.x += Math.cos(angle) * overlap * force * 0.3;
          node.y += Math.sin(angle) * overlap * force * 0.3;

          // Constrain nodes to the circular boundary
          constrainToCircle(node);
        }
      }
    });

    // Update node positions dynamically
    updateNodePositions();
    updateLinkPositions();
  }

  function dragEnded(event, d) {
    d.fx = null;
    d.fy = null;
  }

  function updateNodePositions() {
    nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  function updateLinkPositions() {
    linkElements
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }

  function constrainToCircle(node) {
    const distanceFromCenter = getDistance(node.x, node.y, radius, radius);
    const maxDistance = radius - radiusNode;

    if (distanceFromCenter > maxDistance) {
      const angle = Math.atan2(node.y - radius, node.x - radius);
      node.x = radius + Math.cos(angle) * maxDistance;
      node.y = radius + Math.sin(angle) * maxDistance;
      node.vx *= -1;
      node.vy *= -1;
    }
  }

  d3.timer(() => {
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      constrainToCircle(node);
    });

    updateNodePositions();
    updateLinkPositions();
  });

  window.addEventListener('resize', () => {
    const container = d3.select(`#${containerId}`);
    const newSvgSize = container.node().clientWidth; // Get the new size of the container
    const newRadius = newSvgSize / 2;

    // Update the SVG size and clip-path
    d3.select(`#${containerId} svg`)
        .attr("width", newSvgSize)
        .attr("height", newSvgSize);

    d3.select(`#${containerId} #clip-circle circle`)
        .attr("cx", newRadius)
        .attr("cy", newRadius)
        .attr("r", newRadius);

    // Update the radius for node constraints
    radius = newRadius;

    // Reposition nodes within the updated circle
    nodes.forEach(constrainToCircle);
    updateNodePositions();
    updateLinkPositions();
});

}
