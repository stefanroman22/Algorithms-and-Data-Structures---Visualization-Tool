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

    fetch("https://algorithms-and-data-structures-yf1y.onrender.com/api/contact-feedback/", {
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

      <div className="contact-container">
        <div className="contact-form-text">
        
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
        <div className="contact-text">

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
        </div>

      </div>
      </div>
    </section>
  );
}

export default ContactPage;
