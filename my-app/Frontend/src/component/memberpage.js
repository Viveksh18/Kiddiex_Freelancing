import { Link, useParams } from "react-router-dom";
import {
  LuMail, LuSparkles, LuStar, LuTriangle, LuHeart, LuDiamond, LuZap,
} from "react-icons/lu";
import { members } from "../member";
import "../style/memberpage.css";

const icons = {
  sparkles: LuSparkles,
  star: LuStar,
  triangle: LuTriangle,
  heart: LuHeart,
  diamond: LuDiamond,
  zap: LuZap,
};

/* a bumpy left and right edge, in 0-1 units so it scales with the photo */
function scallopPath(n = 4, a = 0.1) {
  const step = 1 / n;
  const c = 1 + a / 3;                       // control point so the bump reaches the edge
  let d = `M ${a} 0 H ${1 - a}`;
  for (let i = 0; i < n; i++) {              // right side, going down
    const y0 = i * step, y1 = (i + 1) * step;
    d += ` C ${c} ${y0} ${c} ${y1} ${1 - a} ${y1}`;
  }
  d += ` H ${a}`;
  for (let i = n; i > 0; i--) {              // left side, going up
    const y0 = i * step, y1 = (i - 1) * step;
    d += ` C ${-a / 3} ${y0} ${-a / 3} ${y1} ${a} ${y1}`;
  }
  return d + " Z";
}

/* rotating "I am available" badge */
function AvailBadge({ email }) {
  return (
    <a href={`mailto:${email}`} className="avail" aria-label="Email me">
      <svg className="avail-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path
            id="availCircle"
            d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          />
        </defs>
        <text>
          <textPath href="#availCircle" textLength="445" lengthAdjust="spacing">
            I AM AVAILABLE - FOR FREELANCE -
          </textPath>
        </text>
      </svg>
      <LuMail className="avail-icon" />
    </a>
  );
}



function MemberPage() {
  const { id } = useParams();
  const m = members.find((x) => x.id === id);

  if (!m) {
    return (
      <section className="member-missing">
        <h1>Member not found</h1>
        <Link to="/">Back to home</Link>
      </section>
    );
  }

  const others = members.filter((x) => x.id !== m.id);

  return (
    <main className="member-page">
      {/* the shape used to cut out the photo */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <clipPath id="scallop" clipPathUnits="objectBoundingBox">
          <path d={scallopPath()} />
        </clipPath>
      </svg>

      {/* ---------- about ---------- */}
      <section className="member-hero">
        <div className="member-photo-wrap">
          <div className="photo-outline">
            <div className="member-photo" style={{ background: m.bg }}>
              <img src={m.photo} alt={m.name} />
            </div>
          </div>
          <AvailBadge email={m.email} />
        </div>

        <div className="member-text">
          <p className="member-role">{m.name} &middot; {m.role}</p>
          <h1>{m.heading}</h1>
          {m.bio.map((para) => (
            <p key={para}>{para}</p>
          ))}

          <div className="skills">
            {m.skills.map((s) => (
              <div key={s.label} className="skill">
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
      <section className="caps-section">
        <h2>My capabilities</h2>
        <p>
          Every service is crafted around your <strong>goals</strong> and{" "}
          <strong>audience</strong>, so the result feels made for you.
        </p>

        <div className="caps">
          {m.capabilities.map((c) => {
            const Icon = icons[c.icon] || LuStar;
            return (
              <span key={c.label} className="cap" style={{ "--tc": c.color }}>
                <Icon /> {c.label}
              </span>
            );
          })}
        </div>
      </section>

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