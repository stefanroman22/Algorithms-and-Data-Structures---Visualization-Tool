import * as d3 from "d3";
import { isEmptyCommand } from "../../Stack/Create Stack/Handle Commands/handleStackCommands";
import { showErrorPopup } from "../../../utils/displayAlert";
export const handleQueueCommands = (
  command,
  queue,
  parseInputPressed,
  enqueueValue,
  setQueue
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
    showErrorPopup("Please parse the input before!");
    return;
  } else {
    switch (command) {
      case "Enqueue":
        enqueueCommand(enqueueValue, queue, setQueue, visualizationBoxElement, svg);
        break;
      case "Dequeue":
        dequeueCommand(queue, setQueue, visualizationBoxElement, svg);
        break;
      case "Peek Head":
        peekHeadCommand(queue, svg);
        break;
      case "Peek Tail":
        peekTailCommand(queue, svg);
        break;
      case "isEmpty":
        isEmptyCommand(queue);
      default:
        console.warn(`Command "${command}" not implemented yet.`);
    }
  }
};

const boxSize = 50;
const spacing = 10;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delay = 500;

export const enqueueCommand = (
  enqueueValue,
  queue,
  setQueue,
  visualizationBoxElement,
  svg
) => {
  if (!enqueueValue || isNaN(enqueueValue)) {
    showErrorPopup("Please enter a valid number to enqueue.");
    return;
  }

  const newValue = Number(enqueueValue);
  const newQueue = [...queue, newValue]; // Add element at the end (FIFO)
  setQueue(newQueue); // Update state

  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 100;

  // **Recalculate total width of boxes based on new queue length**
  const totalBoxesWidth =
    newQueue.length * boxSize + (newQueue.length - 1) * spacing;
  const startX = (containerWidth - totalBoxesWidth) / 2;
  const startY = (containerHeight - boxSize) / 2;

  // **Update rectangles (Queue elements)**
  svg
    .selectAll(".rect")
    .data(newQueue, (d, i) => d + "-" + i)
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

  // **Update text values inside queue boxes**
  svg
    .selectAll(".value")
    .data(newQueue, (d, i) => d + "-" + i)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("class", "value")
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

  // **Update index labels (Only head and tail)**
  svg.selectAll(".label").remove(); // Remove old labels

  if (newQueue.length > 0) {
    // Assign "head" label to new first element
    svg
      .append("text")
      .attr("class", "label")
      .attr("x", startX + boxSize / 2)
      .attr("y", startY - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("fill", "rgb(233, 126, 10)")
      .style("opacity", 0)
      .text("head")
      .transition()
      .duration(500)
      .style("opacity", 1);

    // If more than one element remains, assign "tail" label to the last element
    if (newQueue.length > 1) {
      svg
        .append("text")
        .attr("class", "label")
        .attr(
          "x",
          startX + (newQueue.length - 1) * (boxSize + spacing) + boxSize / 2
        )
        .attr("y", startY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "rgb(233, 126, 10)")
        .style("opacity", 0)
        .text("tail")
        .transition()
        .duration(500)
        .style("opacity", 1);
    }
  }

  console.log(`Queue after Enqueue with value=${enqueueValue}: ${newQueue}`);
};

export const dequeueCommand = async (
  queue,
  setQueue,
  visualizationBoxElement,
  svg
) => {
  if (queue.length === 0) {
    showErrorPopup("The queue is empty. Cannot compute Dequeue.");
    return;
  }

  const firstIndex = 0; // The first element (head)
  const firstRect = svg.selectAll(".rect").filter((_, i) => i === firstIndex);
  const firstText = svg.selectAll(".value").filter((_, i) => i === firstIndex);
  const headIndex = svg.selectAll(".label").filter((_, i) => i === firstIndex);

  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 100;

  // **Compute new queue after removal**
  const newQueue = queue.slice(1); // Remove the first element

  // **Recalculate positions for remaining elements**
  const totalBoxesWidth =
    newQueue.length * boxSize + (newQueue.length - 1) * spacing;
  const startX = (containerWidth - totalBoxesWidth) / 2;
  const startY = (containerHeight - boxSize) / 2;

  // **Animate removal of the first element**
  firstRect
    .transition()
    .duration(600)
    .attr("fill", "#ff4d4d") // Change to red before removal
    .style("opacity", 0)
    .on("end", function () {
      d3.select(this).remove(); // Ensure element is fully removed
    });

    await sleep(delay)

  firstText
    .transition()
    .duration(300)
    .style("opacity", 0)
    .on("end", function () {
      d3.select(this).remove();
    });

  headIndex
    .transition()
    .duration(300)
    .style("opacity", 0)
    .on("end", function () {
      d3.select(this).remove();
    });

  // **Ensure Remaining Elements Move Left**
  svg
    .selectAll(".rect")
    .filter((_, i) => i !== firstIndex) // Exclude the first element
    .transition()
    .duration(300)
    .attr("x", (d, i) => startX + i * (boxSize + spacing));

  svg
    .selectAll(".value")
    .filter((_, i) => i !== firstIndex) // Exclude the first element
    .transition()
    .duration(300)
    .attr("x", (d, i) => startX + i * (boxSize + spacing) + boxSize / 2);

  // **Wait for animations to complete before updating queue state**
  setTimeout(() => {
    setQueue(newQueue); // Update queue state

    // **Remove all previous head/tail labels before reassigning**
    svg.selectAll(".label").remove();

    // **Reassign "head" to the new first element**
    if (newQueue.length > 0) {
      svg
        .append("text")
        .attr("class", "label")
        .attr("x", startX + boxSize / 2)
        .attr("y", startY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "rgb(233, 126, 10)")
        .style("opacity", 0)
        .text("head")
        .transition()
        .duration(500)
        .style("opacity", 1);

      // **If more than one element remains, reassign "tail" to last element**
      if (newQueue.length > 1) {
        svg
          .append("text")
          .attr("class", "label")
          .attr(
            "x",
            startX + (newQueue.length - 1) * (boxSize + spacing) + boxSize / 2
          )
          .attr("y", startY - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "rgb(233, 126, 10)")
          .style("opacity", 0)
          .text("tail")
          .transition()
          .duration(500)
          .style("opacity", 1);
      }
    }
  }, 300); // Wait for animations before updating queue
};

export const peekHeadCommand = (
  queue,
  svg
) => {
  if(queue.length === 0){
    showErrorPopup("The stack is empty. Cannot compute Peek Head.");
    return;
  };
  const firstRect = svg.selectAll(".rect").filter((d, i) => i === 0);
  const boxSize = 50;
  const enlargedSize = boxSize + 5;
  // Change the color of the last element temporarily
  firstRect.transition()
    .duration(500)
    .attr("fill", "rgb(255, 142, 22)") // Highlight color
    .attr("width", enlargedSize)
    .attr("height", enlargedSize)
    .transition()
    .duration(600)
    .attr("fill", "#bfbfbf") // Reset color
    .attr("width", boxSize)
    .attr("height", boxSize);
}

export const peekTailCommand = (
  queue,
  svg
) => {
  if(queue.length === 0){
    showErrorPopup("The queue is empty. Cannot compute Peek Tail.");
    return;
  };
  const lastRect = svg.selectAll(".rect").filter((d, i) => i === queue.length - 1);
  const boxSize = 50;
  const enlargedSize = boxSize + 5;
  // Change the color of the last element temporarily
  lastRect.transition()
    .duration(500)
    .attr("fill", "rgb(255, 142, 22)") // Highlight color
    .attr("width", enlargedSize)
    .attr("height", enlargedSize)
    .transition()
    .duration(600)
    .attr("fill", "#bfbfbf") // Reset color
    .attr("width", boxSize)
    .attr("height", boxSize);
}