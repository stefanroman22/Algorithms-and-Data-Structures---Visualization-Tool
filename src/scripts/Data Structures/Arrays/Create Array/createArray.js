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
    createLinearDataStructure([], visualizationBoxElement, dataStructureName);
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

  createAdditionalDataStructure(numberArray, visualizationBoxElement, dataStructureName);
};

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
