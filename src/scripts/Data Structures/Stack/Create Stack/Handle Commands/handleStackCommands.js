import * as d3 from "d3";

export const handleStackCommands = (
  command,
  stack,
  parseInputPressed,
  pushValue,
  setStack
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
      case "Push":
        pushCommand(pushValue, stack, setStack, visualizationBoxElement, svg);
        break;
      case "Pop":
        popCommand(stack, setStack, svg);
        break;
      case "Top":
        topCommand(stack, svg);
        break;
      case "isEmpty":
        isEmptyCommand(stack);
        break;
      default:
        console.warn(`Command "${command}" not implemented yet.`);
    }
  }
};

export const pushCommand = (
  pushValue,
  stack,
  setStack,
  visualizationBoxElement,
  svg
) => {
  if (!pushValue || isNaN(pushValue)) {
    alert("Please enter a valid number to append.");
    return;
  }

  const newValue = Number(pushValue);
  const newStack = [...stack, newValue];
  setStack(newStack); // Update state

  const boxSize = 50;
  const spacing = 10;
  const containerWidth = visualizationBoxElement.clientWidth || 400;
  const containerHeight = visualizationBoxElement.clientHeight || 400;

  // Calculate new position
  const startX = (containerWidth - boxSize) / 2;
  const newY = containerHeight - (newStack.length) * (boxSize + spacing);

  // Append new rectangle
  svg
    .append("rect")
    .attr("class", "rect")
    .attr("x", startX)
    .attr("y", newY + boxSize + spacing) // Start from below
    .attr("width", boxSize)
    .attr("height", boxSize)
    .attr("fill", "#bfbfbf")
    .attr("stroke", "#0e1111")
    .attr("stroke-width", 2)
    .style("opacity", 0)
    .transition()
    .duration(500)
    .attr("y", newY) // Move to correct position
    .style("opacity", 1);

  // Append new text
  svg
    .append("text")
    .attr("class", "stack-value")
    .attr("x", startX + boxSize / 2)
    .attr("y", newY + boxSize / 2 + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "#232b2b")
    .style("opacity", 0)
    .text(newValue)
    .transition()
    .duration(500)
    .style("opacity", 1);

    console.log(`Stack after Push with value=${pushValue}: ${newStack.reverse}`);
};

export const popCommand = (
  stack, 
  setStack, 
  svg
) => {
  if(stack.length === 0){
    alert("Cannot compute Pop command since stack is empty.");
    return;
  }

  const lastIndex = stack.length - 1;
  const lastRect = svg.selectAll(".rect").filter((d, i) => i === lastIndex);
  const lastText = svg.selectAll(".stack-value").filter((d, i) => i === lastIndex);

  // Change the color of the last element before removal
  lastRect.transition()
    .duration(300)
    .attr("fill", "#ff4d4d") // Red color to indicate removal
    .on("end", () => {
      lastRect.transition().duration(3000).style("opacity", 0).remove();
      lastText.transition().duration(3000).style("opacity", 0).remove();
      
      // Update state
      const newStack = stack.slice(0, -1);
      setStack(newStack);
    });
};

export const topCommand = (stack, svg) => {
  if (stack.length === 0) {
    alert("The stack is empty. Cannot compute Top.");
    return;
  }

  const boxSize = 50;
  const enlargedSize = boxSize + 10;
  const lastIndex = stack.length - 1;

  const lastRect = svg.selectAll(".rect").filter((d, i) => i === lastIndex);
  const lastText = svg.selectAll(".array-value").filter((d, i) => i === lastIndex);

  // Highlight and enlarge the top element
  lastRect.transition()
    .duration(500)
    .attr("fill", "#F69228")
    .attr("width", enlargedSize)
    .attr("height", enlargedSize)
    .transition()
    .duration(600)
    .attr("fill", "#bfbfbf")
    .attr("width", boxSize)
    .attr("height", boxSize);

  // Enlarge and reset text size (if applicable)
  lastText.transition()
    .duration(500)
    .attr("font-size", "28px")
    .transition()
    .duration(600)
    .attr("font-size", "20px");
};


export const isEmptyCommand = (
  stack
) => {
  if (stack.length === 0) {
    alert("Stack is empty!");
    return;
  } else {
    alert(`Stack is not empty, it has ${stack.length} elements, namely: ${stack.slice().reverse().join(", ")}`);
    return;
  }
};

