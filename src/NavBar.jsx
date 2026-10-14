import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Menu, X } from "lucide-react";

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

  .ss-top-bar {
    background: #0f1b2b;
    color: #fff;
    padding: 8px clamp(24px, 3vw, 48px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .ss-top-info {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .ss-top-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255,255,255,0.85);
  }

  .ss-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px clamp(24px, 3vw, 48px);
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  }

  .ss-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    position: relative;
    z-index: 10001;
  }

  .ss-logo-img {
    height: clamp(44px, 6vw, 60px);
    width: auto;
    display: block;
  }

  .ss-nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ss-nav-links a {
    font-size: 0.95rem;
    font-weight: 700;
    color: #444;
    text-decoration: none;
    transition: all 0.25s ease;
    position: relative;
  }

  .ss-nav-links a:hover {
    color: #2563EB;
  }

  .ss-btn-primary {
    background: #E85C1A !important;
    color: #fff !important;
    border: none;
    padding: 12px 24px;
    border-radius: 9px;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    transition: all 0.25s ease;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 10px rgba(232, 92, 26, 0.2);
  }

  .ss-btn-primary:hover {
    background: #1D4ED8 !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
  }

  .ss-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #1a1a1a;
    cursor: pointer;
    padding: 8px;
    position: relative;
    z-index: 10001;
    transition: color 0.2s;
  }

  @media (max-width: 1024px) {
    .ss-nav-links { gap: 18px; }
    .ss-nav-links a { font-size: 0.9rem; }
  }

  @media (max-width: 768px) {
    .ss-top-bar { display: none; }
    .ss-nav { padding: 10px 20px; }
    .ss-menu-toggle { display: flex; align-items: center; justify-content: center; }

    .ss-nav-links {
      position: fixed !important;
      top: 0 !important;
      right: -50vw !important;
      width: 50vw !important;
      height: 100vh !important;
      background: #ffffff !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      padding: 30px !important;
      gap: 24px !important;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      z-index: 10000 !important;
      box-shadow: -15px 0 45px rgba(0,0,0,0.15) !important;
      box-sizing: border-box !important;
      left: auto !important;
      margin: 0 !important;
      visibility: visible !important;
      display: flex !important;
    }

    .ss-nav-links.active { right: 0 !important; }
    .ss-nav-links a { font-size: 1.1rem !important; font-weight: 800; color: #0f1b2b; text-align: center; }
    .ss-btn-primary { font-size: 1rem !important; padding: 12px 24px !important; width: 80% !important; max-width: 200px; text-align: center; }
  }

  .ss-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 27, 43, 0.6);
    backdrop-filter: blur(5px);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .ss-overlay.active { opacity: 1; visibility: visible; }
  
  @media (max-width: 600px) {
    .ss-hide-mobile { display: none !important; }
  }
`;

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <style>{navStyles}</style>
      <div className={`ss-overlay ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(false)} />
      <div className="ss-top-bar">
        <div className="ss-top-info">
          <div className="ss-top-item">
            <Phone size={13} /> +1 (646) 204-4191
          </div>
          <div className="ss-top-item">
            <Mail size={13} /> info@xprezzlogistics.com
          </div>
        </div>
        <div className="ss-top-item ss-hide-mobile">
          <MapPin size={13} /> 56039 Nehalem Hwy S, Vernonia, OR 97064
        </div>
      </div>
      <nav className="ss-nav">
        <a className="ss-logo" href="/" onClick={() => setIsOpen(false)}>
          <img className="ss-logo-img" src="/cargo_logo_nav.png" alt="Xprezz Logistics" />
        </a>

        <button 
          className="ss-menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        <ul className={`ss-nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          </li>
          <li>
            <Link to="/tracking" onClick={() => setIsOpen(false)}>Tracking</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          <li>
            <Link className="ss-btn-primary" to="/quote" onClick={() => setIsOpen(false)}>
              Get a Quote
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
