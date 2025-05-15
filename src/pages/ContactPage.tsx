import React, { useRef, useState } from "react";
import "../styles/ContactPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaThumbsUp, FaThumbsDown} from "react-icons/fa"; // Importing icons

function ContactPage() {
  const [, setResult] = useState("");
  const formRef = useRef(null); // Create a reference for the form
  const [hasVoted, setHasVoted] = useState(!!localStorage.getItem("contact_voted"));
  const [voteType, setVoteType] = useState(null); // 'like' or 'dislike'


  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "42005e58-6457-416b-9ef2-2cf4dc87b163");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully",
        icon: "success",
        confirmButtonText: "Cool",
        customClass: {
          title: "swal-custom-title",
          popup: "swal-custom-popup",
          confirmButton: "swal-custom-button",
        },
      });

      if (formRef.current) {
        formRef.current.reset(); // Reset the form fields
      }
    }
  };

  const navigate = useNavigate();

  React.useEffect(() => {
  if (localStorage.getItem("contact_voted")) {
    setHasVoted(true);
  }
  }, []);

  const handleVote = (type) => {
    if (hasVoted) return;

    fetch("http://127.0.0.1:8000/api/contact-feedback/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote: type }),
});

    localStorage.setItem("contact_voted", "true");
    setHasVoted(true);
    setVoteType(type);
  };

  return (
    <section className="contact">
      <div className="go-back">
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      <form onSubmit={onSubmit} className="contact-form" ref={formRef}>
        <h2 className="contact-title">
          <FaEnvelope className="contact-icon" /> Contact Us
        </h2>
        <div className="input-box">
          <label>Full Name</label>
          <input
            type="text"
            className="field"
            placeholder="Enter your full name"
            name="Name:"
            required
          />
        </div>

        <div className="input-box">
          <label>Email Address</label>
          <input
            type="email"
            className="field"
            placeholder="Enter your email"
            name="Email:"
            required
          />
        </div>

        <div className="input-box">
          <label>Message </label>
          <textarea
            name="Message:"
            className="field-message"
            placeholder="Enter your message"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Send Message
        </button>
      </form>
      <div className="about-us-content">
        <p>
          The <strong>GVT Tool</strong> helps students <strong>deepen their understanding of Graph Algorithms and Data Structures</strong> in an <strong>interactive and engaging way</strong>. We believe that <strong>active involvement</strong> boosts comprehension and retention. Rather than just reading theory, interacting with algorithms makes learning more <strong>effective, intuitive, and fun</strong>.
        </p>

        <p>
          This tool is primarily designed to support students in the {" "}
          <a href="https://ru.osiris-student.nl/onderwijscatalogus/extern/cursus?collegejaar=huidig&taal=en&cursuscode=NWI-IBC027"
             target="_blank"
             rel="noopener noreferrer"
             style={{
              color: "rgba(154, 27, 4, 0.87)",
              fontWeight: "bold",
              textDecoration: "none"
             }}> 
            Algorithms and Data Structures
            </a> course at{" "}
          <a
            href="https://www.ru.nl/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(192, 28, 0, 1)",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
             Radboud University
          </a>
          . However, it is
          <strong> open to everyone</strong> who wants to explore and deepen
          their understanding of Graph Theory and algorithmic problem-solving.
          The knowledge and techniques presented here are
          <strong> universally applicable</strong> and valuable for learners
          worldwide.
        </p>

        <p>
          🎯 We <strong> deeply appreciate</strong> you taking the time to
          explore and use the GVT Tool! We are constantly striving to{" "}
          <strong>improve and enhance</strong> your experience. If you have any{" "}
          <strong>
            questions, suggestions for improvement, or if you encounter any bugs
          </strong>
          , please don't hesitate to reach out through the{" "}
          <strong>contact form</strong>. Your feedback helps us make this tool
          even better! 🚀
        </p>

        <div className="feedback-section">
      <p>Was this page helpful?</p>
      <div className="feedback-buttons">
        <button
  className={`thumb-button like ${
    hasVoted && voteType === 'like' ? 'voted' : ''
  } ${hasVoted && voteType !== 'like' ? 'disabled-other' : ''}`}
  onClick={() => handleVote('like')}
  disabled={hasVoted}
>
  <FaThumbsUp />
</button>

<button
  className={`thumb-button dislike ${
    hasVoted && voteType === 'dislike' ? 'voted' : ''
  } ${hasVoted && voteType !== 'dislike' ? 'disabled-other' : ''}`}
  onClick={() => handleVote('dislike')}
  disabled={hasVoted}
>
  <FaThumbsDown />
</button>
      </div>
</div>



        <div className="center-container">
        <a 
        href="https://nl.linkedin.com/in/stefan-roman-1911a9211?trk=people-guest_people_search-card" target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "rgba(0, 119, 181)",
          fontWeight: "bold",
          textDecoration: "none",
        }} className="linkedin-link">Developed by Stefan Roman</a>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
