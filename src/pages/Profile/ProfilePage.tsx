import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarProfilePage from "../../components/ProfilePages/NavBarProfilePage";
import "../../styles/Profile/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const defaultProfileImage = "/images/defaultProfileImage.jpg"; // Ensure correct path

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect if no user is logged in
    }
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <NavbarProfilePage />
      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-image-container">
            
          <img
            src={`http://localhost:8000${user.profile_photo}`}
            alt="Profile"
            className="profile-image"/>
          </div>
          <h2 className="username">{user.username}</h2>
          <div className="stats">
            <p className="points">Points: <span>{user.points}</span></p>
            <p className="rank">
              Rank: <span className={user.rank.toLowerCase()}>{user.rank}</span>
            </p>
          </div>
        </div>
        <div className="profile-right">
          <h2>Completed Quizzes</h2>
          <ul>
            {user.completed_quizzes.length > 0 ? (
              user.completed_quizzes.map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))
            ) : (
              <p>No quizzes completed yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
