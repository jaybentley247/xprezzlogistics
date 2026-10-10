import React, { useEffect, useState } from "react";

const JIVO_WIDGET_ID = "YOUR_WIDGET_ID";
const WHATSAPP_PHONE = "15551234567"; // Update to your WhatsApp number in international format without +

export default function ChatWidget() {
  const [jivoOpen, setJivoOpen] = useState(false);

  useEffect(() => {
    if (!JIVO_WIDGET_ID) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://code.jivosite.com/script/widget/${JIVO_WIDGET_ID}`;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const openJivo = () => {
    if (window.jivo_api && typeof window.jivo_api.open === "function") {
      window.jivo_api.open();
    } else {
      window.open("https://www.jivochat.com/", "_blank");
    }
  };

  const toggleJivo = () => setJivoOpen((prev) => !prev);

  return (
    <>
      <style>{`
        .chat-widget {
          position: fixed;
          right: 18px;
          bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          align-items: flex-end;
        }

        .chat-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .chat-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 32px;
          padding: 12px 16px;
          box-shadow: 0 18px 40px rgba(15, 27, 43, 0.12);
          color: #f5f5f5;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        .chat-button:hover {
          transform: translateY(-1px);
          background: #141414;
        }

        .chat-icon {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f4f4f6;
          flex-shrink: 0;
        }

        .chat-label {
          display: inline-block;
          white-space: nowrap;
        }

        .jivo-panel {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: flex-end;
          overflow: hidden;
          transition: width 0.25s ease, opacity 0.25s ease;
          width: ${jivoOpen ? "180px" : "40px"};
          opacity: ${jivoOpen ? "1" : "0.85"};
        }

        .jivo-panel.closed .chat-button {
          display: none;
        }

        .toggle-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: #3498db;
          color: #fff;
          border: none;
          box-shadow: 0 12px 24px rgba(52, 152, 219, 0.3);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .toggle-tab:hover {
          transform: translateX(-2px);
          background: #2b81c2;
        }

        .jivo-panel.closed .toggle-tab {
          width: 40px;
        }
      `}</style>
      <div className="chat-widget">
        <a
          className="chat-button"
          href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Xprezz Logistics team!")}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="chat-icon">📱</span>
          <span className="chat-label">WhatsApp</span>
        </a>

        <div className={`jivo-panel ${jivoOpen ? "open" : "closed"}`}>
          {jivoOpen && (
            <button type="button" className="chat-button" onClick={openJivo}>
              <span className="chat-icon">💬</span>
              <span className="chat-label">Jivo Chat</span>
            </button>
          )}
          <button type="button" className="toggle-tab" onClick={toggleJivo}>
            {jivoOpen ? "→" : "«"}
          </button>
        </div>
      </div>
    </>
  );
}
