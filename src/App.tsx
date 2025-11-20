import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landpage from "./pages/LandPage";
import ContactPage from "./pages/ContactPage";
import TheoryPage from "./pages/TheoryPage";
import VisualizerTool from "./pages/VisualizerToolAlgorithmListPage";
import DFSPage from "./pages/DFSPage";
import BFSPage from "./pages/BFSPage";
import DijkstraPage from "./pages/DijkstraPage";
import Color2Page from "./pages/2ColorPage";
import PrimPage from "./pages/PrimPage";
import KruskalPage from "./pages/KruskalPage";
import BellmanFordPage from "./pages/BellmanFordPage";
import ArraysPage from "./pages/Data Structures/ArraysPage";
import { useEffect } from "react";
import StackPage from "./pages/Data Structures/StackPage";
import QueuePage from "./pages/Data Structures/QueuePage";
import PlayPage from "./pages/Play/PlayPage";
import QuizPage from "./pages/Play/QuizPage";

/**
 * App component rendering the Landpage by default and allowing navigation to other pages.
 *
 * @returns The App component with transitions.
 */
function App() {
  const location = useLocation(); // Get the current location for route transitions

  useEffect(() => {
    // Hide overflow globally to prevent scrollbar flashes
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0"; // Prevents extra margin shifts
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landpage /></PageWrapper>} />
        <Route path="/visualizer-tool" element={<PageWrapper><VisualizerTool /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/theory" element={<PageWrapper><TheoryPage /></PageWrapper>} />
        <Route path="/dfs-visualizer" element={<PageWrapper><DFSPage /></PageWrapper>} />
        <Route path="/bfs-visualizer" element={<PageWrapper><BFSPage /></PageWrapper>} />
        <Route path="/dijkstra-visualizer" element={<PageWrapper><DijkstraPage /></PageWrapper>} />
        <Route path="/2Color-visualizer" element={<PageWrapper><Color2Page /></PageWrapper>} />
        <Route path="/prim's-visualizer" element={<PageWrapper><PrimPage /></PageWrapper>} />
        <Route path="/kruskal-visualizer" element={<PageWrapper><KruskalPage /></PageWrapper>} />
        <Route path="/bellman-ford-visualizer" element={<PageWrapper><BellmanFordPage /></PageWrapper>} />
        <Route path="/array-visualizer" element={<PageWrapper><ArraysPage /></PageWrapper>} />
        <Route path="/stack-visualizer" element={<PageWrapper><StackPage/></PageWrapper>}/>
        <Route path="/queue-visualizer" element={<PageWrapper><QueuePage/></PageWrapper>}/>
        <Route path="/play" element={<PageWrapper><PlayPage/></PageWrapper>}/>
        <Route path="/quiz/:quizId" element={<PageWrapper><QuizPage/></PageWrapper>}/>
      </Routes>
    </AnimatePresence>
  );
}

/**
 * PageWrapper component to handle smooth page transitions without scrollbars.
 */
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }} // Subtle downward fade-in
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }} // Subtle upward fade-out
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "relative", // Ensures the layout does not shift
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh", // Forces consistent height
        overflow: "visible", // Prevents any scrollbar appearing
      }}
    >
      {children}
    </motion.div>
  );
}

export default App;
