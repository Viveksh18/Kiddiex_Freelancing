import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuFolderKanban } from "react-icons/lu";
import "../style/admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("kiddiex_admin_key");
    sessionStorage.removeItem("kiddiex_admin_authenticated");
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">K</div>
        <div>
          <h2>KIDDIEX</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <div className="admin-menu-label">MENU</div>

      <nav>
        <NavLink to="/admin/dashboard">
          <span>▦</span> Dashboard
        </NavLink>

        <NavLink to="/admin/members">
          <span>♙</span> Team Members
        </NavLink>

        <NavLink to="/admin/projects">
          <span>
            <LuFolderKanban />
          </span>{" "}
          Projects
        </NavLink>

        <NavLink to="/admin/settings">
          <span>⚙</span> Settings
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-user">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <small>System Admin</small>
          </div>
        </div>

        <button type="button" className="admin-logout" onClick={logout}>
          ↗ Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;