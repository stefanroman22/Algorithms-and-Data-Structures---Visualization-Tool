import React, { useEffect, useRef, useState } from "react";
import { createGraph} from "../CreateGraph/createGraph";
import "../../styles/Animations/AdjacencyMatrixAnimation.css";

const AdjacencyMatrixAnimation: React.FC = () => {
  const size = 5;
  const [matrix, setMatrix] = useState(
    Array.from({ length: size }, () => Array(size).fill(0))
  );
  const graphRef = useRef<HTMLDivElement>(null);

  const toggleCell = (row: number, col: number) => {
    setMatrix((prev) => {
      const updated = prev.map((r) => [...r]);
      updated[row][col] = updated[row][col] === 1 ? 0 : 1;
      return updated;
    });
  };

  useEffect(() => {
    const nodes = Array.from({ length: size }, (_, i) => ({
      id: String.fromCharCode(65 + i),
    }));

    const links: { source: string; target: string }[] = [];

    matrix.forEach((row, i) => {
      row.forEach((val, j) => {
        if (val === 1) {
          links.push({
            source: String.fromCharCode(65 + i),
            target: String.fromCharCode(65 + j),
          });
        }
      });
    });

    if (graphRef.current) {
      createGraph(graphRef.current, { nodes, links }, "AdjacencyMatrixAnimation");
    }
  }, [matrix]);

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {/* Matrix */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "0px",
          height: "321px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <table style={{ borderCollapse: "collapse", color: "white" }}>
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: size }, (_, j) => (
                <th key={`col-${j}`} style={{ padding: "5px", fontWeight: "bold" }}>
                  {String.fromCharCode(65 + j)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th style={{ paddingRight: "5px", fontWeight: "bold" }}>
                  {String.fromCharCode(65 + i)}
                </th>
                {row.map((val, j) => (
                  <td key={j}>
                    <button
                      onClick={() => toggleCell(i, j)}
                      style={{
                        width: "40px",
                        height: "40px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        backgroundColor: val ? "#4caf50" : "#2a2a2a",
                        color: "#ffffff",
                        border: "1px solid #444",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {val}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graph output */}
      <div
        id="adjacency-animation"
        className="adjacency-animation"
        ref={graphRef}
        style={{
          backgroundColor: "#343434",
          border: "3px solid #252525",
          height: "300px",
          width: "600px",
          borderRadius: "10px",
          margin: "20px",
        }}
      ></div>
    </div>
  );
};

export default AdjacencyMatrixAnimation;
