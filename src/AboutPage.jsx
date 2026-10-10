import { useEffect } from "react";
import NavBar from "./NavBar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Poppins', sans-serif; color: #f5f5f5; background: #000; }
  .about-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 5vw, 42px) clamp(16px, 4vw, 24px) 64px; }
  .about-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; margin-bottom: 48px; }
  .about-eyebrow { text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.85rem; font-weight: 700; color: #E85C1A; margin-bottom: 18px; }
  .about-title { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 5vw, 4.4rem); font-weight: 800; line-height: 1.02; color: #f5f5f5; margin-bottom: 18px; }
  .about-copy { font-size: 1rem; line-height: 1.85; color: #b3b9c4; max-width: 640px; margin-bottom: 32px; }
  .about-cta { display: inline-flex; align-items: center; gap: 12px; background: #E85C1A; color: #fff; text-decoration: none; padding: 15px 28px; border-radius: 999px; font-weight: 700; transition: transform 0.15s ease, background 0.2s ease; }
  .about-cta:hover { background: #1D4ED8; transform: translateY(-1px); }
  .about-image { border-radius: 28px; overflow: hidden; box-shadow: 0 30px 80px rgba(14,28,50,0.08); }
  .about-image img { width: 100%; height: 100%; object-fit: cover; display: block; max-width: 100%; }
  .about-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-bottom: 48px; }
  .about-stat { background: #141414; border-radius: 20px; padding: clamp(20px, 4vw, 28px); box-shadow: 0 20px 50px rgba(14,28,50,0.07); }
  .about-stat h3 { font-size: 1.25rem; margin-bottom: 12px; color: #f5f5f5; }
  .about-stat p { color: #b3b9c4; line-height: 1.7; }
  .about-values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .about-card { background: #141414; border-radius: 20px; padding: clamp(20px, 4vw, 28px); box-shadow: 0 20px 50px rgba(14,28,50,0.06); }
  .about-card h3 { font-size: 1.1rem; margin-bottom: 14px; color: #f5f5f5; }
  .about-card p { color: #b3b9c4; line-height: 1.8; }
  .about-back { margin-bottom: 32px; display: inline-flex; align-items: center; gap: 8px; color: #b3b9c4; font-weight: 600; text-decoration: none; }
  .about-back:hover { color: #3B82F6; }
  .about-highlights { margin-top: 48px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .about-feature-card { background: #141414; border-radius: 24px; overflow: hidden; box-shadow: 0 26px 80px rgba(14,28,50,0.08); border: 1px solid #2a2a2a; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .about-feature-card:hover { transform: translateY(-4px); box-shadow: 0 34px 100px rgba(14,28,50,0.12); }
  .about-feature-image { width: 100%; height: 220px; object-fit: cover; display: block; }
  .about-feature-content { padding: clamp(20px, 4vw, 26px); }
  .about-feature-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 12px; color: #f5f5f5; }
  .about-feature-copy { color: #b3b9c4; line-height: 1.75; font-size: 0.98rem; }
  .about-feature-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: rgba(232, 92, 26, 0.15); color: #e85c1a; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px; }

  @media (max-width: 960px) {
    .about-hero { grid-template-columns: 1fr; gap: 32px; }
    .about-stats { grid-template-columns: 1fr; }
    .about-values { grid-template-columns: 1fr; }
    .about-highlights { grid-template-columns: 1fr; }
    .about-image { height: 320px; }
  }
`;

const values = [
  {
    title: "Fast Global Shipping",
    desc: "We deliver quickly and safely, with tailored solutions for every route and cargo size.",
  },
  {
    title: "Transparent Pricing",
    desc: "No surprises — clear quotes, dependable timelines, and smart logistics support.",
  },
  {
    title: "Customer-first Service",
    desc: "Every shipment is handled with care, from pickup to final delivery.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <style>{styles}</style>
      <div className="about-wrap">
        <a className="about-back" href="/">
          ← Back to Home
        </a>
        <section className="about-hero">
          <div>
            <div className="about-eyebrow">About Xprezz Logistics</div>
            <h1 className="about-title">
              We move your business forward with smarter logistics.
            </h1>
            <p className="about-copy">
              Xprezz Logistics is built for companies that need reliable, flexible
              shipping — whether road, air, sea, or rail. We combine fast
              service with expert operational support so your cargo arrives on
              time, every time.
            </p>
            <a className="about-cta" href="/contact">
              Talk to our team
            </a>
          </div>
          <div className="about-image">
            <img
              src="https://www.image2url.com/r2/default/images/1779649727995-a21f180b-a347-4360-b049-850d8c91dca1.jpg"
              alt="Logistics operations"
            />
          </div>
        </section>

        <section className="about-stats">
          <div className="about-stat">
            <h3>10,000+</h3>
            <p>Shipments moved across 45 countries with real-time tracking.</p>
          </div>
          <div className="about-stat">
            <h3>24/7 Support</h3>
            <p>
              Dedicated customer care for every delivery from pickup to final
              mile.
            </p>
          </div>
          <div className="about-stat">
            <h3>99.8% on-time</h3>
            <p>
              Industry-leading performance for time-sensitive freight and
              deliveries.
            </p>
          </div>
        </section>

        <section className="about-highlights">
          <div className="about-feature-card">
            <img
              className="about-feature-image"
              src="https://www.image2url.com/r2/default/images/1779651143214-6d19fd15-326b-4c3f-8ed1-be8a8035ff57.png"
              alt="Specialized freight logistics"
            />
            <div className="about-feature-content">
              <div className="about-feature-eyebrow">Specialized Logistics</div>
              <h3 className="about-feature-title">
                Tailored freight moving for every industry
              </h3>
              <p className="about-feature-copy">
                From heavy-lift rail and ocean freights to last-mile road
                delivery, Xprezz Logistics provides precise, specialized transport
                built around your cargo type.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <img
              className="about-feature-image"
              src="https://www.image2url.com/r2/default/images/1779650653855-7832a9d3-978a-4c46-a454-a29f3a1de4f7.png"
              alt="Vaccine cold-chain logistics"
            />
            <div className="about-feature-content">
              <div className="about-feature-eyebrow">Critical Supply Chain</div>
              <h3 className="about-feature-title">
                Moving essential goods safely and reliably
              </h3>
              <p className="about-feature-copy">
                We support sensitive and time-critical shipments with strict
                handling standards, temperature control, and dependable routing
                for high-value cargo.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <img
              className="about-feature-image"
              src="https://www.image2url.com/r2/default/images/1779650244857-cf377053-d2cb-40f5-84db-ccf34b04f65c.png"
              alt="Global maritime logistics"
            />
            <div className="about-feature-content">
              <div className="about-feature-eyebrow">Global Reach</div>
              <h3 className="about-feature-title">
                Scaling international routes with confidence
              </h3>
              <p className="about-feature-copy">
                Our network connects seaports, air hubs, and inland terminals
                worldwide, so you can move shipments across borders with
                complete visibility.
              </p>
            </div>
          </div>
        </section>

        <section className="about-values">
          {values.map((value) => (
            <div className="about-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
