import { useRef, useState } from "react";
import "../styles/VisualizerToollgorithmListPage.css";
import { useNavigate } from "react-router-dom";

function VisualizerToollgorithmListPage() {
  const algorithms = [
    {
      name: "Depth First Search (DFS)",
      description: "Explore nodes by going deep first.",
      category: "Graph Algorithms",
    },
    {
      name: "Breadth First Search (BFS)",
      description: "Explore nodes level by level.",
      category: "Graph Algorithms",
    },
    {
      name: "Dijkstra's Algorithm",
      description: "Find the shortest path in a weighted graph.",
      category: "Graph Algorithms",
    },
    {
      name: "2 Coloring",
      description:
        "Assign colors to nodes such that no two adjacent nodes share the same color.",
      category: "Graph Algorithms",
    },
    {
      name: "Prim's Algorithm",
      description: "Find the MST by growing a single tree.",
      category: "Graph Algorithms",
    },
    {
      name: "Kruskal Algorithm",
      description: "Merging multiple trees into a single Minimum Spanning Tree (MST).",
      category: "Graph Algorithms",
    }, 
    {
      name: "Bellman-Ford Algorithm",
      description: "Finds the shortest path from a single source, even with negative-weight edges.",
      category: "Graph Algorithms",
    },
    {
      name: "Array",
      description: "See how an array looks and what operation can be done with them.",
      category: "Additional Data Structures",
    },
    {
      name: "Stack",
      description: "See how a stack looks and what operation can be done with it.",
      category: "Additional Data Structures",
    },
    {
      name: "Queue",
      description: "See how a queue looks and what operation can be done with it.",
      category: "Additional Data Structures",
    }


  ];

  algorithms.sort((a, b) => a.name.localeCompare(b.name));

  const navigate = useNavigate();
  const [search, setSearch] = useState(""); // Tracks search input
  const [category, setCategory] = useState(""); // Tracks selected category
  const [highlighted, setHighlighted] = useState("");

  const filteredAlgorithms = algorithms.filter(
    (algo) =>
      algo.name.toLowerCase().includes(search.toLowerCase()) &&
      (category == "" || algo.category == category)
  );

  const handleAlgorithmClick = (algoName: string) => {
    switch (algoName) {
      case "Depth First Search (DFS)":
        navigate("/dfs-visualizer");
        break;
      case "Breadth First Search (BFS)":
        navigate("/bfs-visualizer");
        break;
      case "Dijkstra's Algorithm": 
        navigate("/dijkstra-visualizer");
        break;
      case "2 Coloring":
        navigate("/2Color-visualizer");
        break;
      case "Prim's Algorithm":
        navigate("/prim's-visualizer");
        break;
      case "Kruskal Algorithm":
        navigate("/kruskal-visualizer");
        break;
      case "Bellman-Ford Algorithm":
        navigate("/bellman-ford-visualizer")
        break;
      case "Array":
        navigate("/array-visualizer");
        break;
      case "Stack":
        navigate("/stack-visualizer");
        break;
      case "Queue":
        navigate("/queue-visualizer");
        break;
      default:
        console.error("Algorithm not recognized:", algoName);
    }
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Track timeout

  return (
    <div className="visualizer-main">
      <div className="go-back">
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search algorithm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Updates search state
          className="search-bar"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Updates category state
          className="category-dropdown"
        >
          <option value="">All Categories</option>
          <option value="Graph Algorithms">Graph Algorithms</option>
          <option value="Additional Data Structures">Additional Data Structures</option>
        </select>
        <button
          className="random-button"
          onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current); // Clear previous timeout
            }
            const randomAlgo =
              filteredAlgorithms[
                Math.floor(Math.random() * filteredAlgorithms.length)
              ];
            if (randomAlgo) {
              setHighlighted(randomAlgo.name);
              timeoutRef.current = setTimeout(() => {
                setHighlighted("");
                timeoutRef.current = null; // Reset timeout reference
              }, 2500);
            }
          }}
        >
          Pick Random
        </button>
      </div>

      <div className="algorithm-list">
        {filteredAlgorithms.map((algo, index) => (
          <div
            className={`algorithm-card ${
              highlighted === algo.name ? "highlighted" : ""
            }`}
            key={index}
            onClick={() => handleAlgorithmClick(algo.name)}
          >
            <h2 className="algorithm-title">{algo.name}</h2>
            <p className="algorithm-description">{algo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualizerToollgorithmListPage;
