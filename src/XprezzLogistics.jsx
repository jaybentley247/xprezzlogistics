import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    color: #f5f5f5;
    background: #000;
    min-height: 100vh;
  }

  h1, h2, h3, h4 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 800 !important;
  }

  button, input, textarea, a {
    font: inherit;
  }

  button { cursor: pointer; }

  .ss-page {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    background: transparent;
    border-radius: 0;
    overflow: hidden;
  }

  /* HERO */
  .ss-hero {
    position: relative;
    display: grid;
    min-height: 85vh;
    padding: 64px clamp(24px, 4vw, 72px);
    gap: 40px;
    align-items: center;
    width: 100%;
    overflow: hidden;
  }

  .ss-slider {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .ss-slide {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1s ease;
  }

  .ss-slide.active {
    opacity: 1;
  }

  .ss-slide::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 25%, rgba(0,0,0,0.25) 100%);
  }

  .ss-hero-text {
    position: relative;
    z-index: 2;
    max-width: 560px;
  }

  .ss-hero-eyebrow {
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin-bottom: 18px;
  }

  .ss-hero-text h1 {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2.2rem, 4.8vw, 5.2rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 18px;
    color: #fff;
  }

  .ss-hero-text p {
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    color: rgba(255,255,255,0.9);
    margin-bottom: 30px;
    line-height: 1.75;
    max-width: 520px;
  }

  .ss-hero-btn {
    background: #ff6b3c;
    color: #fff;
    border: none;
    padding: clamp(12px, 2vw, 16px) clamp(24px, 4vw, 34px);
    border-radius: 999px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    transition: background 0.2s ease, transform 0.1s ease;
  }

  .ss-hero-btn:hover { background: #1D4ED8; }
  .ss-hero-btn:active { transform: scale(0.97); }

  .ss-hero-text h1 span {
    color: #ff6b00;
  }

  /* DETAILED SERVICES SECTIONS */
  .ss-detailed-services {
    padding: clamp(40px, 8vw, 80px) 0;
    background: #000;
  }

  .ss-section-intro {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 60px;
    padding: 0 24px;
  }
  .ss-section-intro h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: 20px; }
  .ss-section-intro p { font-size: clamp(0.95rem, 1.1vw, 1.1rem); color: #b3b9c4; line-height: 1.6; }

  .ss-feature-row {
    display: flex;
    align-items: center;
    gap: clamp(30px, 6vw, 60px);
    margin-bottom: clamp(60px, 10vw, 100px);
    padding: 0 clamp(20px, 5vw, 100px);
  }
  .ss-feature-row:nth-child(even) { flex-direction: row-reverse; }
  .ss-feature-row:last-child { margin-bottom: 0; }

  .ss-feature-image {
    flex: 1.2;
    border-radius: 30px;
    overflow: hidden;
    height: clamp(300px, 40vh, 450px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.1);
  }
  .ss-feature-image img { width: 100%; height: 100%; object-fit: cover; }

  .ss-feature-content { flex: 0.8; }
  .ss-feature-tag {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(232, 92, 26, 0.15);
    color: #E85C1A;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
  .ss-feature-content h3 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); margin-bottom: 20px; color: #f5f5f5; line-height: 1.2; }
  .ss-feature-content p { font-size: clamp(0.95rem, 1vw, 1.05rem); color: #b3b9c4; line-height: 1.8; margin-bottom: 25px; }
  .ss-feature-list { list-style: none; display: grid; gap: 12px; }
  .ss-feature-list li { display: flex; align-items: center; gap: 10px; font-weight: 600; color: #f5f5f5; font-size: 0.95rem; }
  .ss-feature-list li::before { content: '✓'; color: #27ae60; font-weight: 900; }

  /* GLOBAL NETWORK SECTION */
  .ss-global {
    padding: clamp(60px, 10vw, 100px) clamp(20px, 5vw, 48px);
    background: #000;
    color: #fff;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ss-global::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    opacity: 0.15;
  }
  .ss-global-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
  .ss-global-content h2 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 25px; }
  .ss-global-content h2 span { color: #ff6b00; }
  .ss-global-content p { font-size: clamp(1rem, 1.5vw, 1.2rem); color: rgba(255,255,255,0.8); line-height: 1.8; margin-bottom: 40px; }
  .ss-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(20px, 4vw, 30px); margin-top: 60px; }
  .ss-stat-item h4 { font-size: clamp(1.8rem, 4vw, 2.8rem); color: #ff6b00; margin-bottom: 10px; }
  .ss-stat-item div { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: rgba(255,255,255,0.6); }

  /* SERVICES */
  .ss-services {
    padding: clamp(40px, 8vw, 72px) clamp(20px, 4vw, 72px);
    background: #000;
  }

  .ss-services h2 {
    font-size: clamp(1.6rem, 2.4vw, 2.4rem);
    color: #f5f5f5;
  }

  .ss-services-sub {
    font-size: 0.95rem;
    color: #b3b9c4;
    margin-bottom: 30px;
    max-width: 560px;
  }

  .ss-services-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }

  .ss-service-card {
    border: 1.5px solid #2a2a2a;
    border-radius: 20px;
    padding: 24px;
    background: #141414;
    transition: border-color 0.25s ease, transform 0.25s ease;
    cursor: pointer;
  }

  .ss-service-card:hover {
    border-color: #2563EB;
    transform: translateY(-4px);
  }

  .ss-service-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(232, 92, 26, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
  }

  .ss-service-card h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #f5f5f5;
  }

  .ss-service-card p {
    font-size: 0.95rem;
    color: #b3b9c4;
    line-height: 1.7;
  }

  /* ABOUT */
  .ss-about {
    padding: clamp(40px, 8vw, 72px) clamp(20px, 4vw, 72px);
    background: #000;
  }

  .ss-about-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(30px, 5vw, 60px);
    align-items: center;
  }

  .ss-about-visual {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    min-height: clamp(300px, 40vh, 480px);
    box-shadow: 0 30px 80px rgba(14, 28, 50, 0.09);
  }

  .ss-about-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ss-about-highlight {
    position: absolute;
    top: 24px;
    left: 24px;
    background: #ff6b3c;
    color: #fff;
    padding: 10px 18px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
    box-shadow: 0 18px 30px rgba(255, 107, 60, 0.18);
  }

  .ss-about-copy h2 {
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    line-height: 1.1;
    margin-bottom: 18px;
    color: #f5f5f5;
  }

  .ss-about-highlight-heading {
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #e85c1a;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .ss-about-eyebrow {
    font-size: 0.95rem;
    font-weight: 700;
    color: #E85C1A;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin-bottom: 18px;
  }

  .ss-about-copy p {
    max-width: 560px;
    color: #b3b9c4;
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 28px;
  }

  .ss-about-cards {
    display: grid;
    gap: 18px;
  }

  .ss-about-card {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    background: #141414;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 18px 40px rgba(14, 28, 50, 0.07);
  }

  .ss-about-card-icon {
    width: 52px;
    min-width: 52px;
    height: 52px;
    border-radius: 16px;
    background: #ff6b3c;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  /* TESTIMONIALS SECTION */
  .ss-testimonials-section {
    padding: clamp(40px, 8vw, 80px) clamp(20px, 4vw, 72px);
    background: #000;
  }
  .ss-testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 3vw, 30px);
    margin-top: 50px;
  }
  .ss-testimonial-card {
    background: #141414;
    padding: clamp(24px, 4vw, 40px) clamp(20px, 3vw, 30px);
    border-radius: 24px;
    border: 1px solid #2a2a2a;
    transition: transform 0.3s ease;
    text-align: left;
  }
  .ss-testimonial-card:hover { transform: translateY(-5px); }
  .ss-testimonial-quote {
    font-size: 1rem;
    font-style: italic;
    color: #b3b9c4;
    margin-bottom: 25px;
    line-height: 1.7;
    position: relative;
  }
  .ss-testimonial-quote::before {
    content: '"';
    font-family: 'Poppins', sans-serif;
    font-size: 3rem;
    color: #E85C1A;
    opacity: 0.15;
    position: absolute;
    top: -20px;
    left: -10px;
  }
  .ss-testimonial-profile { display: flex; align-items: center; gap: 15px; margin-top: auto; }
  .ss-testimonial-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid #E85C1A; }
  .ss-testimonial-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .ss-testimonial-author { font-weight: 800; color: #f5f5f5; font-size: 1rem; }
  .ss-testimonial-role { font-size: 0.85rem; color: #E85C1A; font-weight: 700; margin-top: 2px; }

  @media (max-width: 1024px) {
    .ss-hero { grid-template-columns: 1fr; padding: 52px 24px 40px; }
    .ss-about-grid { grid-template-columns: 1fr; }
    .ss-about { padding: 52px 24px; }
    .ss-feature-row { flex-direction: column !important; padding: 0 24px; gap: 30px; }
    .ss-feature-image { width: 100%; height: 320px; }
    .ss-services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .ss-stats-row { grid-template-columns: 1fr 1fr; }
    .ss-testimonials-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .ss-nav { padding: 18px 20px; }
    .ss-hero { min-height: auto; gap: 30px; padding: 42px 20px 32px; }
    .ss-hero-text h1 { font-size: clamp(1.8rem, 8vw, 2.35rem); }
    .ss-services-grid { grid-template-columns: 1fr; }
    .ss-stats-row { gap: 15px; }
    .ss-stat-item h4 { font-size: 1.8rem; }
  }

  @media (max-width: 480px) {
    .ss-hero-text h1 { font-size: 1.8rem; }
    .ss-hero-eyebrow { font-size: 0.8rem; letter-spacing: 0.12em; }
    .ss-section-intro h2 { font-size: 1.6rem; }
    .ss-feature-content h3 { font-size: 1.4rem; }
    .ss-global-content h2 { font-size: 1.8rem; }
  }
`;

function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
}

const heroSlides = [
  "https://www.image2url.com/r2/default/images/1778878619283-b2bf87a4-2eb4-46d1-bfa2-89d211257a09.jpg",
];

function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveIndex((index) => (index + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ss-slider">
      {heroSlides.map((src, index) => (
        <div
          key={src}
          className={`ss-slide ${index === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}

const servicesList = [
  {
    title: "Road Freight Logistics",
    desc: "National and cross-border trucking with flexible delivery options.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E85C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16h16v2a1 1 0 001 1h1a1 1 0 001-1v-2" />
        <path d="M18 12h-3V8H2v8h3" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
      </svg>
    ),
  },
  {
    title: "Ocean Freight Logistics",
    desc: "Container shipping for imports and exports with FCL/LCL support.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E85C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18h18" />
        <path d="M3 18l2-7h14l2 7" />
        <path d="M7 11V7" />
        <path d="M12 11V6" />
        <path d="M17 11V8" />
      </svg>
    ),
  },
  {
    title: "Air Freight Logistics",
    desc: "Fast air cargo solutions for urgent and time-sensitive deliveries.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E85C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M6 12l4-4 4 4" />
        <path d="M10 12v8" />
        <path d="M8 4l-2 2" />
        <path d="M16 4l2 2" />
      </svg>
    ),
  },
  {
    title: "Rail Freight Logistics",
    desc: "Cost-efficient rail transport for inland and intermodal routes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E85C1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18h18" />
        <path d="M6 18V9h12v9" />
        <path d="M6 9l3-3h6l3 3" />
        <circle cx="8" cy="21" r="2" />
        <circle cx="16" cy="21" r="2" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote: "Xprezz Logistics has been a game changer for our business. Always on time and extremely reliable!",
    author: "Michael R.",
    role: "Supply Chain Manager",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Their global network and real-time tracking give us peace of mind for every shipment.",
    author: "Sarah J.",
    role: "Logistics Director",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Exceptional service and competitive rates. They handled our complex international moves with ease.",
    author: "David K.",
    role: "CEO of GlobalTrade",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "The team is incredibly responsive. Our urgent medical supplies always arrive exactly when needed.",
    author: "Amina W.",
    role: "Operations Chief",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I've worked with many logistics firms, but Xprezz Logistics' transparency is truly unmatched.",
    author: "Marcus T.",
    role: "Distribution Lead",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Highly recommend for any business looking to scale. Their rail freight options saved us 30% on costs.",
    author: "Elena G.",
    role: "Sustainability Manager",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
];

