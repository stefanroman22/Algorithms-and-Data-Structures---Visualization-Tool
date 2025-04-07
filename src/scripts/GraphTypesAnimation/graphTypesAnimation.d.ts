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
export function createPropertiesGraph(
  properties: Object,
  visualizationBoxElement: HTMLElement | null
):void 
