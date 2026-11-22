import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../services/adminApi";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const result = await adminApi.getAdminProjects();
      setProjects(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (p) => {
    try {
      await adminApi.updateProject(p.id, { isActive: !p.isActive });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}" permanently? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProject(p.id, true);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProjects = projects.filter((p) =>
    `${p.title} ${p.tag} ${p.year}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-content">Loading projects...</div>;

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <div>
          <h1>Projects</h1>
          <p>Add, edit, hide or delete the projects shown on your website.</p>
        </div>
        <Link to="/admin/projects/new" className="admin-primary-btn">
          + Add Project
        </Link>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <h2>All Projects ({projects.length})</h2>

          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {projects.length === 0 ? (
          <p>No projects yet. Click "Add Project" to create the first one.</p>
        ) : filteredProjects.length === 0 ? (
          <p>No matching projects found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Tag</th>
                  <th>Year</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Cover">
                      {p.image ? (
                        <img src={p.image} alt="" className="admin-thumb" />
                      ) : (
                        <span className="admin-thumb admin-thumb-empty" />
                      )}
                    </td>
                    <td data-label="Title">
                      <strong>{p.title}</strong>
                      <br />
                      <small>{p.id}</small>
                    </td>
                    <td data-label="Tag">{p.tag || "-"}</td>
                    <td data-label="Year">{p.year || "-"}</td>
                    <td data-label="Order">{p.order}</td>
                    <td data-label="Status">
                      <span className={`admin-badge ${p.isActive ? "on" : "off"}`}>
                        {p.isActive ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="admin-actions-cell">
                      <div className="admin-actions">
                        <Link
                          to={`/admin/projects/edit/${encodeURIComponent(p.id)}`}
                          className="admin-small-btn"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="admin-small-btn"
                          onClick={() => toggleActive(p)}
                        >
                          {p.isActive ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => remove(p)}
                        >
                          Delete
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

export default ProjectsList;