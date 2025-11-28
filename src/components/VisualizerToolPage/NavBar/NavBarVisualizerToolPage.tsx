import { useNavigate } from "react-router-dom";
import "./NavBarVisualizerToolPage.css";
import "../../../styles/NavBarLandPage.css";
import { useState } from "react";

function NavbarVisualizerToolPage({ memberTheoryPage = false }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="navbar-visualizer-tool">
      <button
        className="go-back-button nav-button "
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/")}>
        Home
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/visualizer-tool")}>
        {memberTheoryPage ? "Visualizer Tool" : "Switch Visualization"}
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/theory")}>
        Theory
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/play")}>
        Play
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/contact")}>
        Contact
      </button>
    </div>

    <div className={`mobile-menu ${open ? "active" : ""}`}>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          <svg width="28" height="28" fill="white">
            <rect width="28" height="3"></rect>
            <rect y="10" width="28" height="3"></rect>
            <rect y="20" width="28" height="3"></rect>
          </svg>
        </button>

        {open && (
          <div className="mobile-navigation">
            <button
        className="go-back-button nav-button "
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/")}>
        Home
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/visualizer-tool")}>
        {memberTheoryPage ? "Visualizer Tool" : "Switch Visualization"}
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/theory")}>
        Theory
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/play")}>
        Play
      </button>
      <button className="nav-button-visualizer-tool nav-button " onClick={() => navigate("/contact")}>
        Contact
      </button>
          </div>
        )}
      </div>

    </>
  );
}

export default NavbarVisualizerToolPage;
