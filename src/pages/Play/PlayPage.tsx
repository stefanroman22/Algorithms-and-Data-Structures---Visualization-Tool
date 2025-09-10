import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/VisualizerToollgorithmListPage.css";
import "../../styles/Play/PlayPage.css";

function PlayPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/quiz/list");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      (quiz.title.toLowerCase().includes(search.toLowerCase()) ||
       quiz.category.toLowerCase().includes(search.toLowerCase())) &&
      (difficulty === "" || quiz.difficulty === difficulty)
  );


  if (loading) return <div className="visualizer-main">Loading quizzes...</div>;
  if (error) return <div className="visualizer-main">Error: {error}</div>;

  return (
    <div className="visualizer-main">
      <div className="go-back">
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="category-dropdown"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          className="random-button"
          onClick={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const randomQuiz =
              filteredQuizzes[
                Math.floor(Math.random() * filteredQuizzes.length)
              ];
            if (randomQuiz) {
              setHighlighted(randomQuiz.id);
              timeoutRef.current = setTimeout(() => {
                setHighlighted("");
                timeoutRef.current = null;
              }, 2500);
            }
          }}
        >
          Pick Random
        </button>
      </div>

      <div className="algorithm-list">
        {filteredQuizzes.length === 0 ? (
          <p style={{ color: "white" }}>No quizzes found.</p>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`algorithm-card ${
                highlighted === quiz.id ? "highlighted" : ""
              }`}
              data-image={quiz.image}
              onClick={() => window.open(`${import.meta.env.BASE_URL}quiz/${quiz.id}`, "_blank")}
            >
              <h2 className="algorithm-title">{quiz.title}</h2>
              <p className="algorithm-description">Category: {quiz.category}</p>
              <p className={`algorithm-description difficulty-${quiz.difficulty}`}>
                Difficulty: {quiz.difficulty}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlayPage;
