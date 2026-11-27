import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import ScallopPhoto from "./ScallopPhoto.js";
import "../style/teampage.css";

const API_URL = process.env.REACT_APP_API_URL;

function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("API_URL:", API_URL);
    fetch(`${API_URL}/api/members`)
      .then((r) => {
        // console.log("status:", r.status);
        return r.json();
      })
      .then((json) => {
        // console.log("response:", json);
        setMembers(json.data || []);
      })
      .catch((err) => {
        // console.error("Fetch failed:", err);
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="tm-page">
      <header className="tm-header">
        <h1>Meet the team</h1>
        <p>A quick look at each member. Open a portfolio to see the full profile.</p>
      </header>

      {loading && <p className="tm-note">Loading team...</p>}
      {!loading && members.length === 0 && (
        <p className="tm-note">No team members to show yet.</p>
      )}

      {members.map((m) => (
        <section className="tm-row" key={m.id}>
          <div className="tm-photo">
            <span className="tm-tape" aria-hidden="true" />
            <ScallopPhoto
              photo={m.photo}
              name={m.name}
              bg={m.bg}
              email={m.email}
            />
          </div>

          <div className="tm-text">
            <p className="tm-role">
              {m.name} &middot; {m.role}
            </p>
            <h2>{m.heading}</h2>

            <div className="tm-skills">
              {(m.skills || []).slice(0, 6).map((s, i) => (
                <div className="tm-skill" key={`${s.label}-${i}`}>
                  <div className="tm-skill-top">
                    <span>{s.label}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="tm-bar">
                    <span style={{ "--w": `${s.value}%`, "--c": s.color }} />
                  </div>
                </div>
              ))}
            </div>

            <Link to={`/member/${m.id}`} className="tm-btn">
              Portfolio
              <span className="tm-btn-arrow">
                <LuArrowRight />
              </span>
            </Link>
          </div>
        </section>
      ))}
    </main>
  );
}

export default TeamPage;
