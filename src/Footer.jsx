import React from "react";
import { Link } from "react-router-dom";

const footerStyles = `
  .ss-footer {
    background: #000;
    border-top: 1px solid #1f1f1f;
    color: #fff;
    padding: clamp(40px, 8vw, 80px) clamp(16px, 4vw, 24px) 40px;
    font-family: 'Inter', sans-serif;
  }

  .ss-footer-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
    gap: clamp(30px, 5vw, 60px);
    margin-bottom: 60px;
  }

  .ss-footer-brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    text-decoration: none;
    width: fit-content;
    background: #fff;
    padding: 10px 16px;
    border-radius: 10px;
  }

  .ss-footer-logo-img {
    height: clamp(48px, 8vw, 68px);
    width: auto;
    display: block;
    border-radius: 6px;
  }

  .ss-footer-brand p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
    font-size: 0.95rem;
    max-width: 300px;
  }

  .ss-footer-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.15rem);
    font-weight: 700;
    margin-bottom: 24px;
    color: #fff;
    position: relative;
    letter-spacing: 0.05em;
  }

  .ss-footer-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background: #E85C1A;
  }

  .ss-footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ss-footer-links li {
    margin-bottom: 14px;
  }

  .ss-footer-links a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease, padding-left 0.2s ease;
    display: inline-block;
  }

  .ss-footer-links a:hover {
    color: #3B82F6;
    padding-left: 5px;
  }

  .ss-footer-contact {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ss-footer-contact-item {
    display: flex;
    gap: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .ss-footer-contact-icon {
    color: #E85C1A;
    font-weight: bold;
  }

  .ss-footer-social {
    display: flex;
    gap: 15px;
    margin-top: 20px;
  }

  .ss-social-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    place-items: center;
    color: #fff;
    text-decoration: none;
    border: none;
    font: inherit;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .ss-social-icon:hover {
    background: #2563EB;
    transform: translateY(-3px);
  }

  .ss-footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
    flex-wrap: wrap;
    gap: 20px;
  }

  .ss-footer-legal {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .ss-footer-legal a,
  .ss-footer-legal button {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    background: none;
    border: none;
    font: inherit;
    padding: 0;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .ss-footer-legal a:hover,
  .ss-footer-legal button:hover {
    color: #fff;
  }

  @media (max-width: 900px) {
    .ss-footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
  }

  @media (max-width: 768px) {
    .ss-footer-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .ss-footer { padding-top: 48px; padding-bottom: 32px; }
    .ss-footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    .ss-footer-legal { justify-content: center; }
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ss-footer">
        <div className="ss-footer-grid">
          <div className="ss-footer-brand">
            <a href="/" className="ss-footer-brand-logo">
              <img className="ss-footer-logo-img" src="/cargo_logo.png" alt="Xprezz Logistics" />
            </a>
            <p>
              Providing reliable, fast, and transparent logistics solutions for
              businesses worldwide since 2010. Your success is our mission.
            </p>
            <div className="ss-footer-social">
              <button type="button" className="ss-social-icon">
                f
              </button>
              <button type="button" className="ss-social-icon">
                t
              </button>
              <button type="button" className="ss-social-icon">
                in
              </button>
              <button type="button" className="ss-social-icon">
                ig
              </button>
            </div>
          </div>

          <div>
            <h4 className="ss-footer-title">Quick Links</h4>
            <ul className="ss-footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/tracking">Track Shipment</Link>
              </li>
              <li>
                <Link to="/quote">Get a Quote</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="ss-footer-title">Our Services</h4>
            <ul className="ss-footer-links">
              <li>
                <Link to="/services">Road Freight</Link>
              </li>
              <li>
                <Link to="/services">Ocean Freight</Link>
              </li>
              <li>
                <Link to="/services">Air Freight</Link>
              </li>
              <li>
                <Link to="/services">Rail Freight</Link>
              </li>
              <li>
                <Link to="/services">Warehousing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="ss-footer-title">Contact Us</h4>
            <div className="ss-footer-contact">
              <div className="ss-footer-contact-item">
                <span className="ss-footer-contact-icon">📍</span>
                <span>
                  56039 Nehalem Hwy S
                  <br />
                  Vernonia, OR 97064
                </span>
              </div>
              <div className="ss-footer-contact-item">
                <span className="ss-footer-contact-icon">📞</span>
                <span>+1 (646) 204-4191</span>
              </div>
              <div className="ss-footer-contact-item">
                <span className="ss-footer-contact-icon">✉️</span>
                <span>info@xprezzlogistics.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ss-footer-bottom">
          <div>© {currentYear} Xprezz Logistics. All rights reserved.</div>
          <div className="ss-footer-legal">
            <button type="button">Privacy Policy</button>
            <button type="button">Terms of Service</button>
            <button type="button">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </>
  );
}

