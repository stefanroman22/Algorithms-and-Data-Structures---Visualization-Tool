import "../styles/NavBarLandPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBarLandPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <div className="navbar">
        <button className="nav-button" onClick={() => navigate("/theory")}>Theory</button>
        <button className="nav-button" onClick={() => navigate("/visualizer-tool")}>Visualizer Tool</button>
        <button className="nav-button" onClick={() => navigate("/play")}>Play</button>
        <button className="nav-button" onClick={() => navigate("/contact")}>Contact</button>
      </div>

      {/* MOBILE MENU */}
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
            <button className="nav-button" onClick={() => navigate("/theory")}>Theory</button>
            <button className="nav-button" onClick={() => navigate("/visualizer-tool")}>Visualizer Tool</button>
            <button className="nav-button" onClick={() => navigate("/play")}>Play</button>
            <button className="nav-button" onClick={() => navigate("/contact")}>Contact</button>
          </div>
        )}
      </div>
    </>
  );
}

export default NavBarLandPage;
