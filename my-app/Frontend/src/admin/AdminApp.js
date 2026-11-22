import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import MembersManagement from "./MembersManagement";
import MemberForm from "./MemberForm";
import AdminSettings from "./AdminSettings";
import AdminSidebar from "./AdminSidebar";
import ProjectsList from "./ProjectsList";
import ProjectForm from "./ProjectForm";

const ProtectedAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // close the drawer after navigating to another page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // stop the page behind the drawer from scrolling
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const authenticated =
    sessionStorage.getItem("kiddiex_admin_authenticated") === "true" &&
    Boolean(sessionStorage.getItem("kiddiex_admin_key"));

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`admin-layout ${menuOpen ? "menu-open" : ""}`}>
      <div className="admin-mobile-bar">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <LuX /> : <LuMenu />}
        </button>
        <strong>Kiddiex Admin</strong>
      </div>

      <div className="admin-overlay" onClick={() => setMenuOpen(false)} />

      <AdminSidebar />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

const AdminApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<MembersManagement />} />
          <Route path="members/new" element={<MemberForm />} />
          <Route path="members/edit/:id" element={<MemberForm />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="/admin/projects" element={<ProjectsList />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminApp;