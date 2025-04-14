import * as d3 from "d3";

export const handleArrayCommands = (
  command,
  array,
  parseInputPressed,
  appendValue,
  deleteIndex,
  updateIndex,
  updateValue,
  searchValue,
  setArray
) => {
  const visualizationBoxElement = document.getElementById(
    "visualization-box-data-structures"
  );
  if (!visualizationBoxElement) {
    console.error("Visualization container not found!");
    return;
  }

  // Select the existing svg inside the visualization box
  const svg = d3.select(visualizationBoxElement).select("svg");

  console.log("Command:", command);

  if (!parseInputPressed) {
    alert("Please parse the input before!");
    return;
  } else {
    switch (command) {
      case "Append":
        appendCommand(
          appendValue,
          array,
          setArray,
          visualizationBoxElement,
          svg
        );
        break;
      case "Delete":
        deleteCommand(
          deleteIndex,
          array,
          setArray,
          visualizationBoxElement,
          svg
        );
        break;
      case "Update":
        updateCommand(
          updateIndex,
          updateValue,
          array,
          setArray,
          visualizationBoxElement,
          svg
        );
        break;
      case "Min":
        minCommand(array, svg);
        break;
      case "Max":
        maxCommand(array, svg);
        break;
      case "Search":
        searchCommand(searchValue, array, svg);
        break;
      default:
        console.warn(`Command "${command}" not implemented yet.`);
    }
  }
};

const boxSize = 50;
const spacing = 10;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delay = 500;

export const appendCommand = (
  appendValue,
  array,
  setArray,
  visualizationBoxElement,
  svg
) => {
  if (!appendValue || isNaN(appendValue)) {
    alert("Please enter a valid number to append.");
    return;
  }

  const newValue = Number(appendValue);
  const newArray = [...array, newValue];
  setArray(newArray); // Update state

  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 100;

  // **Recalculate total width of boxes based on new array length**
  const totalBoxesWidth =
    newArray.length * boxSize + (newArray.length - 1) * spacing;
  const startX = (containerWidth - totalBoxesWidth) / 2;
  const startY = (containerHeight - boxSize) / 2;

  // **Rebind all elements using `.join()` to properly handle enter/update/exit**

  // **Update rectangles**
  const rects = svg
    .selectAll(".rect")
    .data(newArray, (d, i) => d + "-" + i)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "rect")
          .attr("x", (d, i) => startX + i * (boxSize + spacing))
          .attr("y", startY)
          .attr("width", boxSize)
          .attr("height", boxSize)
          .attr("fill", "#bfbfbf")
          .attr("stroke", "#0e1111")
          .attr("stroke-width", 2)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1),
      (update) =>
        update
          .transition()
          .duration(500)
          .attr("x", (d, i) => startX + i * (boxSize + spacing))
    );

  // **Update text values**
  const textValues = svg
    .selectAll(".array-value")
    .data(newArray, (d, i) => d + "-" + i)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "array-value")
          .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
          .attr("y", startY + boxSize / 2 + 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "20px")
          .attr("fill", "#232b2b")
          .style("opacity", 0)
          .text((d) => d)
          .transition()
          .duration(500)
          .style("opacity", 1),
      (update) =>
        update
          .transition()
          .duration(500)
          .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
          .text((d) => d)
    );

  // **Update index labels**
  const textIndexes = svg
    .selectAll(".array-index")
    .data(newArray, (d, i) => d + "-" + i)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "array-index")
          .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
          .attr("y", startY - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "rgb(233, 126, 10)")
          .style("opacity", 0)
          .text((_, i) => i)
          .transition()
          .duration(500)
          .style("opacity", 1),
      (update) =>
        update
          .transition()
          .duration(500)
          .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
          .text((_, i) => i)
    );

  console.log(`Array after Append with value=${appendValue}: ${newArray}`);
};

