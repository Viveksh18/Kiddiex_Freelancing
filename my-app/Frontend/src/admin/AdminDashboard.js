import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../services/adminApi";

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const result = await adminApi.getMembers();
        setMembers(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const activeMembers = members.filter((m) => m.isActive !== false);

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your KIDDIEX administration panel.</p>
        </div>
        <span className="admin-status">● System Online</span>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>Total Members</span>
          <h2>{loading ? "..." : members.length}</h2>
          <small>All team profiles</small>
        </div>

        <div className="admin-stat-card">
          <span>Active Members</span>
          <h2>{loading ? "..." : activeMembers.length}</h2>
          <small>Currently displayed</small>
        </div>

        <div className="admin-stat-card">
          <span>Inactive Members</span>
          <h2>{loading ? "..." : members.length - activeMembers.length}</h2>
          <small>Deactivated profiles</small>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Team Members</h2>
            <p>Recently added team profiles</p>
          </div>

          <Link to="/admin/members" className="admin-primary-btn">
            Manage Members
          </Link>
        </div>

        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found. Add your first team member.</p>
        ) : (
          <div className="admin-member-list">
            {members.slice(0, 5).map((member) => (
              <div className="admin-member-row" key={member._id || member.id}>
                <div className="admin-member-info">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    <div className="admin-avatar">
                      {member.name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <strong>{member.name}</strong>
                    <small>{member.role || "Team Member"}</small>
                  </div>
                </div>

                <span
                  className={
                    member.isActive === false
                      ? "admin-inactive"
                      : "admin-active"
                  }
                >
                  {member.isActive === false ? "Inactive" : "Active"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;