import { useEffect, useState } from "react";
import "../styles/LandPage.css";
import { initGraphAnimation } from "../scripts/LandapageAnimation/graphAnimation";
import NavBarLandPage from "../components/NavBarLandPage";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

function Landpage() {
  useEffect(() => {
    const svgSize = document.getElementById("animation-container")?.clientWidth || 500;
    initGraphAnimation("animation-container", svgSize);
  }, []);

  const interestingFacts = [
    "Did you know? The shortest path algorithm used in Google Maps is based on Dijkstra's Algorithm!",
    "Did you know? Graph Theory was founded by Euler in 1736 when he solved the famous Königsberg Bridge problem!",
    "Did you know? Social media platforms use Graph Theory to suggest new friends based on mutual connections!",
    "Did you know? The PageRank algorithm, used by Google Search, is based on Graph Theory to rank websites!",
    "Did you know? The Traveling Salesman Problem (TSP) is an NP-hard problem with applications in logistics and AI!",
    "Did you know? Graph databases like Neo4j are optimized for handling relationships between connected data!",
    "Did you know? Bipartite graphs are used in matchmaking systems to pair compatible users efficiently!",
    "Did you know? In real life, graphs model everything from social networks to road maps and airline routes!",
    "Did you know? The Floyd-Warshall algorithm can find shortest paths between all nodes in a graph at once!",
    "Did you know? Facebook’s ‘People You May Know’ feature is powered by graph-based link prediction!",
    "Did you know? Graph coloring is used in scheduling problems to assign tasks without conflicts!",
    "Did you know? The Bellman-Ford algorithm helps find shortest paths even with negative-weight edges!",
    "Did you know? A Minimum Spanning Tree (MST) connects all nodes in a graph with the least possible edge weight!",
    "Did you know? Kruskal’s and Prim’s algorithms are popular methods for finding Minimum Spanning Trees!",
    "Did you know? Heap data structures are used in Dijkstra’s algorithm to efficiently extract the shortest path!",
    "Did you know? The adjacency matrix of a graph stores edges in a 2D table for quick lookups!",
    "Did you know? The adjacency list representation of a graph is more memory-efficient than an adjacency matrix!",
    "Did you know? Breadth-First Search (BFS) is used in network broadcasting and shortest path calculations!",
    "Did you know? Depth-First Search (DFS) helps in maze-solving and detecting cycles in graphs!",
    "Did you know? Stack data structures are used in DFS while queues are used in BFS!",
    "Did you know? Binary Search Trees (BSTs) allow for fast searching, insertion, and deletion in logarithmic time!",
    "Did you know? Self-balancing trees like AVL and Red-Black Trees maintain efficient search times!",
    "Did you know? Hash Tables provide O(1) average-time complexity for search, insert, and delete operations!",
    "Did you know? Tries (prefix trees) are used in autocomplete search engines to suggest words efficiently!",
    "Did you know? Linked lists are the foundation of many advanced data structures like stacks and queues!",
    "Did you know? Circular linked lists are used in OS scheduling for round-robin process execution!",
    "Did you know? A heap data structure is often used to implement priority queues in programming!",
    "Did you know? Fibonacci heaps provide an improved priority queue with faster decrease-key operations!",
    "Did you know? The Disjoint Set Union (Union-Find) is used in Kruskal’s algorithm to find MSTs!",
    "Did you know? Kahn’s Algorithm is used to find a topological sorting of a Directed Acyclic Graph (DAG)!",
    "Did you know? The A* search algorithm, used in AI and pathfinding, improves on Dijkstra’s algorithm using heuristics!",
    "Did you know? The Ford-Fulkerson algorithm helps in solving the Maximum Flow problem in networks!"
  ];

  const [fact, setFact] = useState(interestingFacts[0]);

  const getRandomFact = () => {
    let index = Math.floor(Math.random() * interestingFacts.length);
    setFact(interestingFacts[index]);
  };

  return (
    <div className="landpage-container">
      <section className="navigation-section">
        <NavBarLandPage />
      </section>

      <section className="animation">
        <div id="animation-container" className="animation-container"></div>
      </section>
      
      <div className="text-landpage">
        <h1 className="main-text-landpage">GVT</h1>
        <h2 className="sub-text-landpage">
          Learn Graph Algorithms and Data Structures interactively
        </h2>
      </div>

      <div className="easterEgg-container" onMouseEnter={getRandomFact}>
        <span className="easter-egg-message">{fact}</span>
        <HiMiniQuestionMarkCircle size={40} className="easterEgg-icon" />
      </div>
    </div>
  );
}

export default Landpage;
