import SideNavBarTheoryPage from "../components/SideNavBarTheoryPage";
import "../styles/TheoryPage.css";
import "../styles/ContactPage.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { createGraph, createPropertiesGraph } from "../scripts/CreateGraph/createGraph";
import { createD3GraphBasic, createGraphBidirectional,  } from "../scripts/CreateGraph/createGraph";
import AdjacencyMatrixAnimation from "../scripts/GraphRepresentationsAnimation/AdacencyMatrixAnimation";

function TheoryPage() {
  const navigate = useNavigate();
  const [currentGeneratedGraph, setCurrentGeneratedGraph] = useState<{
    nodes: Array<{ id: string }>;
    links: Array<{ source: string; target: string }>;
  } | null>(null);
  const markdownContentWhatisaGraph = `
# What is a Graph?

A Graph is a non-linear data structure that consists of **vertices (nodes)** and **edges**.  

![Graph Example](./TheoryImages/TheoryBasicGraph.png)

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
## Graph Representation

Graphs can be represented in different ways depending on the specific requirements of the problem. Two common representations are:

1. **Adjacency Matrix**
2. **Adjacency List**

Each has its advantages and trade-offs, which we will explore in detail.

---

### **Adjacency Matrix Representation**

An **Adjacency Matrix** is a 2D array (or matrix) where each cell at index \`(i, j)\` stores information about the edge from vertex \`i\` to vertex \`j\`.

#### Example:
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


### **Adjacency List Representation**

An **Adjacency List** is more memory-efficient, especially for sparse graphs. It consists of:
- An array that contains all vertices.
- Each vertex is linked to a list (or array) that stores its adjacent vertices and, optionally, the weights of the edges.

#### Example: 
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

Below you can use our interactive tool to play around with the adjacency matrix representation. For adajacency list representation check the graph 
algorithms visualizations.
`;
const markdownContentSpecialGraphStructures = `## Special Graph Structures

A **tree** is a connected graph with no cycles. It consists of nodes (vertices) and edges, where there is exactly one path between any two nodes. Trees are fundamental structures used in many algorithms and data structures, such as binary search trees, heaps, and decision trees.

---

### **Minimum Spanning Tree (MST)**

A **Minimum Spanning Tree** is a subset of the edges of a connected, weighted graph that connects all the vertices together, without any cycles, and with the minimum possible total edge weight. The MST is particularly useful for problems that involve connecting points with the least cost, such as network design.

---

### **Why Use MST?**

1. **Network Design**  
   For laying out a network (e.g., connecting cities with roads), an MST ensures the minimum total length of roads (edges) while maintaining full connectivity between all cities (vertices).
   
2. **Clustering**  
   MSTs are used in clustering algorithms, where the goal is to group similar items together with the least amount of distance or cost between them.

---



Using the buttons below, you can explore the visualization of Trees compared to Graphs:
`
const markdownContentArray = `## Array

An **array** is a linear data structure that stores elements in a contiguous block of memory. Each element can be accessed directly using its index, making arrays efficient for operations that involve positional access.

Arrays are fundamental to computer science and are often the first data structure introduced due to their simplicity and performance in common tasks.

Below we can see an array that holds 5 elements and its indexes:

![Array Example](./TheoryImages/AdditionalDataStructures/arrayExample.png)

---

### **Core Operations on Arrays**

Arrays support several essential operations, each with specific computational properties:

1. **Append**  
   Adds an element to the end of the array.  

2. **Delete**  
   Removes an element at a specific index, shifting elements to fill the gap.  

3. **Update**  
   Modifies the value at a given index.  

4. **Search**  
   Finds the position of a value (linear or binary search depending on whether the array is sorted).  

5. **Minimum / Maximum**  
   Scans the array to find the smallest or largest value.  

---

Additionally, all additional data structures included in the visualizer tool implement the isEmpty() method, which checks whether the structure contains any elements.

### **Why Are Arrays Important?**

1. **Simplicity and Speed**  
   Arrays allow fast, constant-time access to elements by index, making them suitable for many algorithms and applications.

2. **Foundation for Other Structures**  
   More complex data structures like heaps, stacks, and hash tables often rely on arrays in their implementation.

---

Using the buttons below, you can explore visualizations of array operations: see how appending, deleting, updating, and searching behave in real-time to better understand their underlying mechanics.
`
const markdownContentQueue = `## Queue

A **queue** is a linear data structure that follows the **First In First Out (FIFO)** principle. This means that the element added earliest is removed first, just like a real-life queue at a checkout line.

Queues are commonly used in scheduling algorithms, buffering, and breadth-first search (BFS) traversal of graphs.

Below is a visual representation of how a  queue works:

![Queue Example](./TheoryImages/AdditionalDataStructures/queueExample.png)

---

### **Core Operations on Queues**

Queues support the following core operations:

1. **Enqueue**  
   Adds an element to the end (tail) of the queue.

2. **Dequeue**  
   Removes the element at the front (head) of the queue.

3. **Peek (Front / Rear)**  
   Accesses the front or rear element without removing it.

---

### **Why Are Queues Important?**

1. **Real-World Modeling**  
   Ideal for scenarios where processing occurs in the order of arrival (e.g., print jobs, task scheduling).

2. **Algorithm Support**  
   Essential in breadth-first search (BFS), CPU task scheduling, and handling asynchronous data (like I/O buffers).

---

Use the buttons below to interact with visualizations of enqueue, dequeue, and peek operations to deepen your understanding of how queues behave.
`;
const markdownContentStack = `## Stack

A **stack** is a linear data structure that follows the **Last In First Out (LIFO)** principle. The last element added is the first to be removed, similar to a stack of plates.

Stacks are used extensively in function call management, parsing expressions, and depth-first search (DFS).

Below is an illustration of operations possible on a stack:

![Stack Example](./TheoryImages/AdditionalDataStructures/stackExample.png)

---

### **Core Operations on Stacks**

Stacks support the following operations:

1. **Push**  
   Adds an element to the top of the stack.

2. **Pop**  
   Removes the top element from the stack.

3. **Top (Peek)**  
   Returns the top element without removing it.

---

### **Why Are Stacks Important?**

1. **Backtracking and Control Flow**  
   Used in recursive programming, browser history navigation, undo functionality, etc.

2. **Algorithmic Applications**  
   Crucial in evaluating expressions, implementing DFS, and balancing symbols (like brackets).

---

Use the buttons below to explore push, pop, and peek operations in the stack visualization tool to gain hands-on experience with the LIFO behavior.
`;
  const markdownContentWhyGraphAlgorithms = `## Why Graph Algorithms?

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
const markdownContentDijkstra_Bellman_Ford = `

## Dijkstra + Bellman-Ford

Dijkstra’s and Bellman-Ford are two essential algorithms used to find the **shortest path** from a starting point (source) to all other nodes in a weighted graph.

### **Dijkstra’s Algorithm: Fastest for Non-Negative Weights**

Dijkstra’s algorithm is widely used in real-world applications like **Google Maps** to calculate the most efficient routes.

#### **How It Works**
1. Start from the source with distance 0.
2. Visit the nearest unvisited neighbor.
3. Update distances using the shortest known path.
4. Repeat until all nodes are processed.

#### **Why Use Dijkstra?**
- **Best for non-negative weights.**
- **Very efficient** with priority queues (min-heaps).
- Real-world uses: GPS navigation, logistics, project planning.

### **Bellman-Ford Algorithm: Handles Negative Weights**

Bellman-Ford is a more **flexible** algorithm that also solves the shortest path problem but works even when some edge weights are **negative**.

#### **How It Works**
1. Initialize all distances (source = 0, others = ∞).
2. Relax all edges **|V| - 1** times.
3. Check for negative-weight cycles.

#### **Why Use Bellman-Ford?**
- **Supports negative edge weights**.
- Can **detect negative-weight cycles** (unlike Dijkstra).
- Used in network protocols like RIP (Routing Information Protocol).

### **Dijkstra vs. Bellman-Ford: When to Use What?**

| Feature                  | Dijkstra           | Bellman-Ford           |
|--------------------------|--------------------|------------------------|
| Negative weights allowed | No                 | Yes                    |
| Speed                    | Faster             | Slower                 |
| Detects negative cycles  | No                 | Yes                    |
| Real-world use cases     | Maps, Logistics    | Networking, Planning   |

Using the button below you can access directly the Dijkstra and Bellman-Ford visualization tools:
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
const markdownContentPrims_Kruskal = `## Prim's + Kruskal's Algorithms

Prim's and Kruskal's are two classic algorithms used to find a **Minimum Spanning Tree (MST)** in a weighted, connected graph. An MST connects all vertices in the graph with the minimum total edge weight and without creating cycles.

---

### **How They Work**

1. **Prim's Algorithm**  
   Prim’s algorithm starts from a single node and grows the MST one edge at a time by always choosing the smallest edge that connects a visited node to an unvisited one.  
   - **Analogy**: Like building a network of roads starting from one city, always picking the shortest road to expand the network.

2. **Kruskal's Algorithm**  
   Kruskal’s algorithm sorts all edges by weight and adds them one by one, as long as they don’t form a cycle. It builds the MST from the smallest available edges regardless of where they are in the graph.  
   - **Analogy**: Imagine connecting cities by picking the cheapest roads, checking that no loops are formed each time.

---

### **Why Are Prim’s and Kruskal’s Important?**

1. **Efficient Network Construction**  
   These algorithms are useful in designing networks (e.g., computer networks, electrical grids) that connect all nodes with minimal cost.

2. **Foundation for Advanced Topics**  
   Understanding MST algorithms is essential for more complex topics in optimization, such as clustering or network reliability.

3. **Differences in Approach**  
   - **Prim’s** grows from a starting point.
   - **Kruskal’s** builds from the bottom up by choosing globally minimum edges.

---

### **Real-World Applications**

- Designing cost-efficient infrastructure (e.g., roads, pipelines).
- Organizing data in hierarchical structures.
- Forming clusters in data science and machine learning.

Prim’s and Kruskal’s offer two strategic approaches to building the most efficient connection of all points in a graph.

---

### **Remember**  
Prim’s focuses on growing a tree from one point outward, while Kruskal’s focuses on globally selecting the smallest edges to avoid cycles. In the next chapters, we’ll explore how other algorithms (like Bellman-Ford and Dijkstra) build on different principles for solving shortest-path problems.

Using the button below, you can access the Prim's and Kruskal's MST visualization tool:
`;

const markdownSources = `---

### **Sources**

- Tim Roughgarden. *Algorithms Illuminated*. Soundlikeyourself Publishing, LLC, New York, NY, first edition, second printing, 2021 edition, 2018. Library of Congress Control Number: 2017914282.
- Douglas B. West. *Introduction to Graph Theory*. Second Edition. Pearson Education (Singapore) Pte. Ltd, Delhi 110 092, India, 2001. First Indian Reprint, 2002.
- [GeeksforGeeks – Graph Theory](https://www.geeksforgeeks.org/graph-theory-tutorial/)
- [Understanding Queues: Principles, Time Complexity, and Real-World Applications – Medium](https://medium.com/@sakalli.duran/understanding-queues-principles-time-complexity-and-real-world-applications-36e4261f078b)
- [Using Stack Data Structures – Medium](https://medium.com/@danielmartinross/using-stack-data-structures-9dc43b25c869)
- Darij Grinberg. *An Introduction to Graph Theory*.
`;

const handleGenerateGraph = (shouldGenerateTree = false) => {
  const nodeCount = 5;
  let nodes = Array.from({ length: nodeCount }, (_, i) => ({ id: (i + 1).toString() }));

  let links = [];
  const parent = [...Array(nodeCount)].map((_, i) => i);
  const edgeSet = new Set();

  // Union-Find functions for cycle detection
  const find = (u) => {
    while (parent[u] !== u) {
      parent[u] = parent[parent[u]]; // Path compression
      u = parent[u];
    }
    return u;
  };

  const union = (u, v) => {
    const pu = find(u);
    const pv = find(v);
    if (pu !== pv) {
      parent[pu] = pv;
      return true;
    }
    return false;
  };

  if (shouldGenerateTree) {
    // Fixed tree structure with specific nodes and edges:
    // Root 1 with edges 1 -> 2, 1 -> 3, 2 -> 4, 4 -> 5
    const templateEdges = [
      [0, 1], // 1 -> 2
      [0, 2], // 1 -> 3
      [1, 3], // 2 -> 4
      [1, 4], // 4 -> 5
    ];
  
    // Assign fixed node IDs based on the above edges, starting with node 1
    const nodeIds = ['1', '2', '3', '4', '5'];
  
    // Update nodes and links based on the fixed structure
    nodes = nodeIds.map((id) => ({ id }));
    links = templateEdges.map(([from, to]) => ({
      source: nodeIds[from],
      target: nodeIds[to],
    }));
  }else {
    // Generate random graph (may or may not be a tree)
    const maxEdges = Math.min(nodeCount * 2, (nodeCount * (nodeCount - 1)) / 2);
    while (links.length < maxEdges) {
      const u = Math.floor(Math.random() * nodeCount);
      const v = Math.floor(Math.random() * nodeCount);
      if (u === v) continue;

      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        links.push({
          source: nodes[u].id,
          target: nodes[v].id
        });
      }
    }
  }

  const graph = { nodes, links };
  setCurrentGeneratedGraph(graph);
  const container = document.getElementById("tree-visualizer");
  if(shouldGenerateTree)
    createGraph(container, graph, "Tree"); // This will generate a tree
  else 
    createGraph(container, graph);
  console.clear();
  
};

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

      <SideNavBarTheoryPage />
      <div className="markdown-content">
        <div id="what-is-a-graph?">
          <ReactMarkdown>{markdownContentWhatisaGraph}</ReactMarkdown>
        </div>
        <div id="graphs-representation">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentGraphsRepresentation}
          </ReactMarkdown>
        </div>
            
        <AdjacencyMatrixAnimation/>
    
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
        <div id="special-graph-structures">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentSpecialGraphStructures}
          </ReactMarkdown>
        </div>
        <div className="tree-animation-container">
          <div id="tree-visualizer" className="tree-visualizer" >

          </div>

          <button 
            id="generate-graph" 
            className="generate-graph visualization-route-button"
            onClick={() => handleGenerateGraph(false)} >
            Generate Graph
          </button>

          <button 
            id="generate-tree" 
            className="generate-tree visualization-route-button"
            onClick={() => handleGenerateGraph(true)} >
            Generate Tree
          </button>
        </div>
        <div id="array">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentArray}
          </ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/array-visualizer")}
          >
            Array
          </button>
        </div>
        <div id="stack">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentStack}
          </ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/stack-visualizer")}
          >
            Stack
          </button>
        </div>
        <div id="queue">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContentQueue}
          </ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/queue-visualizer")}
          >
            Queue
          </button>
        </div>
        <div id="why-graph-algorithms?">
          <ReactMarkdown>{markdownContentWhyGraphAlgorithms}</ReactMarkdown>
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
        <div id="dijkstra-+-bellman-ford">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContentDijkstra_Bellman_Ford}</ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/Dijkstra-visualizer")}
          >
            Dijkstra
          </button>
          <button
            className="visualization-route-button"
            onClick={() => navigate("/bellman-ford-visualizer")}
          >
            Bellman Ford
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
        <div id="prim's-+-kruskal">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContentPrims_Kruskal}</ReactMarkdown>
        </div>
        <div className="visualization-route-buttons">
          <button
            className="visualization-route-button"
            onClick={() => navigate("/prim's-visualizer")}
          >
            Prim's
          </button>
          <button
            className="visualization-route-button"
            onClick={() => navigate("/kruskal-visualizer")}
          >
            Kruskal
          </button>
        </div>
        <div id="sources">
          <ReactMarkdown>{markdownSources}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default TheoryPage;
