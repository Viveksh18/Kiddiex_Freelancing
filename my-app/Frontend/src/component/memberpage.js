import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScallopPhoto from "../component/ScallopPhoto.js";
import {
  LuSparkles, LuStar, LuTriangle, LuHeart, LuDiamond, LuZap,
  LuBot, LuBrain, LuWorkflow, LuDatabase, LuCode, LuGlobe, LuAtom,
  LuServer, LuLayers, LuFilm, LuPalette, LuGamepad2, LuCamera,
  LuClapperboard,
} from "react-icons/lu";
import "../style/memberpage.css";

const API_URL = "https://kiddiex-freelancing-2.onrender.com";

const icons = {
  sparkles: LuSparkles, star: LuStar, triangle: LuTriangle,
  heart: LuHeart, diamond: LuDiamond, zap: LuZap,
  bot: LuBot, brain: LuBrain, workflow: LuWorkflow,
  database: LuDatabase, code: LuCode, globe: LuGlobe, atom: LuAtom,
  server: LuServer, layers: LuLayers, film: LuFilm, palette: LuPalette,
  gamepad: LuGamepad2, gamepad2: LuGamepad2, camera: LuCamera,
  clapperboard: LuClapperboard,
};

// "Gamepad-2", " Bot ", "gamepad 2" all resolve correctly
const getIcon = (name) =>
  icons[(name || "").toLowerCase().replace(/[\s_-]/g, "")] || LuStar;

function MemberPage() {
  const { id } = useParams();

  const [m, setM] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError("");

      try {
        const [memberRes, listRes] = await Promise.all([
          fetch(`${API_URL}/api/members/${encodeURIComponent(id)}`),
          fetch(`${API_URL}/api/members`),
        ]);

        if (memberRes.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (!memberRes.ok) throw new Error("Could not load this member.");

        const memberJson = await memberRes.json();
        const listJson = listRes.ok ? await listRes.json() : { data: [] };

        if (cancelled) return;

        setM(memberJson.data);
        setOthers((listJson.data || []).filter((x) => x.id !== id));
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="member-missing">
        <h1>Loading...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="member-missing">
        <h1>{error}</h1>
        <Link to="/">Back to home</Link>
      </section>
    );
  }

  if (notFound || !m) {
    return (
      <section className="member-missing">
        <h1>Member not found</h1>
        <Link to="/">Back to home</Link>
      </section>
    );
  }

  const bio = m.bio || [];
  const skills = m.skills || [];
  const capabilities = m.capabilities || [];

  return (
    <main className="member-page">
      {/* ---------- about ---------- */}
      <section className="member-hero">
        <div className="member-photo-wrap">
          <ScallopPhoto
            photo={m.photo}
            name={m.name}
            bg={m.bg}
            email={m.email}
          />
        </div>

        <div className="member-text">
          <p className="member-role">
            {m.name} &middot; {m.role}
          </p>
          <h1>{m.heading}</h1>

          {bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          <div className="skills">
            {skills.map((s, i) => (
              <div key={`${s.label}-${i}`} className="skill">
                <div className="skill-top">
                  <span>{s.label}</span>
                  <span>{s.value}%</span>
                </div>
                <div className="bar">
                  <span style={{ "--w": `${s.value}%`, "--c": s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- capabilities ---------- */}
      {capabilities.length > 0 && (
        <section className="caps-section">
          <h2>My capabilities</h2>
          <p>
            Every service is crafted around your <strong>goals</strong> and{" "}
            <strong>audience</strong>, so the result feels made for you.
          </p>

          <div className="caps">
            {capabilities.map((c, i) => {
              const Icon = getIcon(c.icon);
              return (
                <span
                  key={`${c.label}-${i}`}
                  className="cap"
                  style={{ "--tc": c.color }}
                >
                  <Icon /> {c.label}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- other members ---------- */}
      {others.length > 0 && (
        <section className="more-team">
          <h3>More from the team</h3>
          <div className="more-list">
            {others.map((o) => (
              <Link key={o.id} to={`/member/${o.id}`}>
                {o.name} <span>{o.role}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default MemberPage;