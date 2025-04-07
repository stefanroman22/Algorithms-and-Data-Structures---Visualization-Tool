import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import "../../styles/Profile/ProfileLogSignIn.css";
import NavBarProfilePage from "../../components/ProfilePages/NavBarProfilePage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileLogSignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.clear();
    e.preventDefault();
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 3500);
  
    setShowError(false);
    setErrorMessage("");
  
    const endpoint = isLogin ? "login" : "register";
    const payload = { username: username.trim() };
  
    try {
      const response = await fetch(`http://localhost:8000/api/users/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store user data and JWT token in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("accessToken", data.access);
        // Redirect to profile page
        navigate("/profile");
      } else {
        const errorMessages = Object.values(data).flat().join(" ");
        setErrorMessage(errorMessages);
        setShowError(true);
  
        setTimeout(() => {
          setShowError(false);
          setErrorMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };
  

  return (
    <>
      <NavBarProfilePage />
      <div className="container-log-sign-in">
        <div className="form-box login">
          <form className="form-profile" onSubmit={handleSubmit}>
            <h1>{isLogin ? "Log In" : "Sign Up"}</h1>

            {/* Username Input */}
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                minLength={6}
                maxLength={20}
                pattern=".*\d.*"
                title="Username must contain at least one digit."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="fa-solid fa-user"></i>
            </div>

            {/* Links section */}
            <div className="links-row">
              <div className="sign-up-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(!isLogin);
                  }}
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </a>
              </div>
            </div>

            <button type="submit" className="btn" disabled={isButtonDisabled}>
              {isButtonDisabled ? "Processing..." : "Submit"}
            </button>
          </form>

          {/* Social platforms section */}
          <p>or {isLogin ? "log in" : "sign up"} with social platforms</p>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faGoogle} size="2x" /></a>
            <a href="#"><FontAwesomeIcon icon={faGithub} size="2x" /></a>
            <a href="#"><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
          </div>
        </div>
      </div>

      {showError && (
        <div className="error-popup">
          <h3>Registration Failed</h3>
          <p id="error-message">{errorMessage}</p>
        </div>
      )}
    </>
  );
}

export default ProfileLogSignIn;
