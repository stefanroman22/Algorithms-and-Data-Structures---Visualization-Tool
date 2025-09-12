import * as d3 from "d3";
import { showErrorPopup } from "../../../utils/displayAlert";

/**
 * Parses a user input string of numbers separated by commas and updates the visualization accordingly.
 *
 * This function:
 * - Retrieves input and visualization DOM elements by their IDs.
 * - Clears the console for fresh logs.
 * - Validates the input format (numbers separated by commas, allowing decimals and negatives).
 * - Handles empty input gracefully by clearing the visualization.
 * - Converts the validated input string into a number array.
 * - Updates state variables to reflect parsing status and the parsed array.
 * - Calls appropriate functions to create or update the data structure visualization.
 *
 * @param inputFieldId - The ID of the input HTML element containing the user's string input.
 * @param visualizationBoxId - The ID of the container where the visualization will be rendered.
 * @param setParseInputPressed - Setter function to update the state indicating parsing was attempted.
 * @param setArray - Setter function to update the state with the parsed number array.
 * @param dataStructureName - A string indicating which data structure visualization to create/update.
 */
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
    createLinearDataStructure([], visualizationBoxElement, dataStructureName);
    return;
  }

  // ✅ Validate format: only numbers separated by commas (e.g., "1,2,3,4")
  const isValidFormat = /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*$/.test(arrayInput);

  if (!isValidFormat) {
    console.error(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    showErrorPopup(
      "Invalid input format. Please enter numbers separated by commas (e.g., 1,2,3,4)."
    );
    return;
  }

  const numberArray = arrayInput.split(",").map(Number);

  // Update state
  setArray(numberArray);
  setParseInputPressed(true);

  createAdditionalDataStructure(numberArray, visualizationBoxElement, dataStructureName);
};

/**
 * Creates a D3.js visualization of a linear data structure (Stack, Array, or Queue) inside a given container.
 * 
 * - Clears any previous visualization from the container.
 * - Renders the data as SVG rectangles with corresponding values.
 * - For Stack, displays elements vertically stacked.
 * - For Array and Queue, displays elements horizontally.
 * - Adds index labels for Array elements.
 * - Adds "head" and "tail" labels for Queue elements.
 * - Uses smooth opacity transitions for appearance.
 * 
 * @param data - Array of numbers representing the data structure elements.
 * @param container - DOM element container where the visualization SVG will be appended.
 * @param dataStructureType - Type of data structure to visualize: "Stack", "Array", or "Queue".
 * @returns The D3 selection of the created SVG element.
 */
const createAdditionalDataStructure = (data, container, dataStructureType) => {
  if (!container) {
    console.error("Visualization container not found!");
    return;
  }

  // Clear previous SVG
  container.innerHTML = "";

  const boxSize = 50;
  const spacing = 10;
  const displayData = data.length !== 0 ? data : [];

  const containerWidth = container.clientWidth || 600;
  const containerHeight = container.clientHeight || 400;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);

  if (dataStructureType === "Stack") {
    // Stack visualization (vertical)
    const totalHeight = displayData.length * boxSize + (displayData.length - 1) * spacing;
    const startX = (containerWidth - boxSize) / 2;
    const startY = containerHeight - totalHeight - 20;

    svg
      .selectAll(".rect")
      .data(displayData, (d, i) => d + "-" + i)
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

    svg
      .selectAll(".value")
      .data(displayData, (d, i) => d + "-" + i)
      .enter()
      .append("text")
      .attr("class", "value")
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
  } else {
    // Array or Queue visualization (horizontal)
    const totalWidth = displayData.length * boxSize + (displayData.length - 1) * spacing;
    const startX = (containerWidth - totalWidth) / 2;
    const startY = (containerHeight - boxSize) / 2;

    svg
      .selectAll(".rect")
      .data(displayData, (d, i) => d + "-" + i)
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
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    svg
      .selectAll(".value")
      .data(displayData, (d, i) => d + "-" + i)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
      .attr("y", startY + boxSize / 2 + 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("fill", "#000")
      .style("opacity", 0)
      .text((d) => (d !== null ? d : ""))
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Special labels for Array or Queue
    if (dataStructureType === "Array") {
      svg
        .selectAll(".label")
        .data(displayData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
        .attr("y", startY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "#F69228")
        .style("opacity", 0)
        .text((_, i) => i)
        .transition()
        .duration(500)
        .style("opacity", 1);
    } else {
      // For queues, label head and tail
      if (displayData.length > 1) {
        svg
          .selectAll(".label")
          .data([displayData[0], displayData[displayData.length - 1]])
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("x", (d, i) =>
            i === 0
              ? startX + 0 * (boxSize + spacing) + boxSize / 2
              : startX + (displayData.length - 1) * (boxSize + spacing) + boxSize / 2
          )
          .attr("y", startY - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "#F69228")
          .style("opacity", 0)
          .text((_, i) => (i === 0 ? "head" : "tail"))
          .transition()
          .duration(500)
          .style("opacity", 1);
      } else if (displayData.length === 1) {
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", startX + boxSize / 2)
          .attr("y", startY - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "#F69228")
          .style("opacity", 0)
          .text("tail")
          .transition()
          .duration(500)
          .style("opacity", 1);
      }
    }
  }

  return svg;
};
