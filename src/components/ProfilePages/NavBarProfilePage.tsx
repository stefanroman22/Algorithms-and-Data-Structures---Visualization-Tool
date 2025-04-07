
import { useNavigate } from "react-router-dom";
import "../VisualizerToolPage/NavBar/NavBarVisualizerToolPage.css";
function NavbarProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="navbar-visualizer-tool">
      <button
            className="go-back-button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button className="nav-button-visualizer-tool" onClick={() => navigate("/visualizer-tool")}>Visualization Tool</button> 
          <button className="nav-button-visualizer-tool" onClick={() => navigate("/theory")}>
            Theory
          </button>
          <button className="nav-button-visualizer-tool">Play</button>
          <button className="nav-button-visualizer-tool" onClick={() => navigate("/contact")}>Contact</button>
    </div>
  );
}

export default NavbarProfilePage;
