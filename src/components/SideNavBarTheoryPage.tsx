import { useState } from "react";
import "../styles/SideNavBarTheoryPage.css";
import { VscTriangleRight } from "react-icons/vsc";
import { VscTriangleDown } from "react-icons/vsc";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function SideNavBarTheoryPage() {
  type Chapter = keyof typeof chapters; // "Introduction" | "Algorithms" | "Chapter 3"
  const [expandedChapters, setExpandedChapters] = useState<Chapter[]>([]);
  const navigate = useNavigate();

  const chapters = {
    "Introduction": ["What is a Graph?", "Graphs Representation", "Graphs Properties", "Special Graph Structures"],
    "Additional Data Structures": ["Array", "Stack", "Queue"],
    "Graph Algorithms": ["Why Graph Algorithms?", "Traversal Algorithms", "Distance Algorithms", "2Coloring", "MST Algorithms"],
  };

  // Function to toggle chapter expansion
  const toggleChapter = (chapter: Chapter) => {
  setExpandedChapters((prevState) => {
    const isExpanding = !prevState.includes(chapter);
    const newState = isExpanding
      ? [...prevState, chapter]
      : prevState.filter((item) => item !== chapter);

    // Scroll only if expanding
    if (isExpanding) {
      const chapterId = chapter.toLowerCase().replace(/ /g, "-").replace(/['"]/g, "");
      const element = document.getElementById(chapterId);
      if (element) {
        // Delay scrolling until after the DOM updates
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }

    return newState;
  });
};


  // Function to handle subchapter click
  const handleSubchapterClick = (subchapter: string) => {
    const element = document.getElementById(
      subchapter.toLowerCase().replace(/ /g, "-")
    ); // Convert subchapter name to lowercase and replace spaces with "-"
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); // Smooth scroll
    }
  };

  return (
    <div className="sidebar-container">
      {Object.keys(chapters).map((key, index) => (
        <div key={index}>
          <button
            className="chapter-button"
            onClick={() => toggleChapter(key as Chapter)}
          >
            {expandedChapters.includes(key as Chapter) ? (
              <VscTriangleDown />
            ) : (
              <VscTriangleRight />
            )}{" "}
            {key}
          </button>
          <div
            className={`subchapter-container ${
              expandedChapters.includes(key as Chapter) ? "expanded" : ""
            }`}
          >
            {chapters[key as Chapter].map((subChapter, subIndex) => (
              <button
                key={subIndex}
                className="subchapter-button"
                onClick={() => handleSubchapterClick(subChapter)}
              >
                <span className="subchapter-content">
                  <GoDotFill className="dot-icon" />
                  {subChapter}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SideNavBarTheoryPage;