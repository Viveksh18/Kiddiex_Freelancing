import React from "react";

const AdminSettings = () => {
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  const logout = () => {
    sessionStorage.removeItem("kiddiex_admin_key");
    sessionStorage.removeItem("kiddiex_admin_authenticated");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <div>
          <h1>Settings</h1>
          <p>Manage your administrator session.</p>
        </div>
      </header>

      <section className="admin-panel">
        <h2>Backend Configuration</h2>

        <div className="admin-setting-row">
          <span>API Endpoint</span>
          <strong>{API_URL}</strong>
        </div>

        <div className="admin-setting-row">
          <span>Authentication</span>
          <span className="admin-active">Session active</span>
        </div>

        <div className="admin-setting-row">
          <span>Database</span>
          <strong>MongoDB Atlas</strong>
        </div>

        <hr />

        <h2>Account</h2>
        <p>Sign out of the KIDDIEX administration panel.</p>

        <button className="admin-delete-btn" onClick={logout}>
          Sign Out
        </button>
      </section>
    </div>
  );
};

export default AdminSettings;