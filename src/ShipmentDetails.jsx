import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { API_BASE } from "./api";
import { buildTimeline, formatDateTime } from "./shipmentStages";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Scale,
  Truck,
  ClipboardCheck,
  Warehouse,
  Navigation,
  House,
  TriangleAlert,
} from "lucide-react";

const STAGE_ICONS = {
  accepted: ClipboardCheck,
  processing: Warehouse,
  transit: Truck,
  delivery: Navigation,
  delivered: House,
};

const STOP_LABELS = { upcoming: "Upcoming", arrived: "Arrived", departed: "Departed" };

// Shown publicly; route edits (stop added/removed/renamed) stay admin-only.
const PUBLIC_EVENT_TYPES = ["status", "stop", "update"];
const HISTORY_PREVIEW = 5;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #000; color: #f5f5f5; }

  h1, h2, h3 {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 800 !important;
  }

  .sd-wrap { max-width: 900px; margin: 60px auto; padding: 0 clamp(16px, 4vw, 24px) 60px; }

  .sd-back {
    display: inline-flex; align-items: center; gap: 8px;
    color: #8a8f98; text-decoration: none; font-weight: 600;
    margin-bottom: 30px; cursor: pointer; border: none; background: none;
    font-family: 'DM Sans', sans-serif;
  }
  .sd-back:hover { color: #3B82F6; }

  .sd-card { background: #141414; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); overflow: hidden; }

  .sd-header { padding: clamp(24px, 6vw, 40px); background: linear-gradient(135deg, #0f1b2b 0%, #1c3a62 100%); color: #fff; }
  .sd-tracking-num { font-family: 'Syne', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
  .sd-title { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 6vw, 3rem); font-weight: 800; line-height: 1.1; }

  /* Summary strip: estimated delivery | status | tracking number */
  .sd-summary { display: grid; grid-template-columns: repeat(3, 1fr); background: #2a2a2a; gap: 1px; border-bottom: 1px solid #2a2a2a; }
  .sd-summary-item { background: #141414; padding: 20px clamp(16px, 3vw, 28px); text-align: center; }
  .sd-summary-label { font-size: 11px; font-weight: 700; color: #8a8f98; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .sd-summary-value { font-size: clamp(0.95rem, 2.6vw, 1.1rem); font-weight: 700; color: #f5f5f5; word-break: break-word; }

  .sd-badge { display: inline-block; padding: 6px 14px; border-radius: 99px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .status-active { background: rgba(232, 92, 26, 0.15); color: #ff8a4c; }
  .status-delivered { background: rgba(39, 174, 96, 0.18); color: #4ade80; }
  .status-alert { background: rgba(229, 57, 53, 0.18); color: #ff6b6b; }

  /* TRACKER */
  .sd-tracker { padding: clamp(24px, 6vw, 40px); border-bottom: 1px solid #2a2a2a; }
  .sd-section-title { font-family: 'Syne', sans-serif; font-size: clamp(1.3rem, 4vw, 1.6rem); font-weight: 800; margin-bottom: 30px; }

  .sd-stage { display: flex; gap: clamp(14px, 3vw, 22px); }
  .sd-stage-rail { display: flex; flex-direction: column; align-items: center; width: 16px; flex-shrink: 0; }
  .sd-stage-dot { width: 16px; height: 16px; border-radius: 50%; background: #3a3a3a; margin-top: 18px; flex-shrink: 0; }
  .sd-stage-line { width: 2px; flex: 1; background: #2a2a2a; margin: 6px 0 0; min-height: 24px; }
  .sd-stage.done .sd-stage-dot { background: #E85C1A; }
  .sd-stage.done .sd-stage-line { background: #E85C1A; }
  .sd-stage.current .sd-stage-dot { background: #2563EB; box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.25); animation: sd-pulse 2s ease-in-out infinite; }
  @keyframes sd-pulse { 50% { box-shadow: 0 0 0 9px rgba(37, 99, 235, 0.08); } }

  .sd-stage-icon { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; background: #1f1f1f; color: #6b7079; }
  .sd-stage.done .sd-stage-icon { background: rgba(232, 92, 26, 0.15); color: #E85C1A; }
  .sd-stage.current .sd-stage-icon { background: rgba(37, 99, 235, 0.18); color: #60a5fa; }

  .sd-stage-body { flex: 1; min-width: 0; padding: 6px 0 32px; }
  .sd-stage-title { font-size: 17px; font-weight: 700; color: #f5f5f5; margin-bottom: 4px; }
  .sd-stage.current .sd-stage-title { color: #60a5fa; }
  .sd-stage.upcoming .sd-stage-title, .sd-stage.upcoming .sd-stage-desc { color: #5c6069; }
  .sd-stage-desc { font-size: 14px; color: #b3b9c4; line-height: 1.5; }
  .sd-stage-time { font-size: 13px; color: #8a8f98; margin-top: 4px; }
  .sd-stage-note { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(229, 57, 53, 0.12); color: #ff8a80; font-size: 13px; font-weight: 600; }

  /* Stops nested under In Transit */
  .sd-stops { margin-top: 16px; border-left: 2px dashed #2f2f2f; padding-left: 18px; display: grid; gap: 14px; }
  .sd-stop { position: relative; }
  .sd-stop::before { content: ''; position: absolute; left: -24px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: #3a3a3a; border: 2px solid #141414; }
  .sd-stop.arrived::before { background: #2563EB; }
  .sd-stop.departed::before { background: #E85C1A; }
  .sd-stop-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sd-stop-location { font-size: 15px; font-weight: 700; color: #f5f5f5; display: inline-flex; align-items: center; gap: 6px; }
  .sd-stop.upcoming .sd-stop-location { color: #8a8f98; }
  .sd-stop-chip { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 99px; background: #1f1f1f; color: #8a8f98; }
  .sd-stop.arrived .sd-stop-chip { background: rgba(37, 99, 235, 0.18); color: #60a5fa; }
  .sd-stop.departed .sd-stop-chip { background: rgba(232, 92, 26, 0.15); color: #ff8a4c; }
  .sd-stop-meta { font-size: 13px; color: #8a8f98; margin-top: 3px; }
  .sd-stop-note { font-size: 13px; color: #b3b9c4; margin-top: 3px; }

  /* DETAILS */
  .sd-image-panel { padding: 30px clamp(24px, 5vw, 40px); background: #141414; border-bottom: 1px solid #2a2a2a; }
  .sd-image-panel .sd-label { margin-bottom: 12px; }
  .sd-image-panel img { width: 100%; max-width: 100%; border-radius: 20px; display: block; max-height: 420px; object-fit: cover; }

  .sd-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #2a2a2a; border-bottom: 1px solid #2a2a2a; }
  .sd-grid-item { background: #141414; padding: 30px clamp(24px, 5vw, 40px); }
  .sd-label { font-size: 11px; font-weight: 700; color: #8a8f98; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .sd-value { font-size: clamp(1rem, 3vw, 1.15rem); font-weight: 600; color: #f5f5f5; word-break: break-word; }
  .sd-sub { font-size: 13px; color: #8a8f98; margin-top: 4px; }

  /* HISTORY */
  .sd-history { padding: clamp(24px, 6vw, 40px); }
  .sd-event { display: flex; gap: 16px; }
  .sd-event-rail { display: flex; flex-direction: column; align-items: center; width: 12px; flex-shrink: 0; }
  .sd-event-dot { width: 10px; height: 10px; border-radius: 50%; background: #4a4f58; margin-top: 6px; flex-shrink: 0; }
  .sd-event:first-of-type .sd-event-dot { background: #2563EB; }
  .sd-event-line { width: 2px; flex: 1; background: #2a2a2a; margin-top: 6px; }
  .sd-event-body { padding-bottom: 24px; min-width: 0; }
  .sd-event-title { font-size: 15px; font-weight: 700; color: #f5f5f5; }
  .sd-event-location { font-size: 12px; color: #b3b9c4; text-transform: uppercase; letter-spacing: 0.03em; margin-top: 2px; }
  .sd-event-desc { font-size: 14px; color: #b3b9c4; margin-top: 2px; line-height: 1.5; }
  .sd-event-time { font-size: 13px; color: #8a8f98; margin-top: 2px; }
  .sd-see-all { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #E85C1A; font-weight: 700; font-size: 14px; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; }
  .sd-see-all:hover { color: #3B82F6; }

  .sd-loading { text-align: center; padding: 100px 20px; color: #8a8f98; font-weight: 600; }
  .sd-error { text-align: center; padding: 100px 24px; }
  .sd-error h2 { margin-bottom: 20px; font-family: 'Syne', sans-serif; font-size: clamp(1.5rem, 5vw, 2rem); }
  .btn-retry { background: #E85C1A; color: #fff; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .btn-retry:hover { background: #1D4ED8; }

  @media (max-width: 768px) {
    .sd-grid { grid-template-columns: 1fr; }
    .sd-summary { grid-template-columns: 1fr; }
    .sd-wrap { margin: 24px auto; padding: 0 16px 40px; }
    .sd-header { padding: 32px 24px; }
    .sd-grid-item { padding: 24px; }
    .sd-stage-icon { width: 44px; height: 44px; }
  }
`;

const statusLabel = (status) =>
  (status || "Status Unknown").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const statusClass = (status) => {
  const s = (status || "").toUpperCase();
  if (s === "DELIVERED") return "status-delivered";
  if (s === "HELD BY CUSTOMS") return "status-alert";
  return "status-active";
};

function StopList({ stops }) {
  return (
    <div className="sd-stops">
      {stops.map((stop) => (
        <div className={`sd-stop ${stop.status}`} key={stop.id}>
          <div className="sd-stop-head">
            <span className="sd-stop-location">
              <MapPin size={14} /> {stop.location}
            </span>
            <span className="sd-stop-chip">{STOP_LABELS[stop.status]}</span>
          </div>
          <div className="sd-stop-meta">
            {stop.status === "departed" &&
              `Arrived ${formatDateTime(stop.arrivedAt)} · Departed ${formatDateTime(stop.departedAt)}`}
            {stop.status === "arrived" && `Arrived ${formatDateTime(stop.arrivedAt)}`}
            {stop.status === "upcoming" && stop.eta && `Expected ${formatDateTime(stop.eta)}`}
          </div>
          {stop.note && <div className="sd-stop-note">{stop.note}</div>}
        </div>
      ))}
    </div>
  );
}

function ShipmentTracker({ shipment }) {
  const timeline = buildTimeline(shipment);
  const stops = shipment.stops || [];

  return (
    <div className="sd-tracker">
      <h2 className="sd-section-title">Track Shipment</h2>
      {timeline.map((stage, i) => {
        const Icon = STAGE_ICONS[stage.key];
        const isLast = i === timeline.length - 1;
        return (
          <div className={`sd-stage ${stage.state}`} key={stage.key}>
            <div className="sd-stage-rail">
              <div className="sd-stage-dot" />
              {!isLast && <div className="sd-stage-line" />}
            </div>
            <div className="sd-stage-icon">
              <Icon size={24} />
            </div>
            <div className="sd-stage-body">
              <div className="sd-stage-title">{stage.title}</div>
              <div className="sd-stage-desc">{stage.desc}</div>
              {stage.time && (
                <div className="sd-stage-time">{formatDateTime(stage.time)}</div>
              )}
              {stage.note && (
                <div className="sd-stage-note">
                  <TriangleAlert size={15} /> {stage.note}
                </div>
              )}
              {stage.key === "transit" && stops.length > 0 && <StopList stops={stops} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackingHistory({ events }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? events : events.slice(0, HISTORY_PREVIEW);

  return (
    <div className="sd-history">
      <h2 className="sd-section-title">Tracking History</h2>
      {visible.map((event, i) => (
        <div className="sd-event" key={event.id || i}>
          <div className="sd-event-rail">
            <div className="sd-event-dot" />
            {i < visible.length - 1 && <div className="sd-event-line" />}
          </div>
          <div className="sd-event-body">
            <div className="sd-event-title">{event.title}</div>
            {event.location && <div className="sd-event-location">{event.location}</div>}
            {event.description && <div className="sd-event-desc">{event.description}</div>}
            <div className="sd-event-time">{formatDateTime(event.time)}</div>
          </div>
        </div>
      ))}
      {events.length > HISTORY_PREVIEW && (
        <button className="sd-see-all" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show Less" : `See Full Tracking History (${events.length})`}
        </button>
      )}
    </div>
  );
}

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(id)}`);
        if (res.ok) {
          setShipment(await res.json());
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchShipment();
  }, [id]);

  if (loading)
    return (
      <div className="sd-loading">
        <style>{styles}</style>Finding your shipment...
      </div>
    );

  if (error)
    return (
      <div className="sd-error">
        <style>{styles}</style>
        <h2>Tracking Number Not Found</h2>
        <p style={{ marginBottom: 30, color: "#b3b9c4" }}>
          We couldn't find any details for <strong>{id}</strong>.
        </p>
        <button className="btn-retry" onClick={() => navigate("/tracking")}>
          Try Another Number
        </button>
      </div>
    );

  const history = (shipment.trackingEvents || [])
    .filter((e) => PUBLIC_EVENT_TYPES.includes(e.type || "update"))
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <div className="sd-wrap">
        <button className="sd-back" onClick={() => navigate("/tracking")}>
          <ArrowLeft size={18} /> Back to Search
        </button>

        <div className="sd-card">
          <div className="sd-header">
            <div className="sd-tracking-num">Tracking ID: {shipment.trackingNumber || id}</div>
            <h1 className="sd-title">Shipment Details</h1>
          </div>

          <div className="sd-summary">
            <div className="sd-summary-item">
              <div className="sd-summary-label">Estimated Delivery</div>
              <div className="sd-summary-value">{shipment.eta || "TBD"}</div>
            </div>
            <div className="sd-summary-item">
              <div className="sd-summary-label">Current Status</div>
              <span className={`sd-badge ${statusClass(shipment.status)}`}>
                {statusLabel(shipment.status)}
              </span>
            </div>
            <div className="sd-summary-item">
              <div className="sd-summary-label">Tracking Number</div>
              <div className="sd-summary-value">#{shipment.trackingNumber || id}</div>
            </div>
          </div>

          <ShipmentTracker shipment={shipment} />

          <div className="sd-grid">
            <div className="sd-grid-item">
              <div className="sd-label">
                <MapPin size={12} /> From
              </div>
              <div className="sd-value">{shipment.from || "Not specified"}</div>
              {shipment.details?.senderAddress && (
                <div className="sd-sub">{shipment.details.senderAddress}</div>
              )}
            </div>
            <div className="sd-grid-item">
              <div className="sd-label">
                <MapPin size={12} /> To
              </div>
              <div className="sd-value">{shipment.to || "Not specified"}</div>
              {shipment.details?.recipientAddress && (
                <div className="sd-sub">{shipment.details.recipientAddress}</div>
              )}
            </div>
            <div className="sd-grid-item">
              <div className="sd-label">
                <Calendar size={12} /> Est. Delivery
              </div>
              <div className="sd-value">{shipment.eta || "TBD"}</div>
            </div>
            <div className="sd-grid-item">
              <div className="sd-label">
                <Package size={12} /> Service
              </div>
              <div className="sd-value">{shipment.service || "Standard Shipping"}</div>
            </div>
            <div className="sd-grid-item">
              <div className="sd-label">
                <Scale size={12} /> Weight
              </div>
              <div className="sd-value">{shipment.weight || "0 kg"}</div>
            </div>
            <div className="sd-grid-item">
              <div className="sd-label">Receiver Info</div>
              <div className="sd-value">{shipment.customer?.toName || "N/A"}</div>
              {shipment.customer?.email && (
                <div className="sd-sub">{shipment.customer.email}</div>
              )}
              {shipment.customer?.toPhone && (
                <div className="sd-sub">{shipment.customer.toPhone}</div>
              )}
            </div>
          </div>

          {shipment.imageData ? (
            <div className="sd-image-panel">
              <div className="sd-label">Shipment Image</div>
              <img src={shipment.imageData} alt="Shipment upload" />
            </div>
          ) : null}

          {history.length > 0 && <TrackingHistory events={history} />}
        </div>
      </div>
    </>
  );
}
