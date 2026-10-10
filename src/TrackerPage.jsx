import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { API_BASE } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

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

  .tp-wrap {
    max-width: 1140px;
    margin: 48px auto;
    padding: 0 clamp(16px, 4vw, 24px) 60px;
  }

  .tp-hero {
    position: relative;
    min-height: 360px;
    margin-bottom: 32px;
    border-radius: 28px;
    overflow: hidden;
    background: linear-gradient(125deg, #0f1b2b 0%, #1c3a62 48%, #193f68 100%);
    color: #fff;
    display: flex;
    align-items: center;
    padding: clamp(24px, 6vw, 42px) clamp(24px, 6vw, 48px);
  }

  .tp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('https://images.unsplash.com/photo-1519895609934-64e796e7f4c1?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    opacity: 0.18;
  }

  .tp-hero-content {
    position: relative;
    z-index: 1;
    max-width: 620px;
  }

  .tp-hero-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    color: #f8f8f8;
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin-bottom: 18px;
  }

  .tp-hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.2rem, 5vw, 4.8rem);
    line-height: 1.02;
    margin-bottom: 18px;
    max-width: 780px;
  }

  .tp-hero h1 span {
    color: #ffb56f;
  }

  .tp-hero p {
    color: rgba(255,255,255,0.88);
    font-size: 1.05rem;
    line-height: 1.75;
    max-width: 620px;
  }

  .tp-info-section {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .tp-info-panel {
    background: #141414;
    border-radius: 24px;
    padding: clamp(20px, 5vw, 32px);
    box-shadow: 0 24px 60px rgba(15, 27, 43, 0.08);
  }

  .tp-info-panel h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2.7rem);
    margin-bottom: 18px;
  }

  .tp-info-panel p {
    color: #b3b9c4;
    line-height: 1.8;
    margin-bottom: 0;
  }

  .tp-stat-grid {
    display: grid;
    gap: 16px;
  }

  .tp-stat-card {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 24px 22px;
    border-radius: 20px;
    background: #141414;
    box-shadow: 0 18px 40px rgba(15, 27, 43, 0.07);
  }

  .tp-stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E85C1A;
    color: #fff;
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  .tp-stat-text h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    font-weight: 700;
    color: #f5f5f5;
  }

  .tp-stat-text p {
    margin: 0;
    color: #6b7484;
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .tp-bottom-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    margin-top: 40px;
  }

  .tp-card {
    background: #141414;
    border-radius: 22px;
    padding: 28px;
    box-shadow: 0 22px 48px rgba(15, 27, 43, 0.06);
  }

  .tp-card h3 {
    margin: 0 0 16px;
    font-size: 1.05rem;
    color: #f5f5f5;
  }

  .tp-card p,
  .tp-card a,
  .tp-card li {
    color: #b3b9c4;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .tp-card-link {
    display: block;
    margin-bottom: 12px;
    color: #f5f5f5;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .tp-card-link:hover {
    color: #3B82F6;
  }

  .tp-card-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }

  .tp-card-list li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .tp-card-list-icon {
    color: #E85C1A;
    min-width: 18px;
    font-size: 1rem;
    line-height: 1;
    margin-top: 2px;
  }

  .tp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #8a8f98;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-bottom: 28px;
    transition: color 0.2s;
  }
  .tp-back:hover { color: #3B82F6; }

  .tp-header { margin-bottom: 32px; }
  .tp-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 800;
    margin-bottom: 8px;
  }
  .tp-header h1 span { color: #E85C1A; }
  .tp-header p { font-size: 15px; color: #8a8f98; }

  .tp-search-card {
    background: #141414;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
    padding: clamp(20px, 4vw, 32px);
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .tp-search-field { flex: 1; display: flex; flex-direction: column; gap: 6px; }

  .tp-label {
    font-size: 13px;
    font-weight: 600;
    color: #b3b9c4;
  }

  .tp-input {
    padding: 12px 16px;
    border: 1.5px solid #2a2a2a;
    border-radius: 9px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #f5f5f5;
    background: #1c1c1c;
    outline: none;
    transition: border-color 0.2s;
    letter-spacing: 0.04em;
    width: 100%;
  }
  .tp-input:focus { border-color: #2563EB; }
  .tp-input::placeholder { color: #6b7079; letter-spacing: 0; }

  .tp-search-btn {
    background: #E85C1A;
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 9px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }
  .tp-search-btn:hover { background: #1D4ED8; }
  .tp-search-btn:active { transform: scale(0.97); }
  .tp-search-btn:disabled { background: #ccc; cursor: not-allowed; }

  .tp-loading {
    background: #141414;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
    padding: 52px 32px;
    text-align: center;
    color: #8a8f98;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .tp-wrap { padding: 0 16px 40px; margin: 24px auto; }
    .tp-hero { padding: 32px 24px; min-height: auto; margin-bottom: 24px; }
    .tp-info-section { grid-template-columns: 1fr; gap: 16px; }
    .tp-bottom-grid { grid-template-columns: 1fr; gap: 16px; }
    .tp-search-card { padding: 20px; gap: 16px; flex-direction: column; align-items: stretch; }
    .tp-search-btn { width: 100%; }
    .tp-stat-card { padding: 18px; }
  }

  @media (max-width: 600px) {
    .tp-header h1 { font-size: clamp(1.4rem, 5vw, 1.8rem); }
  }
`;

export default function TrackerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const key = input.trim().toUpperCase();
    if (!key) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_BASE}/api/tracking/${key}`);
      if (res.ok) {
        navigate(`/shipment/${key}`);
      } else {
        setError("Invalid tracking number. Please check and try again.");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <div className="tp-wrap">
        <div className="tp-hero">
          <div className="tp-hero-content">
            <div className="tp-hero-label">
              <span>●</span> Real-time Logistics Tracking
            </div>
            <h1>Track your <span>Global</span> Shipments</h1>
            <p>
              Get instant updates on your cargo's location and status. Our advanced
              tracking system provides end-to-end visibility for all your logistics needs.
            </p>
          </div>
        </div>

        <div className="tp-search-card">
          <div className="tp-search-field">
            <label className="tp-label">Tracking Number</label>
            <input
              type="text"
              className="tp-input"
              placeholder="e.g. AWB123456789"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            className="tp-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Track Package"}
          </button>
        </div>

        {error && (
          <div style={{ color: "#e53935", marginBottom: "20px", textAlign: "center", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <div className="tp-info-section">          <div className="tp-info-panel">
            <h2>Track Smarter</h2>
            <p>
              Our unified tracking platform integrates with multiple carriers to give you a 
              single point of truth for all your shipments. Whether it's air freight, 
              ocean cargo, or road transport, stay informed every step of the way.
            </p>
          </div>
          <div className="tp-stat-grid">
            <div className="tp-stat-card">
              <div className="tp-stat-icon">✓</div>
              <div className="tp-stat-text">
                <h3>99.9% Accuracy</h3>
                <p>Real-time data synchronization with global ports.</p>
              </div>
            </div>
            <div className="tp-stat-card">
              <div className="tp-stat-icon">⚡</div>
              <div className="tp-stat-text">
                <h3>Instant Alerts</h3>
                <p>Get notified of any status changes immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-bottom-grid">
          <div className="tp-card">
            <h3>Support & Help</h3>
            <p>Need assistance with your shipment?</p>
            <div style={{ marginTop: "12px" }}>
              <a href="/contact" className="tp-card-link">Contact Support →</a>
              <a href="/about" className="tp-card-link">FAQs →</a>
            </div>
          </div>
          <div className="tp-card">
            <h3>Our Services</h3>
            <ul className="tp-card-list">
              <li><span className="tp-card-list-icon">→</span> Air Freight</li>
              <li><span className="tp-card-list-icon">→</span> Ocean Cargo</li>
              <li><span className="tp-card-list-icon">→</span> Express Delivery</li>
            </ul>
          </div>
          <div className="tp-card">
            <h3>Business Solutions</h3>
            <p>Looking for enterprise-grade logistics management?</p>
            <a href="/quote" className="tp-card-link" style={{ marginTop: "12px" }}>Get a Quote →</a>
          </div>
        </div>
      </div>
    </>
  );
}
