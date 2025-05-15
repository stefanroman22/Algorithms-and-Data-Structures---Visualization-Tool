import "../styles/NavBarLandPage.css"; // Correct relative path to the CSS
import { useNavigate } from 'react-router-dom';
function NavBarLandPage() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <button 
      className="nav-button"
      onClick={() => navigate("/theory")}>Theory</button>
      <button 
      className="nav-button"
      onClick={() => navigate("/visualizer-tool")}>Visualizer Tool</button>
      <button className="nav-button">Play</button>
      <button 
      className="nav-button"
      onClick={() => navigate("/contact")}>Contact</button>
    </div>
  );
}

export default NavBarLandPage;
