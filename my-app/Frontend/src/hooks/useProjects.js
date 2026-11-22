import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((r) => r.json())
      .then((json) => setProjects(json.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}

export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/projects/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setProject(json ? json.data : null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading };
}