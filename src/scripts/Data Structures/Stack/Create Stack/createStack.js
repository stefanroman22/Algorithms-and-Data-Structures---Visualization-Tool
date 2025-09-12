import * as d3 from "d3";
import { showErrorPopup } from "../../../utils/displayAlert";
export const handleParseInput = (
  inputFieldId,
  visualizationBoxId,
  setParseInputPressed,
  setStack
) => {
  console.clear();

  const inputElement = document.getElementById(inputFieldId);
  const visualizationBoxElement = document.getElementById(visualizationBoxId);

  if (!inputElement) {
    console.error(`Element with ID "${inputFieldId}" not found.`);
    return;
  }

  let stackInput = inputElement.value.trim(); // Remove leading/trailing spaces

  // ✅ Allow empty input (no error)
  if (stackInput === "") {
    setStack([]); // Update state
    setParseInputPressed(true);
    createStack([], visualizationBoxElement);
    return;
  }

  // ✅ Validate format: only numbers separated by commas (e.g., "1,2,3,4")
  const isValidFormat = /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*$/.test(stackInput);

  if (!isValidFormat) {
    console.error(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    showErrorPopup(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    return;
  }

  const numberStack = stackInput.split(",").map(Number);

  // Update state
  setStack(numberStack);
  setParseInputPressed(true);

  createStack(numberStack, visualizationBoxElement);
};

const createStack = (numberStack, visualizationBoxElement) => {
  if (!visualizationBoxElement) {
    console.error("Visualization container not found!");
    return;
  }

  // Clear previous SVG
  visualizationBoxElement.innerHTML = "";

  const boxSize = 50;
  const spacing = 10;
  const displayStack = numberStack.length !== 0 ? numberStack : [];

  // Get container width & height
  const containerWidth = visualizationBoxElement.clientWidth || 200;
  const containerHeight = visualizationBoxElement.clientHeight || 400;

  // Calculate total height of boxes
  const totalBoxesHeight =
    displayStack.length * boxSize + (displayStack.length - 1) * spacing;

  // Center the stack dynamically
  const startX = (containerWidth - boxSize) / 2;
  const startY = containerHeight - totalBoxesHeight - 20;

  // Create the SVG container
  const svg = d3
    .select(visualizationBoxElement)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);

  // Bind data to rectangles
  svg
    .selectAll(".rect")
    .data(displayStack, (d, i) => d + "-" + i)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("x", startX)
    .attr("y", (d, i) => containerHeight - (i + 1) * (boxSize + spacing))
    .attr("width", boxSize)
    .attr("height", boxSize)
    .attr("fill", "#bfbfbf")
    .attr("stroke", "#0e1111")
    .attr("stroke-width", 2)
    .style("opacity", 0)
    .transition()
    .duration(500)
    .style("opacity", 1);

  // Bind data to text elements inside rectangles
  svg
    .selectAll(".stack-value")
    .data(displayStack, (d, i) => d + "-" + i)
    .enter()
    .append("text")
    .attr("class", "stack-value")
    .attr("x", startX + boxSize / 2)
    .attr("y", (d, i) => containerHeight - (i + 1) * (boxSize + spacing) + boxSize / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "#232b2b")
    .style("opacity", 0)
    .text((d) => (d !== null ? d : ""))
    .transition()
    .duration(500)
    .style("opacity", 1);

  return svg;
};
