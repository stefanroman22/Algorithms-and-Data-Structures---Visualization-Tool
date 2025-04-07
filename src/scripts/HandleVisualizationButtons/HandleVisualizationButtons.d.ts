/**
 * Declares the `HandleVisualizationButtons` function.
 */
export default function HandleVisualizationButtons(): {
    handleParseGraph: (algorithmName) => void;
    handleStart: (algorithmName) => void;
    handlePause: () => void;
    handleRestart: (algorithmName) => Promise<void>;
  };
  