export const deleteCommand = async (
  deleteIndex,
  array,
  setArray,
  visualizationBoxElement,
  svg
) => {
  if (array.length === 0) {
    alert("The array is empty. Cannot compute Delete.");
    return;
  }
  if (!deleteIndex || isNaN(deleteIndex)) {
    alert("Please enter a valid index to delete.");
    return;
  }
  if (deleteIndex < 0 || deleteIndex >= array.length) {
    alert("Invalid index. Please enter a valid index to delete.");
    return;
  }

  // Copy array and modify
  const newArray = [...array];
  newArray.splice(deleteIndex, 1); // Removes the element at deleteIndex
  setArray(newArray); // Update state
  console.log("New Array after Deletion:", newArray);

  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 100;

  // **Recalculate new positions**
  const totalBoxesWidth =
    newArray.length * boxSize + (newArray.length - 1) * spacing;
  const startX = (containerWidth - totalBoxesWidth) / 2;
  const startY = (containerHeight - boxSize) / 2;

  // **Step 1: Fade out and remove old elements before rerendering**
  await Promise.all([
    new Promise((resolve) => {
      svg
        .selectAll(".rect, .array-value, .array-index")
        .transition()
        .duration(300)
        .style("opacity", 0)
        .on("end", function () {
          d3.select(this).remove(); // Remove each element after fade-out
          resolve();
        });
    }),
  ]);

  // **Step 2: Rebind data and rerender elements smoothly**

  // Bind data to rectangles
  svg
    .selectAll(".rect")
    .data(newArray, (d, i) => d + "-" + i) // Unique key for smooth transitions
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr("x", (d, i) => startX + i * (boxSize + spacing))
    .attr("y", startY)
    .attr("width", boxSize)
    .attr("height", boxSize)
    .attr("fill", "#bfbfbf")
    .attr("stroke", "#0e1111")
    .attr("stroke-width", 2)
    .style("opacity", 0) // Start invisible
    .transition() // Apply transition
    .duration(500) // 0.5s animation
    .style("opacity", 1); // Fade-in effect

  // Bind data to text elements inside rectangles
  svg
    .selectAll(".array-value")
    .data(newArray, (d, i) => d + "-" + i)
    .enter()
    .append("text")
    .attr("class", "array-value")
    .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
    .attr("y", startY + boxSize / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "#232b2b")
    .style("opacity", 0) // Start invisible
    .text((d) => (d !== null ? d : ""))
    .transition() // Apply transition
    .duration(500) // 0.5s animation
    .style("opacity", 1); // Fade-in effect

  // Bind data to index labels above rectangles
  svg
    .selectAll(".array-index")
    .data(newArray)
    .enter()
    .append("text")
    .attr("class", "array-index")
    .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2)
    .attr("y", startY - 10) // Adjust Y position above rectangles
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .attr("fill", "rgb(233, 126, 10)")
    .style("opacity", 0)
    .text((_, i) => i) // Use index instead of value
    .transition()
    .duration(500)
    .style("opacity", 1);

  return svg;
};

export const updateCommand = async (
  updateIndex,
  updateValue,
  array,
  setArray,
  visualizationBoxElement,
  svg
) => {
  // **Exception Handling**
  if (array.length === 0) {
    alert("The array is empty. Cannot update any element.");
    return;
  }

  if (updateIndex < 0 || updateIndex >= array.length || isNaN(updateIndex)) {
    alert("Invalid index. Please enter a valid index within the array range.");
    return;
  }

  if (!updateValue || isNaN(updateValue)) {
    alert("Invalid update value. Please enter a valid number.");
    return;
  }

  const newValue = Number(updateValue);

  // **Copy array and update the specified index**
  const newArray = [...array];
  newArray[updateIndex] = newValue;
  setArray(newArray); // Update state

  console.log(`Array after Update: ${newArray}`);

  // **Temporarily change rectangle color to highlight the update**
  svg
    .selectAll(".rect")
    .filter((d, i) => i === updateIndex)
    .transition()
    .duration(300)
    .attr("fill", "#F69228") // Pallet Orange
    .transition()
    .delay(1000) // Keep color for 1s
    .duration(500)
    .attr("fill", "#bfbfbf"); // Restore original color

  // **Update text value inside rectangle**
  svg
    .selectAll(".array-value")
    .filter((d, i) => i === updateIndex)
    .transition()
    .duration(500)
    .text(newValue);

  console.log(`Updated index ${updateIndex} to value ${newValue}`);
};

