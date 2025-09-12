import { useNavigate } from "react-router-dom";
import "./NavBarVisualizerToolPage.css";
import "../../../styles/NavBarLandPage.css";

function NavbarVisualizerToolPage({ memberTheoryPage = false }) {
  const navigate = useNavigate();

  return (
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
  );
}

export default NavbarVisualizerToolPage;
