import React, { useState } from "react";
import NavBar from "./NavBar";
import emailjs from "@emailjs/browser";
import { API_BASE } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    background: #000;
    color: #f5f5f5;
  }

  .cp-wrap {
    max-width: 980px;
    margin: 48px auto;
    padding: 0 clamp(16px, 4vw, 24px) 60px;
  }

  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 1.8fr;
    gap: 24px;
    align-items: start;
  }

  .cp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #8a8f98;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-bottom: 28px;
    transition: color 0.2s;
  }
  .cp-back:hover { color: #3B82F6; }

  .cp-header { margin-bottom: 36px; }
  .cp-header h1 {
    font-family: 'Poppins', sans-serif !important;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    font-weight: 800;
    margin-bottom: 8px;
  }
  .cp-header h1 span { color: #E85C1A; }
  .cp-header p { font-size: 15px; color: #8a8f98; }

  .cp-hero-image {
    width: 100%;
    height: clamp(200px, 40vh, 320px);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 40px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.08);
  }
  .cp-hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 24px;
    align-items: start;
  }

  /* INFO SIDE */
  .cp-info { display: flex; flex-direction: column; gap: 16px; }

  .cp-info-card {
    background: #141414;
    border-radius: 14px;
    border: 1px solid #2a2a2a;
    padding: 24px;
  }

  .cp-info-card h2 {
    font-family: 'Poppins', sans-serif !important;
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 16px;
    color: #f5f5f5;
  }

  .cp-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .cp-contact-item:last-child { margin-bottom: 0; }

  .cp-contact-icon {
    width: 36px;
    height: 36px;
    background: rgba(232, 92, 26, 0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cp-contact-text { display: flex; flex-direction: column; gap: 2px; }
  .cp-contact-label { font-size: 11px; font-weight: 700; color: #8a8f98; text-transform: uppercase; letter-spacing: 0.05em; }
  .cp-contact-value { font-size: 14px; font-weight: 500; color: #f5f5f5; }

  .cp-hours-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cp-hours-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding-bottom: 8px;
    border-bottom: 1px solid #2a2a2a;
  }
  .cp-hours-row:last-child { border-bottom: none; padding-bottom: 0; }
  .cp-hours-day { color: #b3b9c4; font-weight: 500; }
  .cp-hours-time { color: #f5f5f5; font-weight: 600; }
  .cp-hours-time.closed { color: #6b7079; }

  .cp-orange-card {
    background: #E85C1A;
    border-radius: 14px;
    padding: 24px;
    color: #fff;
  }

  .cp-orange-card h3 {
    font-family: 'Poppins', sans-serif !important;
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .cp-orange-card p {
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .cp-orange-btn {
    background: #fff;
    color: #E85C1A;
    border: none;
    padding: 10px 20px;
    border-radius: 7px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.2s;
  }
  .cp-orange-btn:hover { opacity: 0.9; }

  /* FORM SIDE */
  .cp-form-card {
    background: #141414;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
    padding: clamp(20px, 5vw, 32px);
  }

  .cp-form-card h2 {
    font-family: 'Poppins', sans-serif !important;
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 24px;
    color: #f5f5f5;
  }

  .cp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  .cp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .cp-field:last-of-type { margin-bottom: 0; }

  .cp-label {
    font-size: 13px;
    font-weight: 600;
    color: #b3b9c4;
  }

  .cp-input, .cp-select, .cp-textarea {
    padding: 11px 14px;
    border: 1.5px solid #2a2a2a;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #f5f5f5;
    background: #1c1c1c;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus { border-color: #2563EB; }
  .cp-input::placeholder, .cp-textarea::placeholder { color: #6b7079; }

  .cp-textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .cp-submit {
    width: 100%;
    background: #E85C1A;
    color: #fff;
    border: none;
    padding: 14px;
    border-radius: 9px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, transform 0.1s;
    margin-top: 20px;
  }
  .cp-submit:hover { background: #1D4ED8; }
  .cp-submit:active { transform: scale(0.99); }

  /* SUCCESS */
  .cp-success {
    text-align: center;
    padding: 40px 20px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cp-success-icon {
    width: 60px;
    height: 60px;
    background: rgba(232, 92, 26, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .cp-success h3 {
    font-family: 'Poppins', sans-serif !important;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .cp-success p {
    font-size: 14px;
    color: #8a8f98;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .cp-new-msg {
    background: none;
    border: 2px solid #E85C1A;
    color: #E85C1A;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  .cp-new-msg:hover { background: #2563EB; color: #fff; }

  @media (max-width: 768px) {
    .cp-layout { grid-template-columns: 1fr; gap: 40px; }
    .cp-grid-2 { grid-template-columns: 1fr; }
    .cp-wrap { margin: 24px auto; }
  }
`;

const topics = [
  "General Inquiry",
  "Get a Quote",
  "Track a Shipment",
  "Billing & Invoices",
  "Complaint / Issue",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Attempting to submit contact form...");

  // 1. Try to save to backend first (our primary data store)
  let backendSuccess = false;
  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    if (response.ok) {
      backendSuccess = true;
      console.log("Backend submission successful");
    } else {
      console.warn("Backend returned an error:", response.status);
    }
  } catch (err) {
    console.warn("Could not connect to backend:", err.message);
  }

  // 2. Try to send via EmailJS as a notification
  try {
    await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || "N/A",
        topic: form.topic,
        message: form.message,
      },
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );
    console.log("EmailJS notification sent");
    setSubmitted(true);
  } catch (err) {
    console.error("EmailJS notification failed:", err);
    
    // If backend worked but EmailJS failed, we still count it as a success for the user
    if (backendSuccess) {
      setSubmitted(true);
    } else {
      alert(`Submission Failed: Both email and backup storage failed. Error: ${err.text || err.message || "Unknown Error"}`);
    }
  }
};

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <div className="cp-wrap">
        <button className="cp-back" onClick={() => window.history.back()}>
          ← Back to Home
        </button>

        <div className="cp-header">
          <h1>
            Get in <span>Touch</span>
          </h1>
          <p>
            We're here to help. Reach out and our team will respond within 2
            business hours.
          </p>
        </div>

        <div className = "cp-hero-image">
          <img
            src="https://www.image2url.com/r2/default/images/1779534829460-4f0aadf0-8b86-40c1-82be-c67cd8876852.jpg"
            alt="Xprezz Logistics Customer Support Center"
          />
        </div>

        <div className="cp-layout">
          {/* LEFT — Info */}
          <div className="cp-info">
            <div className="cp-info-card">
              <h2>Contact Information</h2>

              <div className="cp-contact-item">
                <div className="cp-contact-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#E85C1A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h14a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" />
                    <path d="M1 4l8 6 8-6" />
                  </svg>
                </div>
                <div className="cp-contact-text">
                  <span className="cp-contact-label">Email</span>
                  <span className="cp-contact-value">
                    info@xprezzlogistics.com
                  </span>
                </div>
              </div>

              <div className="cp-contact-item">
                <div className="cp-contact-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#E85C1A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 2h4l2 5-2.5 1.5a11 11 0 005 5L12 11l5 2v4a1 1 0 01-1 1C6 18 0 12 0 3a1 1 0 011-1h1z" />
                  </svg>
                </div>
                <div className="cp-contact-text">
                  <span className="cp-contact-label">Phone</span>
                  <span className="cp-contact-value">+1 (646) 204-4191</span>
                </div>
              </div>

              <div className="cp-contact-item">
                <div className="cp-contact-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#E85C1A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 1C6.24 1 4 3.24 4 6c0 4 5 11 5 11s5-7 5-11c0-2.76-2.24-5-5-5z" />
                    <circle cx="9" cy="6" r="2" />
                  </svg>
                </div>
                <div className="cp-contact-text">
                  <span className="cp-contact-label">Address</span>
                  <span className="cp-contact-value">
                    56039 Nehalem Hwy S, Vernonia, OR 97064
                  </span>
                </div>
              </div>
            </div>

            <div className="cp-info-card">
              <h2>Business Hours</h2>
              <div className="cp-hours-grid">
                {[
                  { day: "Monday – Friday", time: "8:00 AM – 7:00 PM" },
                  { day: "Saturday", time: "9:00 AM – 4:00 PM" },
                  { day: "Sunday", time: "Closed", closed: true },
                ].map((r) => (
                  <div className="cp-hours-row" key={r.day}>
                    <span className="cp-hours-day">{r.day}</span>
                    <span
                      className={`cp-hours-time${r.closed ? " closed" : ""}`}
                    >
                      {r.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cp-orange-card">
              <h3>Need a quote fast?</h3>
              <p>
                Skip the message and get an instant shipping estimate in under a
                minute.
              </p>
              <button
                className="cp-orange-btn"
                onClick={() => (window.location.href = "/quote")}
              >
                Get a Quote →
              </button>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="cp-form-card">
            {submitted ? (
              <div className="cp-success">
                <div className="cp-success-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path
                      d="M5 14l6 6 12-12"
                      stroke="#E85C1A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thanks for reaching out. A member of our team will get back to
                  you within 2 business hours.
                </p>
                <button
                  className="cp-new-msg"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="cp-grid-2">
                    <div className="cp-field" style={{ marginBottom: 0 }}>
                      <label className="cp-label">First Name</label>
                      <input
                        className="cp-input"
                        placeholder="John"
                        value={form.firstName}
                        onChange={set("firstName")}
                        required
                      />
                    </div>
                    <div className="cp-field" style={{ marginBottom: 0 }}>
                      <label className="cp-label">Last Name</label>
                      <input
                        className="cp-input"
                        placeholder="Smith"
                        value={form.lastName}
                        onChange={set("lastName")}
                        required
                      />
                    </div>
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Email Address</label>
                    <input
                      className="cp-input"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Phone (optional)</label>
                    <input
                      className="cp-input"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Topic</label>
                    <select
                      className="cp-select"
                      value={form.topic}
                      onChange={set("topic")}
                      required
                    >
                      <option value="">Select a topic...</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Message</label>
                    <textarea
                      className="cp-textarea"
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={set("message")}
                      required
                    />
                  </div>

                  <button type="submit" className="cp-submit">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
