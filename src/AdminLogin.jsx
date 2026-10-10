import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_AUTH_KEY } from "./adminConfig";
import { API_BASE } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #000; color: #f5f5f5; }
  .ad-login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ad-login-card { background: #141414; border-radius: 16px; border: 1px solid #2a2a2a; padding: 48px 40px; width: 100%; max-width: 400px; text-align: center; }
  .ad-login-logo { display: block; width: fit-content; margin: 0 auto 24px; background: #fff; padding: 10px 16px; border-radius: 10px; }
  .ad-login-logo img { height: 60px; width: auto; display: block; }
  .ad-login-card h1 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 6px; }
  .ad-login-card > p { font-size: 14px; color: #8a8f98; margin-bottom: 28px; }
  .ad-login-error { background: rgba(232, 92, 26, 0.15); color: #E85C1A; border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
  .ad-login-btn { width: 100%; background: #E85C1A; color: #fff; border: none; padding: 13px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; margin-top: 4px; }
  .ad-login-btn:hover { background: #1D4ED8; }
  .ad-input { width: 100%; padding: 11px 14px; border: 1.5px solid #2a2a2a; border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #f5f5f5; background: #1c1c1c; outline: none; transition: border-color 0.2s; }
  .ad-input:focus { border-color: #2563EB; }
  .ad-label { display: block; text-align: left; font-size: 13px; font-weight: 600; color: #b3b9c4; margin-bottom: 8px; }
  .ad-login-form { display: flex; flex-direction: column; gap: 14px; }
  @media (max-width: 500px) { .ad-login-card { padding: 32px 24px; } }
`;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(ADMIN_AUTH_KEY)) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.token) {
        setError(true);
        setPassword("");
        setLoading(false);
        return;
      }
      localStorage.setItem(ADMIN_AUTH_KEY, result.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ad-login-wrap">
        <div className="ad-login-card">
          <div className="ad-login-logo">
            <img src="/cargo_logo.png" alt="Xprezz Logistics" />
          </div>
          <h1>Admin Login</h1>
          <p>Enter the admin credentials to manage shipments and invoices.</p>
          {error && <div className="ad-login-error">Incorrect username or password.</div>}
          <form className="ad-login-form" onSubmit={handleSubmit}>
            <div>
              <label className="ad-label">Username</label>
              <input
                className="ad-input"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                autoFocus
              />
            </div>
            <div>
              <label className="ad-label">Password</label>
              <input
                className="ad-input"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
              />
            </div>
            <button type="submit" className="ad-login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
