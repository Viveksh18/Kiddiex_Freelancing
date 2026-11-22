import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/adminLogin.css";

const AdminLogin = () => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      sessionStorage.setItem("kiddiex_admin_key", apiKey);

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/members`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid admin key or server error.");
      }

      sessionStorage.setItem("kiddiex_admin_authenticated", "true");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      sessionStorage.removeItem("kiddiex_admin_key");
      sessionStorage.removeItem("kiddiex_admin_authenticated");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">K</div>

        <h1>KIDDIEX</h1>
        <p>Administrator Portal</p>

        <form onSubmit={handleLogin}>
          <label>Admin API Key</label>

          <input
            type="password"
            placeholder="Enter your admin key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <small>Authorized access only</small>
      </div>
    </div>
  );
};

export default AdminLogin;