export const minCommand = async (array, svg) => {
  if (array.length === 0) {
    alert("The array is empty. Cannot compute Min.");
    return;
  }

  const minValue = Math.min(...array);
  const minIndex = array.indexOf(minValue);
  const boxSize = 50;
  const enlargedSize = boxSize + 5;

  console.log(`Min Value: ${minValue} at Index: ${minIndex}`);

  // Animate the rectangle
  svg
    .selectAll(".rect")
    .filter((d, i) => i === minIndex)
    .transition()
    .duration(300)
    .attr("fill", "#F69228")
    .attr("width", enlargedSize)
    .attr("height", enlargedSize)
    .transition()
    .delay(1000)
    .duration(500)
    .attr("fill", "#bfbfbf")
    .attr("width", boxSize)
    .attr("height", boxSize)

  // Animate the corresponding text
  svg
    .selectAll(".array-value")
    .filter((d, i) => i === minIndex)
    .transition()
    .duration(300)
    .attr("font-size", "25px")
    .attr("text-anchor", "middle")
    .transition()
    .delay(1000)
    .duration(500)
    .attr("font-size", "20px")
};


export const maxCommand = async (array, svg) => {
  if (array.length === 0) {
    alert("The array is empty. Cannot compute Min.");
    return;
  }

  const maxValue = Math.max(...array);
  const maxIndex = array.indexOf(maxValue);
  const boxSize = 50;
  const enlargedSize = boxSize + 5;

  console.log(`Min Value: ${maxValue} at Index: ${maxIndex}`);

  // Animate the rectangle
  svg
    .selectAll(".rect")
    .filter((d, i) => i === maxIndex)
    .transition()
    .duration(300)
    .attr("fill", "#F69228")
    .attr("width", enlargedSize)
    .attr("height", enlargedSize)
    .transition()
    .delay(1000)
    .duration(500)
    .attr("fill", "#bfbfbf")
    .attr("width", boxSize)
    .attr("height", boxSize)

  // Animate the corresponding text
  svg
    .selectAll(".array-value")
    .filter((d, i) => i === minIndex)
    .transition()
    .duration(300)
    .attr("font-size", "25px")
    .attr("text-anchor", "middle")
    .transition()
    .delay(1000)
    .duration(500)
    .attr("font-size", "20px")
};

export const searchCommand = async (searchValue, array, svg) => {
  if (array.length === 0) {
    alert("The array is empty. Cannot compute Search.");
    return;
  }

  if (!searchValue || isNaN(searchValue)) {
    alert("Please enter a valid number to search.");
    return;
  }

  let found = false;
  const boxSize = 50;
  const enlargedSize = boxSize + 5;

  for (let i = 0; i < array.length; i++) {
    let rect = svg.selectAll(".rect").filter((d, index) => index === i);
    let text = svg.selectAll(".array-value").filter((d, index) => index === i);

    // Highlight and enlarge temporarily
    await rect.transition()
      .duration(300)
      .attr("fill", "#F69228")
      .attr("width", enlargedSize)
      .attr("height", enlargedSize);

    await text.transition()
      .duration(300)
      .attr("font-size", "28px");

    await sleep(800);

    if (array[i] === Number(searchValue)) {
      // Found: keep enlarged and change color
      await rect.transition()
        .duration(300)
        .attr("fill", "rgb(233, 94, 13)");

      await sleep(2500);

      // Reset
      rect.transition()
        .duration(300)
        .attr("fill", "#bfbfbf")
        .attr("width", boxSize)
        .attr("height", boxSize);

      text.transition()
        .duration(300)
        .attr("font-size", "20px");

      found = true;
      break;
    } else {
      // Not found, reset
      rect.transition()
        .duration(300)
        .attr("fill", "#bfbfbf")
        .attr("width", boxSize)
        .attr("height", boxSize);

      text.transition()
        .duration(300)
        .attr("font-size", "20px");
    }
  }

  if (!found) {
    alert(`Element ${searchValue} not found in the array.`);
  }
};
