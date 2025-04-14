import * as d3 from "d3";

export const handleParseInput = (
  inputFieldId,
  visualizationBoxId,
  setParseInputPressed,
  setArray,
  dataStructureName
) => {
  console.clear();

  const inputElement = document.getElementById(inputFieldId);
  const visualizationBoxElement = document.getElementById(visualizationBoxId);

  if (!inputElement) {
    console.error(`Element with ID "${inputFieldId}" not found.`);
    return;
  }

  let arrayInput = inputElement.value.trim(); // Remove leading/trailing spaces
  console.log(arrayInput);

  // ✅ Allow empty input (no error)
  if (arrayInput === "") {
    setArray([]); // Update state
    setParseInputPressed(true);
    createArray([], visualizationBoxElement);
    return;
  }

  // ✅ Validate format: only numbers separated by commas (e.g., "1,2,3,4")
  const isValidFormat = /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*$/.test(arrayInput);

  if (!isValidFormat) {
    console.error(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    alert(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    return;
  }

  const numberArray = arrayInput.split(",").map(Number);

  // Update state
  setArray(numberArray);
  setParseInputPressed(true);

  createArray(numberArray, visualizationBoxElement, dataStructureName);
};

const createArray = (
  numberArray,
  visualizationBoxElement,
  dataStructureName
) => {
  if (!visualizationBoxElement) {
    console.error("Visualization container not found!");
    return;
  }

  // Clear previous SVG
  visualizationBoxElement.innerHTML = "";

  const boxSize = 50;
  const spacing = 10;
  const displayArray = numberArray.length !== 0 ? numberArray : [];

  // Get container width & height
  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 100;

  // Recalculate total width of boxes
  const totalBoxesWidth =
    displayArray.length * boxSize + (displayArray.length - 1) * spacing;

  // Center the boxes dynamically
  const startX = (containerWidth - totalBoxesWidth) / 2;
  const startY = (containerHeight - boxSize) / 2;

  // Create the SVG container
  const svg = d3
    .select(visualizationBoxElement)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);

  // Bind data to rectangles
  svg
    .selectAll(".rect")
    .data(displayArray, (d, i) => d + "-" + i) // Unique key for smooth transitions
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("x", (d, i) => startX + i * (boxSize + spacing))
    .attr("y", startY)
    .attr("width", boxSize)
    .attr("height", boxSize)
    .attr("fill", "#bbbbbb")
    .attr("stroke", "#0e1111")
    .attr("stroke-width", 2)
    .style("opacity", 0) // Start invisible
    .transition() // Apply transition
    .duration(500) // 0.5s animation
    .style("opacity", 1); // Fade-in effect

  // Bind data to text elements inside rectangles
  svg
    .selectAll(".array-value")
    .data(displayArray, (d, i) => d + "-" + i)
    .enter()
    .append("text")
    .attr("class", "array-value")
    .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
    .attr("y", startY + boxSize / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "#000")
    .style("opacity", 0) // Start invisible
    .text((d) => (d !== null ? d : ""))
    .transition() // Apply transition
    .duration(500) // 0.5s animation
    .style("opacity", 1); // Fade-in effect

    if (dataStructureName === "Array") {
      svg
        .selectAll(".array-index")
        .data(displayArray)
        .enter()
        .append("text")
        .attr("class", "array-index")
        .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
        .attr("y", startY - 10) // Adjust Y position above rectangles
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "#F69228")
        .style("opacity", 0)
        .text((_, i) => i) // Use index instead of value
        .transition()
        .duration(500)
        .style("opacity", 1);
    } else {

      if (displayArray.length > 1) {
        // Add index only for the first and last elements (head & tail)
        svg
          .selectAll(".array-index")
          .data([displayArray[0], displayArray[displayArray.length - 1]]) // First & last elements
          .enter()
          .append("text")
          .attr("class", "array-index")
          .attr("x", (d, i) => 
            i === 0
              ? startX + 0 * (boxSize + spacing) + boxSize / 2 // Head
              : startX + (displayArray.length - 1) * (boxSize + spacing) + boxSize / 2 // Tail
          )
          .attr("y", startY - 10) // Adjust Y position above rectangles
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "#F69228")
          .style("opacity", 0)
          .text((_, i) => (i === 0 ? "head" : "tail")) // Label first as "head", last as "tail"
          .transition()
          .duration(500)
          .style("opacity", 1);
      } else if (displayArray.length === 1) {
        // If only one element, label it as "tail"
        svg
          .append("text")
          .attr("class", "array-index")
          .attr("x", startX + boxSize / 2)
          .attr("y", startY - 10) // Adjust Y position above rectangles
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "rgb(233, 126, 10)")
          .style("opacity", 0)
          .text("tail") // Only show "tail"
          .transition()
          .duration(500)
          .style("opacity", 1);
      }      
    }
    

  return svg;
};
