import React, { useEffect } from "react";
import NavBar from "./NavBar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Poppins', sans-serif; color: #f5f5f5; background: #000; }
  .services-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 5vw, 42px) clamp(16px, 4vw, 24px) 64px; }
  .services-back { display: inline-flex; align-items: center; gap: 8px; color: #b3b9c4; text-decoration: none; margin-bottom: 32px; font-weight: 600; }
  .services-back:hover { color: #3B82F6; }
  .services-hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 32px; align-items: center; margin-bottom: 42px; }
  .services-eyebrow { text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.85rem; font-weight: 700; color: #E85C1A; margin-bottom: 18px; }
  .services-image { border-radius: 28px; overflow: hidden; box-shadow: 0 30px 80px rgba(14,28,50,0.08); min-height: 420px; }
  .services-image img { width: 100%; height: 100%; object-fit: cover; display: block; max-width: 100%; }
  .services-title { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 800; line-height: 1.02; color: #f5f5f5; margin-bottom: 16px; }
  .services-copy { max-width: 700px; font-size: 1rem; line-height: 1.85; color: #b3b9c4; }
  .services-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .service-card { background: #141414; border-radius: 24px; padding: 28px 26px; box-shadow: 0 24px 70px rgba(14,28,50,0.08); border: 1px solid #2a2a2a; transition: transform 0.2s ease, border-color 0.2s ease; position: relative; overflow: hidden; }
  .service-card:hover { transform: translateY(-4px); border-color: #2563EB; }
  .service-icon { width: 52px; height: 52px; border-radius: 18px; background: rgba(232, 92, 26, 0.15); display: grid; place-items: center; margin-bottom: 20px; }
  .service-card-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 12px; color: #f5f5f5; }
  .service-desc { font-size: 0.98rem; line-height: 1.8; color: #b3b9c4; margin-bottom: 18px; }
  .service-types { opacity: 0; max-height: 0; overflow: hidden; transition: opacity 0.25s ease, max-height 0.25s ease; }
  .service-card:hover .service-types { opacity: 1; max-height: 230px; }
  .service-types h4 { margin: 0 0 10px; font-size: 0.95rem; font-weight: 700; color: #f5f5f5; }
  .service-type-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
  .service-type-list li { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #b3b9c4; }
  .service-type-bullet {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #E85C1A;
    flex-shrink: 0;
  }
  .service-tag { display: inline-flex; margin-top: 20px; padding: 10px 16px; border-radius: 999px; background: #E85C1A; color: #fff; font-size: 0.85rem; font-weight: 700; }

  /* Detailed Sections */
  .detailed-section { padding: clamp(40px, 8vw, 80px) 0; background: #141414; border-radius: 32px; margin: 40px 0; }
  .feature-row { display: flex; align-items: center; gap: 60px; margin-bottom: 80px; }
  .feature-row:nth-child(even) { flex-direction: row-reverse; }
  .feature-image { flex: 1.2; border-radius: 24px; overflow: hidden; height: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
  .feature-image img { width: 100%; height: 100%; object-fit: cover; max-width: 100%; }
  .feature-content { flex: 0.8; }
  .feature-content h3 { font-size: clamp(1.8rem, 4vw, 2.5rem); margin-bottom: 20px; color: #f5f5f5; }
  .feature-content p { font-size: 1.05rem; color: #b3b9c4; line-height: 1.8; margin-bottom: 20px; }
  .feature-list { list-style: none; display: grid; gap: 12px; }
  .feature-list li { display: flex; align-items: center; gap: 10px; font-weight: 600; color: #f5f5f5; }
  .feature-list li::before { content: '✓'; color: #E85C1A; font-weight: 900; }

  /* Testimonials */
  .testimonials-section { padding: clamp(40px, 8vw, 80px) 0; text-align: center; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; }
  .testimonial-card { background: #141414; padding: 40px 30px; border-radius: 24px; box-shadow: 0 15px 40px rgba(0,0,0,0.05); border: 1px solid #2a2a2a; position: relative; text-align: left; }
  .testimonial-quote { font-size: 1.05rem; font-style: italic; color: #b3b9c4; margin-bottom: 24px; line-height: 1.7; position: relative; }
  .testimonial-quote::before { content: '"'; font-family: serif; font-size: 3rem; color: #E85C1A; opacity: 0.2; position: absolute; top: -20px; left: -15px; }
  .testimonial-profile { display: flex; align-items: center; gap: 15px; margin-top: auto; }
  .testimonial-avatar { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid #E85C1A; }
  .testimonial-avatar img { width: 100%; height: 100%; object-fit: cover; max-width: 100%; }
  .testimonial-author { font-weight: 700; color: #f5f5f5; font-size: 1rem; }
  .testimonial-role { font-size: 0.85rem; color: #E85C1A; font-weight: 600; }

  @media (max-width: 768px) {
    .services-grid { grid-template-columns: 1fr; }
    .services-hero { grid-template-columns: 1fr; gap: 24px; }
    .services-image { min-height: 300px; }
    .feature-row { flex-direction: column !important; gap: 30px; margin-bottom: 60px; }
    .feature-image { height: 300px; width: 100%; }
    .testimonials-grid { grid-template-columns: 1fr; }
  }

`;

const serviceItems = [
  {
    title: "Road Freight",
    desc: "Reliable overland trucking with flexible delivery and terminal handling.",
    tag: "Domestic & Cross-Border",
    types: ["Less-than-truckload", "Full truckload", "Expedited road transport"],
  },
  {
    title: "Ocean Freight",
    desc: "Full container and less-than-container shipping for global imports and exports.",
    tag: "FCL / LCL",
    types: ["Full container load", "Less-than-container load", "Customs consolidation"],
  },
  {
    title: "Air Freight",
    desc: "Fast air cargo solutions for urgent shipments and time-sensitive deliveries.",
    tag: "Priority Handling",
    types: ["Express cargo", "Standard air freight", "Temperature-controlled shipments"],
  },
  {
    title: "Rail Freight",
    desc: "Cost-efficient rail logistics for inland and intermodal transportation.",
    tag: "Bulk & Heavy Cargo",
    types: ["Intermodal rail", "Door-to-door rail", "Heavy equipment transport"],
  },
];

const testimonials = [
  {
    quote: "Xprezz Logistics has been a game changer for our business. Always on time and extremely reliable!",
    author: "Michael R.",
    role: "Supply Chain Manager",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Their global network and real-time tracking give us peace of mind for every shipment.",
    author: "Sarah J.",
    role: "Logistics Director",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Exceptional service and competitive rates. They handled our complex international moves with ease.",
    author: "David K.",
    role: "CEO of GlobalTrade",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The team is incredibly responsive. Our urgent medical supplies always arrive exactly when needed.",
    author: "Amina W.",
    role: "Operations Chief",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "I've worked with many logistics firms, but Xprezz Logistics' transparency is truly unmatched.",
    author: "Marcus T.",
    role: "Distribution Lead",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Highly recommend for any business looking to scale. Their rail freight options saved us 30% on costs.",
    author: "Elena G.",
    role: "Sustainability Manager",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
];

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <NavBar />
      <style>{styles}</style>
      <div className="services-wrap">
        <a className="services-back" href="/">
          ← Back to Home
        </a>
        <section className="services-hero">
          <div>
            <div className="services-eyebrow">Our Services</div>
            <h1 className="services-title">
              Freight logistics built for speed and scale.
            </h1>
            <p className="services-copy">
              Xprezz Logistics provides tailored shipping services for road, ocean,
              air, and rail freight. Each service is designed to meet the needs
              of businesses moving goods locally, regionally, or around the
              world.
            </p>
          </div>
          <div className="services-image">
            <img
              src="https://www.image2url.com/r2/default/images/1779535664219-78a03537-549c-402c-bef3-ff33721f8668.png"
              alt="Logistics and transportation services"
            />
          </div>
        </section>

        <section className="detailed-section">
          <div className="feature-row">
            <div className="feature-image">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80"
                alt="Warehousing"
              />
            </div>
            <div className="feature-content">
              <h3>Warehousing & Distribution</h3>
              <p>
                Strategically located warehouses equipped with state-of-the-art
                inventory management systems to ensure your products are stored
                safely and distributed efficiently.
              </p>
              <ul className="feature-list">
                <li>Inventory management & reporting</li>
                <li>Pick and pack services</li>
                <li>Order fulfillment & last-mile delivery</li>
                <li>Short-term and long-term storage</li>
              </ul>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-image">
              <img
                src="https://www.image2url.com/r2/default/images/1779535125115-1ca56596-7792-416a-9f00-594bd7924c17.jpg"
                alt="Supply Chain Flow"
              />
            </div>
            <div className="feature-content">
              <h3>Supply Chain Optimization</h3>
              <p>
                We analyze your logistics data to identify bottlenecks and
                implement solutions that reduce costs and improve delivery times
                across your entire network.
              </p>
              <ul className="feature-list">
                <li>Route optimization and planning</li>
                <li>Cost reduction strategies</li>
                <li>Vendor management solutions</li>
                <li>End-to-end visibility and tracking</li>
              </ul>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-image">
              <img
                src="https://www.image2url.com/r2/default/images/1779536015142-2e72713e-f278-4c60-a141-963059e1c9a9.jpg"
                alt="Customs Brokerage"
              />
            </div>
            <div className="feature-content">
              <h3>Customs Brokerage & Compliance</h3>
              <p>
                Navigating complex international regulations to ensure your
                cargo moves across borders smoothly. We handle all documentation
                to minimize delays and avoid penalties.
              </p>
              <ul className="feature-list">
                <li>Import/Export documentation management</li>
                <li>Duty and tax calculation & optimization</li>
                <li>Regulatory compliance consulting</li>
                <li>Electronic data interchange (EDI) filing</li>
              </ul>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-image">
              <img
                src="https://www.image2url.com/r2/default/images/1779536238012-2494002c-a47d-413a-9dd2-3df1d1594a8d.png"
                alt="E-commerce Fulfillment"
              />
            </div>
            <div className="feature-content">
              <h3>E-commerce Fulfillment</h3>
              <p>
                Scalable solutions for growing online businesses. From storage
                to shipping, we manage your entire backend so you can focus on
                scaling your brand.
              </p>
              <ul className="feature-list">
                <li>Multi-channel inventory synchronization</li>
                <li>Branded packaging and kitting</li>
                <li>Reverse logistics (Returns management)</li>
                <li>Same-day order processing</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="services-grid">
          {serviceItems.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-icon">🚚</div>
              <div className="service-title">{service.title}</div>
              <p className="service-desc">{service.desc}</p>
              <div className="service-types">
                <h4>Shipping types we handle</h4>
                <ul className="service-type-list">
                  {service.types.map((type) => (
                    <li key={type}>
                      <span className="service-type-bullet" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="service-tag">{service.tag}</div>
            </div>
          ))}
        </div>

        <section className="testimonials-section">
          <h2 className="services-title" style={{ textAlign: "center" }}>
            Trusted Globally
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-profile">
                  <div className="testimonial-avatar">
                    <img src={t.img} alt={t.author} />
                  </div>
                  <div>
                    <div className="testimonial-author">{t.author}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}
