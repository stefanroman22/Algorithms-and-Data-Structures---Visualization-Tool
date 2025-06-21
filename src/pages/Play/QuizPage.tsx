import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../styles/Play/QuizPage.css";

function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const [calculating, setCalculating] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});


  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`https://algorithms-and-data-structures-yf1y.onrender.com/api/quiz/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      }
    }
    fetchQuiz();
  }, [quizId]);

 useEffect(() => {
  timerRef.current = setInterval(() => {
    setTimeLeft((prev) => Math.max(prev - 1, 0));
  }, 1000);
  return () => clearInterval(timerRef.current);
}, []);

useEffect(() => {
  if (timeLeft === 0 && quiz && !submitted) {
    console.log("Auto-submitting due to timeout");
    handleSubmit(true);
  }
}, [timeLeft, quiz, submitted]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleSelect = (idx, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [idx]: optionIndex }));
  };

  const handleSubmit = (force = false) => {
    console.clear();
  clearInterval(timerRef.current);

  if (!force && Object.keys(answers).length !== quiz.questions.length) {
    alert("Please answer all questions before submitting.");
    return;
  }

  setSubmitted(true);       //  Immediately hide submit button
  setCalculating(true);     //  Show "Calculating score..."

  setTimeout(() => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_index) {
        correctCount++;
      }
    });

    setScore(correctCount);     // ✅ Update score
    setCalculating(false);      // ✅ Hide loading text
    console.log("Answer submitted!");
  }, 1000);
};



  if (error) return <div className="quiz-page">Error: {error}</div>;
  if (!quiz) return <div className="quiz-page">Loading...</div>;

  return (
    <div className="quiz-page">
      <div className={`quiz-timer ${timeLeft <= 60 ? "danger" : timeLeft <= 300 ? "warning" : ""}`}>
        Time Left: {formatTime(timeLeft)}
      </div>

      <h1 className="quiz-title">{quiz.title}</h1>

      {quiz.questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = submitted && userAnswer === q.correct_index;
        const isWrong = submitted && userAnswer !== q.correct_index;

        return (
          <div key={`question-${idx}`} className="quiz-question">
            <p className={isCorrect ? "correct-answer" : isWrong ? "wrong-answer" : ""}>
              <strong>Q{idx + 1}:</strong> {q.question}
            </p>
           {q.image && (
  <div className="question-image-wrapper">
    {!loadingImages[idx] && (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <div className="loading-spinner" />
        
      </div>
    )}
    <img
      src={q.image}
      alt={`Question ${idx + 1} illustration`}
      className="question-image"
      onLoad={() =>
        setLoadingImages(prev => ({ ...prev, [idx]: true }))
      }
      style={{ display: loadingImages[idx] ? "block" : "none" }}
    />
  </div>
)}

            <ul>
              {q.options.map((opt, i) => {
                const isSelected = userAnswer === i;
                const isCorrectOpt = i === q.correct_index;
                const isWrongOpt = submitted && isSelected && !isCorrectOpt;

                return (
                  <li key={`q${idx}-opt${i}`}>
                    <label
  className={
    submitted
      ? isCorrectOpt && isSelected
        ? "correct-label"
        : isWrongOpt
        ? "wrong-label"
        : ""
      : ""
  }
>
  <input
  type="radio"
  name={`question-${idx}`}
  value={String(i)}
  checked={isSelected}
  onChange={() => handleSelect(idx, i)}
  disabled={submitted}
  className={
    submitted
      ? isCorrectOpt && isSelected
        ? "correct-radio"
        : isWrongOpt
        ? "wrong-radio"
        : ""
      : ""
  }
/>
  {opt}
</label>
                  </li>
                );
              })}
            </ul>

            {isWrong && submitted && (
              <p className="explanation-text">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="submit-button" onClick={() => handleSubmit(false)}>
            Submit Quiz
          </button>
        </div>
      )}

      {submitted && (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    {calculating ? (
      <div>
        <div className="loading-spinner" />
        <div style={{ marginTop: "10px", color: "#ccc", fontSize: "0.95rem" }}>
          Calculating score...
        </div>
      </div>
    ) : (
      <div style={{ color: "#ffff", fontSize: "1.2rem", fontWeight: "bold" }}>
        You scored {score} / {quiz.questions.length}
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default QuizPage;
