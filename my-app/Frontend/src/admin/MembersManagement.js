import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../services/adminApi";

const MembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const result = await adminApi.getMembers();
      setMembers(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${member.name}?`
    );

    if (!confirmed) return;

    try {
      await adminApi.deleteMember(member.id);
      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.role} ${member.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <div>
          <h1>Team Members</h1>
          <p>Manage your KIDDIEX team profiles.</p>
        </div>

        <Link to="/admin/members/new" className="admin-primary-btn">
          + Add Member
        </Link>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <h2>All Members ({members.length})</h2>

          <input
            type="search"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading members...</p>
        ) : filteredMembers.length === 0 ? (
          <p>No matching members found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id || member.id}>
                    <td data-label="Member">
                      <div className="admin-member-info">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} />
                        ) : (
                          <div className="admin-avatar">
                            {member.name?.charAt(0)}
                          </div>
                        )}
                        <strong>{member.name}</strong>
                      </div>
                    </td>

                    <td data-label="Role">{member.role || "-"}</td>
                    <td data-label="Email" className="admin-cell-email">
                      {member.email || "-"}
                    </td>

                    <td data-label="Status">
                      <span
                        className={
                          member.isActive === false
                            ? "admin-inactive"
                            : "admin-active"
                        }
                      >
                        {member.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="admin-actions-cell">
                      <div className="admin-actions">
                        <Link
                          to={`/admin/members/edit/${encodeURIComponent(member.id)}`}
                          className="admin-edit-btn"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(member)}
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default MembersManagement;