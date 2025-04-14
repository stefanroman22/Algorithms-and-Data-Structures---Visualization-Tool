// src/utils/updateVisualization.d.ts

/**
 * Updates the content of the specified visualization box element.
 * @param visualizationBoxElement - The HTMLElement representing the visualization box.
 * @param content - The content to display inside the visualization box.
 */
export function updateVisualizationBox(
    visualizationBoxElement: HTMLElement | null,
    graphInputElement: HTMLElement | null,
  ): void;
  

/**
 * Creates a D3.js force-directed graph visualization for bidirectional graphs.
 * @param container - The target container element.
 * @param graph - The parsed graph object containing nodes and links.
 * @param algorithmName - The name of the algorithm for visualization purposes.
 */
export function createD3GraphBasic(
  container: HTMLElement | null,
  graph: {
    nodes: Array<{ id: string }>,
    links: Array<{ source: string; target: string; weight?: number }>
  },
): void;

/**
 * Creates a D3.js force-directed graph visualization for bidirectional graphs.
 * @param container - The target container element.
 * @param graph - The parsed graph object containing nodes and links.
 * @param algorithmName - The name of the algorithm for visualization purposes.
 */
export function createGraphBidirectional(
  container: HTMLElement | null,
  graph: {
    nodes: Array<{ id: string }>,
    links: Array<{ source: string; target: string; weight?: number }>
  },
  algorithmName: string
): void;





/**
 * Highlights a node in the D3 graph visualization.
 * @param container - The container HTMLElement holding the D3 visualization (e.g., the visualization box).
 * @param nodeId - The ID of the node to highlight.
 * @param graphInput - The input of the graoh that has been parsed.
 * @param getPausedRef - Retrieve the paused ref
 * @param currentSimulationId
 * @param getSimulationIdRef
 * @param algorithmName
 */
export function startAlgorithmSimulation(
  container: HTMLElement | null,
  nodeId: string,
  graphInputElement: HTMLElement | null,
  getPausedRef: () => boolean,
  currentSimulationId : number,
  getSimulationIdRef: () => number,
  algorithmName: string,
): void;