export default function XprezzLogistics() {
  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <div className="ss-page">
        <section className="ss-hero">
          <HeroSlider />
          <div className="ss-hero-text">
            <div className="ss-hero-eyebrow">Xprezz Logistics</div>
            <h1>
              Flexible and Cost Efficient
              <br />
              <span>Logistics for your business</span>
            </h1>
            <p>
              Our personal and professional approach to shipping provides you with a customizable service through our worldwide network.
            </p>
            <Link to="/quote" className="ss-hero-btn" style={{ textDecoration: "none", display: "inline-block" }}>
              Request a Quote
            </Link>
          </div>
        </section>

        <section className="ss-detailed-services">
          <div className="ss-section-intro">
            <h2>
              Comprehensive <span>Logistics</span> Solutions
            </h2>
            <p>
              We provide a wide range of specialized services designed to streamline your supply chain and ensure your cargo reaches its destination safely and efficiently.
            </p>
          </div>

          <div className="ss-feature-row">
            <div className="ss-feature-image">
              <img src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80" alt="Air" />
            </div>
            <div className="ss-feature-content">
              <span className="ss-feature-tag">Priority Service</span>
              <h3>Global Air Cargo Solutions</h3>
              <p>When time is of the essence, our air freight services offer the speed and reliability your business demands.</p>
              <ul className="ss-feature-list">
                <li>Next-flight-out emergency services</li>
                <li>Door-to-door international delivery</li>
                <li>Full and part charter options</li>
                <li>Real-time temperature monitoring</li>
              </ul>
            </div>
          </div>

          <div className="ss-feature-row">
            <div className="ss-feature-image">
              <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1000&q=80" alt="Ocean" />
            </div>
            <div className="ss-feature-content">
              <span className="ss-feature-tag">Bulk & Container</span>
              <h3>Strategic Ocean Freight</h3>
              <p>For cost-effective transport of large volumes, our sea freight solutions are unparalleled.</p>
              <ul className="ss-feature-list">
                <li>Full Container Load (FCL) management</li>
                <li>Less than Container Load (LCL) consolidation</li>
                <li>Specialized breakbulk cargo handling</li>
                <li>Port-to-port and door-to-door coverage</li>
              </ul>
            </div>
          </div>

          <div className="ss-feature-row">
            <div className="ss-feature-image">
              <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80" alt="Road" />
            </div>
            <div className="ss-feature-content">
              <span className="ss-feature-tag">Ground Network</span>
              <h3>Reliable Road Transport</h3>
              <p>Our extensive ground network ensures seamless last-mile delivery and cross-border trucking.</p>
              <ul className="ss-feature-list">
                <li>Dedicated regional delivery fleets</li>
                <li>GPS-tracked secure transportation</li>
                <li>Hazardous materials handling</li>
                <li>Consolidated LTL ground services</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="ss-global">
          <div className="ss-global-content">
            <h2>
              Worldwide <span>Presence</span>
            </h2>
            <p>Strategic hubs in over 120 countries, connecting your business with markets around the world.</p>
            <div className="ss-stats-row">
              <div className="ss-stat-item">
                <h4>
                  <AnimatedCounter end={165} suffix="+" />
                </h4>
                <div>Countries Covered</div>
              </div>
              <div className="ss-stat-item">
                <h4>
                  <AnimatedCounter end={1240} suffix="+" />
                </h4>
                <div>Global Logistics Hubs</div>
              </div>
              <div className="ss-stat-item">
                <h4>
                  <AnimatedCounter end={65000} suffix="+" />
                </h4>
                <div>Daily Shipments</div>
              </div>
              <div className="ss-stat-item">
                <h4>
                  <AnimatedCounter end={99} suffix="%" />
                </h4>
                <div>Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        <section className="ss-about" id="about">
          <div className="ss-about-grid">
            <div className="ss-about-visual">
              <img src="https://optimalexpresscargo.delivery/images/resource/about1-1.jpg" alt="About" />
              <div className="ss-about-highlight">24/7 Delivery Service</div>
            </div>
            <div className="ss-about-copy">
              <div className="ss-about-eyebrow">Logistic Expertise</div>
              <h2 className="ss-about-highlight-heading" style={{ color: "#ff6b00" }}>
                WHY TRUST US ?
              </h2>
              <h2>Unparalleled freight services that move your business forward.</h2>
              <p>
                Xprezz Logistics delivers dependable transport across road, sea, air, and rail. With transparent tracking and tailored shipping plans.
              </p>
              <div className="ss-about-cards">
                <div className="ss-about-card">
                  <div className="ss-about-card-icon">🚚</div>
                  <div>
                    <h3>Reliable Transport</h3>
                    <p>Dedicated domestic and regional solutions.</p>
                  </div>
                </div>
                <div className="ss-about-card">
                  <div className="ss-about-card-icon">🌍</div>
                  <div>
                    <h3>Global Reach</h3>
                    <p>End-to-end international logistics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ss-services" id="services">
          <h2>Our Services</h2>
          <p className="ss-services-sub">Professional shipping options for road, ocean, air, and rail freight.</p>
          <div className="ss-services-grid">
            {servicesList.map((s) => (
              <div className="ss-service-card" key={s.title}>
                <div className="ss-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ss-testimonials-section">
          <div className="ss-section-intro">
            <h2>
              Trusted by <span>Industry Leaders</span>
            </h2>
            <p>Our commitment to excellence has earned us the trust of businesses worldwide.</p>
          </div>
          <div className="ss-testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="ss-testimonial-card" key={i}>
                <p className="ss-testimonial-quote">{t.quote}</p>
                <div className="ss-testimonial-profile">
                  <div className="ss-testimonial-avatar">
                    <img src={t.img} alt={t.author} />
                  </div>
                  <div>
                    <div className="ss-testimonial-author">{t.author}</div>
                    <div className="ss-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
