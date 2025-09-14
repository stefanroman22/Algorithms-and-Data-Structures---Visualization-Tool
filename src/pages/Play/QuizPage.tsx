import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../styles/Play/QuizPage.css";
function QuizPage() {
  const { quizId } = useParams();

  // === State ===
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const timerRef = useRef(null);

  // === Fetch quiz ===
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/quiz/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");

        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // === Timer logic ===
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timerRef.current); // cleanup on unmount
  }, []);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && quiz && !submitted) {
      console.log("Auto-submitting due to timeout");
      handleSubmit(true);
    }
  }, [timeLeft, quiz, submitted]);

  // Warn user if they try to leave
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // === Helpers ===
  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handleSelect = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // === Submit quiz ===
  const handleSubmit = (force = false) => {
    console.clear();

    // If not forced and not all questions answered -> show alert and keep timer running
    if (!force && Object.keys(answers).length !== quiz.questions.length) {
      showErrorPopup("Please answer all questions before submitting.");
      return;
    }

    clearInterval(timerRef.current); // stop timer once actually submitted
    setSubmitted(true);
    setCalculating(true);

    // Simulate grading delay
    setTimeout(() => {
      const correctCount = quiz.questions.reduce((count, q, idx) => {
        return count + (answers[idx] === q.correct_index ? 1 : 0);
      }, 0);

      setScore(correctCount);
      setCalculating(false);
      console.log("Answer submitted!");
    }, 1000);
  };

  // === Render ===
  if (error) return <div className="quiz-page">Error: {error}</div>;
  if (!quiz) return <div className="quiz-page">Loading...</div>;

  return (
    <div className="quiz-page">
      {/* Timer */}
      <div
        className={`quiz-timer ${
          timeLeft <= 60 ? "danger" : timeLeft <= 300 ? "warning" : ""
        }`}
      >
        Time Left: {formatTime(timeLeft)}
      </div>

      <h1 className="quiz-title">{quiz.title}</h1>

      {/* Questions */}
      {quiz.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = submitted && userAnswer === q.correct_index;
        const isWrong = submitted && userAnswer !== q.correct_index;

        return (
          <div key={idx} className="quiz-question">
            <p className={isCorrect ? "correct-answer" : isWrong ? "wrong-answer" : ""}>
              <strong>Q{idx + 1}:</strong> {q.question}
            </p>

            {/* Question Image */}
            {q.image && (
              <div className="question-image-wrapper">
                {!loadingImages[idx] && <div className="loading-spinner" />}
                <img
                  src={q.image}
                  alt={`Question ${idx + 1}`}
                  className="question-image"
                  
                  onLoad={() => setLoadingImages((prev) => ({ ...prev, [idx]: true }))}
                  style={{ display: loadingImages[idx] ? "block" : "none" }}
                />
              </div>
            )}

            {/* Options */}
            <ul>
              {q.options.map((opt, i) => {
                const isSelected = userAnswer === i;
                const isCorrectOpt = i === q.correct_index;
                const isWrongOpt = submitted && isSelected && !isCorrectOpt;

                const labelClass = submitted
                  ? isCorrectOpt && isSelected
                    ? "correct-label"
                    : isWrongOpt
                    ? "wrong-label"
                    : ""
                  : "";

                const inputClass = submitted
                  ? isCorrectOpt && isSelected
                    ? "correct-radio"
                    : isWrongOpt
                    ? "wrong-radio"
                    : ""
                  : "";

                return (
                  <li key={i}>
                    <label className={labelClass}>
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={i}
                        checked={isSelected}
                        onChange={() => handleSelect(idx, i)}
                        disabled={submitted}
                        className={inputClass}
                      />
                      {opt}
                    </label>
                  </li>
                );
              })}
            </ul>

            {/* Explanation */}
            {isWrong && submitted && (
              <p className="explanation-text">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {/* Submit Button */}
      {!submitted && (
        <div className="submit-container">
          <button className="submit-button" onClick={() => handleSubmit(false)}>
            Submit Quiz
          </button>
        </div>
      )}

      {/* Result Section */}
      {submitted && (
        <div className="result-container">
          {calculating ? (
            <>
              <div className="loading-spinner" />
              <div className="loading-text">Calculating score...</div>
            </>
          ) : (
            <div className="final-score">
              You scored {score} / {quiz.questions.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
