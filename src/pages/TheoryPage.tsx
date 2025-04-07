import SideNavBarTheoryPage from "../components/SideNavBarTheoryPage";
import "../styles/TheoryPage.css";
import "../styles/ContactPage.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { createPropertiesGraph } from "../scripts/GraphTypesAnimation/graphTypesAnimation";
function TheoryPage() {
  const navigate = useNavigate();
  const markdownContentGraphs = `
# Graphs

A Graph is a non-linear data structure that consists of **vertices (nodes)** and **edges**.  

![Graph Example](/public/TheoryImages/TheoryBasicGraph.png)

A **vertex**, also called a **node**, is a point or an object in the Graph, and an **edge** is used to connect two vertices with each other.

For example, in the image above we have nodes: \`1, 2, 3, 4, 5\` and edges: \`0 -> 4, 0 -> 5, 0 -> 2, 1 -> 4\` and so on!

Graphs are non-linear because the data structure allows us to have different paths to get from one vertex to another, unlike linear data structures like Arrays or Linked Lists.

Graphs are used to represent and solve problems where the data consists of objects and relationships between them, such as:

- **Social Networks**: Each person is a vertex, and relationships (like friendships) are the edges. Algorithms can suggest potential friends.
- **Maps and Navigation**: Locations, like a town or bus stops, are stored as vertices, and roads are stored as edges. Algorithms can find the shortest route between two locations when stored as a Graph.
- **Internet**: Can be represented as a Graph, with web pages as vertices and hyperlinks as edges.
- **Biology**: Graphs can model systems like neural networks or the spread of diseases.
`;
  const markdownContentGraphsProperties = `
# Graph Properties

Graphs are versatile data structures used to model relationships between objects, where the objects are represented as vertices (or nodes) and the relationships as edges. Understanding the properties of graphs is essential to effectively model and analyze systems in diverse fields like computer networks, social media, transportation, and biology.

In this section, we delve into the key properties of graphs, exploring their characteristics and the ways these properties can be combined to represent complex systems.

---

### Weighted Graphs

A **weighted graph** is one where each edge is assigned a numerical value, referred to as its weight. This value can represent various attributes depending on the application, such as:

- **Distance** (e.g., between cities on a map),
- **Capacity** (e.g., bandwidth in a network),
- **Time** (e.g., travel duration between locations),
- **Probability** (e.g., likelihood of an interaction in a social network).

Weights provide additional context to the edges, making weighted graphs invaluable in scenarios that require optimization, like finding the shortest path or maximum flow.

---

### Connected Graphs

A **connected graph** ensures that every vertex is accessible from any other vertex through a series of edges. In other words, there is a path between any two vertices. 

- A graph that is **not connected** consists of isolated components, either as **disjoint subgraphs** or single isolated vertices.
- Ensuring connectivity is critical in fields like communication networks and transportation systems to guarantee reachability.

---

### Directed Graphs (Digraphs)

A **directed graph**, or digraph, assigns a direction to each edge. The direction typically conveys specific relationships, such as:

- **Hierarchy** (e.g., a reporting structure in an organization),
- **Flow** (e.g., movement of goods in a supply chain).

In directed graphs, an edge from vertex \( A \) to \( B \) is distinct from an edge from \( B \) to \( A \), making them ideal for applications that require asymmetry in relationships.

---

### Cyclic and Acyclic Graphs

The concept of **cycles** in a graph varies based on whether the graph is directed or undirected:

1. **Directed Cyclic Graphs**: These graphs allow a path that follows directed edges to eventually loop back to the starting vertex. For example, a workflow with circular dependencies is a directed cyclic graph.
   
   Removing the edge responsible for the loop converts it into a **directed acyclic graph (DAG)**, widely used in scheduling, dependency resolution, and neural networks.

2. **Undirected Cyclic Graphs**: In these graphs, a cycle is a path that starts and ends at the same vertex without traversing any edge more than once. For instance, road networks often form undirected cyclic graphs.

---

### Loops (Self-Loops)

A **loop**, or self-loop, is an edge that begins and ends at the same vertex. Loops have special significance as they represent direct self-references, which can be useful in scenarios like:

- Feedback loops in systems,
- Reflexive relationships in social networks.

Adding a self-loop introduces a cycle in the graph, even if it is the only edge in the graph.

---

### Combining Properties

These properties often coexist in real-world graphs. For example:

- A road network could be represented as a **weighted, undirected cyclic graph**, where weights indicate distances, and cycles represent interconnected roads.
- A social network might use a **directed cyclic graph** to model relationships with potential feedback (e.g., "follows" on social media).

Below you can find an interactive tool to play it that helps understanding the properties Graphs have and how they interwine eachother:
`;

  const markdownContentGraphsRepresentation = `
## Graph Representations

Graphs can be represented in different ways depending on the specific requirements of the problem. Two common representations are:

1. **Adjacency Matrix**
2. **Adjacency List**

Each has its advantages and trade-offs, which we will explore in detail.

---

### **Adjacency Matrix Representation**

An **Adjacency Matrix** is a 2D array (or matrix) where each cell at index \`(i, j)\` stores information about the edge from vertex \`i\` to vertex \`j\`.

#### Example 1: Undirected Graph
Below is an example of an undirected graph and its corresponding adjacency matrix:

#### Graph
Vertices: \`A\`, \`B\`, \`C\`, \`D\`  
Edges: \`{A-B, A-C, B-C, C-D}\`

#### Adjacency Matrix

|     | **A** | **B** | **C** | **D** |
|-----|-------|-------|-------|-------|
| **A** |   0   |   1   |   1   |   0   |
| **B** |   1   |   0   |   1   |   0   |
| **C** |   1   |   1   |   0   |   1   |
| **D** |   0   |   0   |   1   |   0   |

- A \`1\` indicates an edge between two vertices.
- The matrix is symmetric for undirected graphs, as edges go both ways.

---

#### Example 2: Directed and Weighted Graph
A **directed graph** assigns direction to edges, and a **weighted graph** assigns a weight to each edge.

#### Graph
Vertices: \`A\`, \`B\`, \`C\`, \`D\`  
Edges: \`{A → B (3), B → C (5), C → A (2), C → D (4)}\`

#### Adjacency Matrix

|     | **A** | **B** | **C** | **D** |
|-----|-------|-------|-------|-------|
| **A** |   INF   |   3     |   INF   |   INF   |
| **B** |   INF   |   0     |   5     |   INF   |
| **C** |   2     |   INF   |   INF   |   4     |
| **D** |   INF   |   INF   |   INF   |   INF   |

- The value in a cell (e.g., \`3\` at \`(0,1)\`) represents the weight of the edge \`A→B (3)\`.
- The value \`INF\` states there is no edge between those nodes.
- The matrix is not symmetric for directed graphs.

---

### **Adjacency List Representation**

An **Adjacency List** is more memory-efficient, especially for sparse graphs. It consists of:
- An array that contains all vertices.
- Each vertex is linked to a list (or array) that stores its adjacent vertices and, optionally, the weights of the edges.

#### Example 1: Undirected Graph
#### Graph
Vertices: \`A\`, \`B\`, \`C\`, \`D\`  
Edges: \`{A-B, A-C, B-C, C-D}\`

#### Adjacency List
\`\`\`
A → B, C
B → A, C
C → A, B, D
D → C
\`\`\`

- Each vertex points to its neighbors.
- Symmetry is maintained for undirected graphs.

---

#### Example 2: Directed and Weighted Graph
#### Graph
Vertices: \`A\`, \`B\`, \`C\`, \`D\`  
Edges: \`{A → B (3), B → C (5), C → A (2), C → D (4)}\`

#### Adjacency List
\`\`\`
A → (B, 3)
B → (C, 5)
C → (A, 2), (D, 4)
D → ∅
\`\`\`

- Each vertex points to its neighbors, along with the weight of the edge.
- Directionality is maintained, and vertices with no outgoing edges (like \`D\`) point to an empty list.

---

### **Choosing Between Representations**

#### **Adjacency Matrix**
- **Pros**: 
  - Simple to implement.
  - Efficient for dense graphs (many edges).
  - Quick to check if an edge exists (\`O(1)\` access time).
- **Cons**:
  - Memory-intensive for sparse graphs (many vertices but few edges).
  - Inefficient for iterating over all neighbors of a vertex.

#### **Adjacency List**
- **Pros**:
  - Space-efficient for sparse graphs.
  - Efficient for iterating over neighbors of a vertex.
- **Cons**:
  - Checking if an edge exists can be slower (\`O(V)\` in the worst case).

### Summary
The choice between an adjacency matrix and an adjacency list depends on the graph's density, the operations you need to perform, and the trade-offs between time and space complexity.
`;

  const markdownContentWhyAlgorithms = `## Why Algorithms?

Graph algorithms are tools that help us solve problems involving relationships and connections. They allow us to analyze and work with data in the form of graphs, where items (like people, places, or things) are represented as points (called vertices), and their connections are represented as lines (called edges).

---

### **Why Are Graph Algorithms Useful?**

1. **Represent Real-World Problems**  
   Many real-world problems can be represented as graphs:
   - Social networks, where people are connected by friendships or follows.
   - Maps, where cities are connected by roads.
   - Websites, where pages are linked to each other.

2. **Organize and Simplify Data**  
   Graphs make it easier to understand complex relationships by organizing data in a clear way. For example:
   - Finding the shortest route to a destination.
   - Understanding who is connected to whom in a network.
   - Identifying groups or clusters in a large dataset.

3. **Useful Across Many Fields**  
   Graph algorithms are used in many areas of life and work, such as:
   - Planning deliveries or trips efficiently.
   - Designing better networks for communication or electricity.
   - Recommending products or movies based on preferences.

---

### **How Graph Algorithms Help Us**

1. **Answering Questions Quickly**  
   Graphs make it possible to answer questions like:
   - How can we get from one place to another most efficiently?
   - Are two people connected in a social network?
   - What is the best way to link all parts of a system with the least cost?

2. **Making Better Decisions**  
   By showing patterns and connections, graph algorithms help us:
   - Choose the best routes, connections, or options.
   - Spot hidden relationships in data, like customer trends or common behaviors.
   - Improve designs for systems like transport or communications.

3. **Saving Time and Resources**  
   Graphs and their algorithms help optimize resources by:
   - Reducing time and cost in logistics and planning.
   - Finding faster ways to solve complex problems.
   - Ensuring the most efficient use of networks and systems.


---
Before going into depth with specific algorithms let use define two basic applications that most of us are encountered at least once in our life:

1. **Google Maps**

    You clearly know already what Google Maps is used for so it's not worth it giving extra explications
2. **Exam schedueling**

    Since there is a high chance that the person reading this is a student (if you are not that, is okay, P.S: No need for diploma for job in Computing Science)
    you mush have had or will have at least one exam. As you might think students have multiple exams. It would be very bad for the young learners if
    two exams overlapp. If two exams are overlapping we call it a conflict. So, we must find an approapiate schedueling for the students of a particular degree
    such no exams happen at the same time (eg. no conflict arises).

***Remember the description of these problems, as the corresponding solution will be explained in a later chapter using specific algorithms.***
`;

  const markdownContentDFS_BFS = `## DFS + BFS

DFS (Depth-First Search) and BFS (Breadth-First Search) are two fundamental graph algorithms used to explore connections and paths in graphs. These methods are like tools that help us navigate through all the points (vertices) and their connections (edges) in an organized way.

---

### **How They Work**

1. **Depth-First Search (DFS)**  
   DFS explores as far as possible along a branch before backtracking. It uses a stack (or recursion) to remember where it left off and ensures no point is visited twice.  
   - **Analogy**: Imagine you’re walking through a maze and always choose to go as far as you can before backtracking.

2. **Breadth-First Search (BFS)**  
   BFS explores all neighbors of a point first before moving deeper. It uses a queue to systematically visit points layer by layer.  
   - **Analogy**: Picture a ripple in water where you explore outward in circles.

---

### **Why Are DFS and BFS Useful?**

1. **Find Paths or Connections**  
   These algorithms help us answer questions like:
   - Can I get from Point A to Point B?
   - What are all the points connected to a starting point?

2. **Simplified Google Maps Application**  
   In a basic version of a mapping application:
   - **BFS** can be used to find the shortest path (in terms of the number of connections) between two locations.
   - **DFS** can help explore all possible routes from a starting location.

3. **Other Applications**  
   - Identifying connected groups or clusters in data.
   - Searching through a decision tree or puzzle systematically.

DFS and BFS are foundational tools that prepare us to handle more complex problems like finding the most efficient route using Dijkstra’s algorithm.

---

### **Remember**  
DFS dives deep, while BFS spreads out. In the next chapter, we’ll see how algorithms like Dijkstra expand on these methods to handle weighted graphs.

Using the button below you can access directly the DFS/BFS vizualization tool:
`;

  const markdownContentDijkstra = `## Dijkstra’s Algorithm: Finding the Best Routes

Dijkstra’s algorithm is a powerful method for finding the shortest path between points in a graph when the edges have weights. It’s widely used in real-life applications like **Google Maps** to calculate the fastest routes based on distances or travel times.

---

### **How It Works**

Dijkstra’s algorithm systematically calculates the shortest distance from a starting point (source) to all other points in a graph by:
1. Starting from the source and marking its distance as 0.
2. Exploring the neighboring points with the shortest edge.
3. Repeating until all points are visited and the shortest distances are found.

---

### **Why Use Dijkstra’s Algorithm?**

1. **Finding the Shortest Routes**  
   Dijkstra’s algorithm ensures that we find the most efficient path between two locations, whether it’s by road distance, travel time, or cost.

2. **Real Google Maps Application**  
   When you search for a route:
   - **Points (Vertices)**: Cities, locations, or intersections.
   - **Connections (Edges)**: Roads or paths between locations, each with a weight (like distance or travel time).

   Dijkstra’s algorithm calculates the fastest or shortest route while considering these weights.

3. **More Than Maps**  
   - Optimizing delivery routes for logistics.
   - Minimizing communication delays in networks.
   - Planning cost-efficient projects with resource constraints.

---

Using the button below you can access directly the Dijkstra vizualization tool:
`;

  const markdownContent2Color = `## 2-Coloring: Avoiding Conflicts

2-Coloring is a graph algorithm used to divide the vertices of a graph into two groups in such a way that no two connected vertices share the same group. This is only possible if the graph is **bipartite**.

---

### **Why Use 2-Coloring?**

1. **Solving the Exam Scheduling Problem**  
   In the exam scheduling scenario:
   - **Vertices**: Represent courses.
   - **Edges**: Represent conflicts (students enrolled in both courses).

   By applying 2-coloring:
   - Courses are divided into two groups (or time slots) where no two conflicting courses share the same group.
   - This ensures that no student has overlapping exams.

2. **Detecting Conflicts**  
   If the graph can’t be 2-colored, it means the conflicts are too complex to be solved with just two time slots. This insight helps in planning additional time slots or restructuring the schedule.

---

### **Applications Beyond Scheduling**

1. **Social Networks**  
   Separating two groups of users (e.g., buyers and sellers) to ensure smooth interactions.  
2. **Resource Allocation**  
   Assigning two types of resources (e.g., machines or workers) without overlap.

---

Using the button below you can access directly the 2Coloring vizualization tool:
`;


  const graphPropertiesCheckboxes = () => {
    const [properties, setProperties] = useState({
      weighted: false,
      connected: false,
      directed: false,
      cyclic: false,
      selfLoop: false,
    });



    const handleClickedProperty = (event) => {
      const { name, checked } = event.target;
      setProperties((prevProperties) => {
        const newProperties = { ...prevProperties, [name]: checked };
      
        const visualizationBox = document.getElementById(
          "graph-properties-animation-graphic-container"
        );
        if (!visualizationBox) {
          alert("Null container for graphics");
          return prevProperties;
        }
      
        //console.log("Updated properties:", newProperties);
        createPropertiesGraph(newProperties, visualizationBox); // Now uses the updated state
      
        return newProperties;
      });
      const visualizationBox = document.getElementById(
        "graph-properties-animation-graphic-container"
      );
    
      if (!visualizationBox) {
        alert("Null container for graphics");
        return;
      }
    
      console.log(properties);
      createPropertiesGraph(properties, visualizationBox);
    };

    const renderCheckboxes = () => {
      return Object.keys(properties).map((property) => (
        <label
          key={property}
          style={{
            display: "block",
            margin: "8px 0",
            padding: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s ease-in-out", // Smooth background transition
          }}
        >
          <input
            type="checkbox"
            name={property}
            checked={properties[property]}
            onChange={handleClickedProperty}
            style={{ marginRight: "8px", transform: "scale(1.2)" }} // Larger checkboxes
          />
          {property.charAt(0).toUpperCase() + property.slice(1)}
        </label>
      ));
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
        }}
      >
        {/* Left side: Checkboxes */}
        <div>
          <h6>Select Graph Properties:</h6>
          {renderCheckboxes()}
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar-theory-page">
      <div className="go-back">
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      <SideNavBarTheoryPage />
      <div className="markdown-content">
        <div id="graphs">
          <ReactMarkdown>{markdownContentGraphs}</ReactMarkdown>
        </div>
        <div id="graphs-properties">
          <ReactMarkdown>{markdownContentGraphsProperties}</ReactMarkdown>
        </div>
        <div className="graph-properties-animation-container">
          <div className="graph-properties-animation-buttons-container">
            {graphPropertiesCheckboxes()}
          </div>

          <div
            className="graph-properties-animation-graphic-container"
            id="graph-properties-animation-graphic-container"
          ></div>
        </div>
        <div id="graphs-representation">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentGraphsRepresentation}
          </ReactMarkdown>
        </div>
        <div id="why-algorithms?">
          <ReactMarkdown>{markdownContentWhyAlgorithms}</ReactMarkdown>
        </div>
        <div id="dfs-+-bfs">
          <ReactMarkdown>{markdownContentDFS_BFS}</ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/DFS-visualizer")}
          >
            DFS
          </button>
          <button
            className="visualization-route-button"
            onClick={() => navigate("/BFS-visualizer")}
          >
            BFS
          </button>
        </div>
        <div id="dijkstra">
          <ReactMarkdown>{markdownContentDijkstra}</ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/Dijkstra-visualizer")}
          >
            Dijkstra
          </button>
        </div>
        <div id="2coloring">
          <ReactMarkdown>{markdownContent2Color}</ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/2color-visualizer")}
          >
            2Coloring
          </button>
        </div>
      </div>
    </div>
  );
}

export default TheoryPage;
