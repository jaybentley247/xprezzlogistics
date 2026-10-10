import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import emailjs from "@emailjs/browser";
import { API_BASE } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #000;
    color: #f5f5f5;
  }

  h1, h2, h3 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 800 !important;
  }

  .qp-wrap {
    max-width: 860px;
    margin: 48px auto;
    padding: 0 clamp(16px, 4vw, 24px) 60px;
  }

  .qp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #8a8f98;
    text-decoration: none;
    margin-bottom: 28px;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .qp-back:hover { color: #3B82F6; }

  .qp-header { margin-bottom: 36px; }
  .qp-header h1 {
    font-size: clamp(2rem, 8vw, 3.2rem);
    color: #f5f5f5;
    margin-bottom: 8px;
    line-height: 1.1;
  }
  .qp-header h1 span { color: #E85C1A; }
  .qp-header p { font-size: clamp(0.95rem, 2.5vw, 1.1rem); color: #8a8f98; }

  .qp-card {
    background: #141414;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
    padding: clamp(20px, 5vw, 36px);
    margin-bottom: 20px;
  }

  .qp-section-title {
    font-size: clamp(1rem, 3vw, 1.2rem);
    color: #f5f5f5;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1.5px solid #2a2a2a;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .qp-section-badge {
    width: 24px;
    height: 24px;
    background: #E85C1A;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }

  .qp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .qp-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  .qp-field { display: flex; flex-direction: column; gap: 6px; }
  .qp-field.full { grid-column: 1 / -1; }

  .qp-label {
    font-size: 13px;
    font-weight: 600;
    color: #b3b9c4;
    letter-spacing: 0.02em;
  }

  .qp-input, .qp-select {
    padding: 11px 14px;
    border: 1.5px solid #2a2a2a;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #f5f5f5;
    background: #1c1c1c;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }

  .qp-input:focus, .qp-select:focus { border-color: #2563EB; }
  .qp-input::placeholder { color: #6b7079; }

  .qp-service-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .qp-service-option {
    border: 2px solid #2a2a2a;
    border-radius: 10px;
    padding: 16px 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .qp-service-option.selected {
    border-color: #2563EB;
    background: rgba(37, 99, 235, 0.12);
  }

  .qp-service-option:hover { border-color: #2563EB; }

  .qp-service-name {
    font-size: 14px;
    font-weight: 700;
    color: #f5f5f5;
  }

  .qp-service-days {
    font-size: 12px;
    color: #8a8f98;
  }

  .qp-service-price {
    font-size: 15px;
    font-weight: 700;
    color: #E85C1A;
    margin-top: 6px;
  }

  .qp-service-radio {
    display: none;
  }

  .qp-submit {
    width: 100%;
    background: #E85C1A;
    color: #fff;
    border: none;
    padding: 16px;
    border-radius: 10px;
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.1s;
    margin-top: 8px;
  }

  .qp-submit:hover { background: #1D4ED8; }
  .qp-submit:active { transform: scale(0.99); }
  .qp-submit:disabled { background: #ccc; cursor: not-allowed; }

  /* SUCCESS STATE */
  .qp-success {
    background: #141414;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
    padding: clamp(40px, 8vw, 60px) clamp(20px, 5vw, 36px);
    text-align: center;
  }

  .qp-success-icon {
    width: 64px;
    height: 64px;
    background: rgba(232, 92, 26, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .qp-success h2 {
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    margin-bottom: 10px;
  }

  .qp-success p {
    font-size: 15px;
    color: #8a8f98;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .qp-quote-ref {
    display: inline-block;
    background: rgba(232, 92, 26, 0.15);
    color: #E85C1A;
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    font-weight: 700;
    padding: 10px 24px;
    border-radius: 8px;
    letter-spacing: 0.05em;
    margin-bottom: 28px;
  }

  .qp-new-quote {
    background: none;
    border: 2px solid #E85C1A;
    color: #E85C1A;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  .qp-new-quote:hover { background: #2563EB; color: #fff; }

  @media (max-width: 768px) {
    .qp-grid-2, .qp-grid-3, .qp-service-grid { grid-template-columns: 1fr; }
    .qp-field.full { grid-column: auto; }
    .qp-field:nth-child(n) { grid-column: auto; }
    .qp-card { padding: 24px 20px; }
    .qp-wrap { margin: 24px auto; padding: 0 16px 40px; }
    .qp-header { margin-bottom: 28px; }
  }
`;

const serviceOptions = [
  { id: "economy", name: "Economy", days: "5–7 business days" },
  { id: "standard", name: "Standard", days: "3–5 business days" },
  { id: "express", name: "Express", days: "1–2 business days" },
];

function genRef() {
  return "SS-" + Math.random().toString(36).toUpperCase().slice(2, 8);
}

export default function QuotePage() {
  const [form, setForm] = useState({
    fromName: "", fromAddress: "", fromCity: "", fromZip: "", fromPhone: "", fromEmail: "",
    toName: "", toAddress: "", toCity: "", toZip: "", toPhone: "", toEmail: "",
    weight: "", length: "", width: "", height: "",
    service: "standard",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ref] = useState(genRef);

  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data directly - Ensure your EmailJS template uses these exact names:
      // {{fromName}}, {{fromEmail}}, {{toName}}, {{weight}}, {{quoteRef}}, etc.
      const emailData = {
        ...form,
        quoteRef: ref,
        subject: `New Shipping Quote Request: ${ref}`
      };

      const response = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        emailData,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      console.log("SUCCESS!", response.status, response.text);
      setSubmitted(true);

      // Background backup
      fetch(`${API_BASE}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(err => console.warn("Local backend record-keeping failed:", err));

    } catch (err) {
      console.error("EmailJS Error:", err);
      alert("Something went wrong while submitting your quote request. Please check the console for details.");
    }
  };

  if (submitted) {
    return (
      <>
        <NavBar />
        <style>{styles}</style>
        <div className="qp-wrap">
          <div className="qp-success">
            <div className="qp-success-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#E85C1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Quote Request Submitted!</h2>
            <p>We've received your shipment details. Your quote reference is:</p>
            <div className="qp-quote-ref">{ref}</div>
            <p>Our team will contact you within 2 business hours to confirm pricing and arrange pickup.</p>
            <br />
            <button className="qp-new-quote" onClick={() => setSubmitted(false)}>Request Another Quote</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <div className="qp-wrap">
        <button className="qp-back" onClick={() => window.history.back()}>
          ← Back to Home
        </button>

        <div className="qp-header">
          <h1>Get a <span>Shipping Quote</span></h1>
          <p>Fill in your shipment details and we'll get back to you with the best rate.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* FROM */}
          <div className="qp-card">
            <div className="qp-section-title">
              <span className="qp-section-badge">1</span> Pickup Details
            </div>
            <div className="qp-grid-2">
              <div className="qp-field full">
                <label className="qp-label">Full Name / Company</label>
                <input className="qp-input" placeholder="e.g. Acme Corp" value={form.fromName} onChange={set("fromName")} required />
              </div>
              <div className="qp-field full">
                <label className="qp-label">Street Address</label>
                <input className="qp-input" placeholder="123 Main St" value={form.fromAddress} onChange={set("fromAddress")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">City</label>
                <input className="qp-input" placeholder="Boston" value={form.fromCity} onChange={set("fromCity")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">ZIP / Postal Code</label>
                <input className="qp-input" placeholder="02101" value={form.fromZip} onChange={set("fromZip")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">Phone Number</label>
                <input className="qp-input" placeholder="+1 (555) 000-0000" value={form.fromPhone} onChange={set("fromPhone")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">Email Address</label>
                <input className="qp-input" type="email" placeholder="email@example.com" value={form.fromEmail} onChange={set("fromEmail")} required />
              </div>
            </div>
          </div>

          {/* TO */}
          <div className="qp-card">
            <div className="qp-section-title">
              <span className="qp-section-badge">2</span> Delivery Details
            </div>
            <div className="qp-grid-2">
              <div className="qp-field full">
                <label className="qp-label">Recipient Name / Company</label>
                <input className="qp-input" placeholder="e.g. John Smith" value={form.toName} onChange={set("toName")} required />
              </div>
              <div className="qp-field full">
                <label className="qp-label">Street Address</label>
                <input className="qp-input" placeholder="456 Oak Ave" value={form.toAddress} onChange={set("toAddress")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">City</label>
                <input className="qp-input" placeholder="New York" value={form.toCity} onChange={set("toCity")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">ZIP / Postal Code</label>
                <input className="qp-input" placeholder="10001" value={form.toZip} onChange={set("toZip")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">Recipient Phone Number</label>
                <input className="qp-input" placeholder="+1 (555) 000-0000" value={form.toPhone} onChange={set("toPhone")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">Recipient Email Address</label>
                <input className="qp-input" type="email" placeholder="recipient@example.com" value={form.toEmail} onChange={set("toEmail")} required />
              </div>
            </div>
          </div>

          {/* PACKAGE */}
          <div className="qp-card">
            <div className="qp-section-title">
              <span className="qp-section-badge">3</span> Package Details
            </div>
            <div className="qp-grid-3">
              <div className="qp-field">
                <label className="qp-label">Weight (kg)</label>
                <input className="qp-input" type="number" min="0.1" step="0.1" placeholder="2.5" value={form.weight} onChange={set("weight")} required />
              </div>
              <div className="qp-field">
                <label className="qp-label">Length (cm)</label>
                <input className="qp-input" type="number" min="1" placeholder="30" value={form.length} onChange={set("length")} />
              </div>
              <div className="qp-field">
                <label className="qp-label">Width (cm)</label>
                <input className="qp-input" type="number" min="1" placeholder="20" value={form.width} onChange={set("width")} />
              </div>
              <div className="qp-field">
                <label className="qp-label">Height (cm)</label>
                <input className="qp-input" type="number" min="1" placeholder="15" value={form.height} onChange={set("height")} />
              </div>
              <div className="qp-field full" style={{ gridColumn: "2 / -1" }}>
                <label className="qp-label">Notes (optional)</label>
                <input className="qp-input" placeholder="Fragile, keep upright, etc." value={form.notes} onChange={set("notes")} />
              </div>
            </div>
          </div>

          {/* SERVICE */}
          <div className="qp-card">
            <div className="qp-section-title">
              <span className="qp-section-badge">4</span> Choose Service
            </div>
            <div className="qp-service-grid">
              {serviceOptions.map((s) => (
                <label
                  key={s.id}
                  className={`qp-service-option${form.service === s.id ? " selected" : ""}`}
                >
                  <input
                    type="radio"
                    className="qp-service-radio"
                    name="service"
                    value={s.id}
                    checked={form.service === s.id}
                    onChange={set("service")}
                  />
                  <span className="qp-service-name">{s.name}</span>
                  <span className="qp-service-days">{s.days}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="qp-submit">
            Submit Quote Request
          </button>
        </form>
      </div>
    </>
  );
}

