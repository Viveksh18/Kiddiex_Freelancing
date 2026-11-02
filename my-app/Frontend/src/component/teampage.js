import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { members } from "../member";
import "../style/teampage.css";
import { useEffect, useRef } from "react";

/* a bumpy left and right edge, in 0-1 units so it scales with the photo */
function scallopPath(n = 4, a = 0.1) {
  const step = 1 / n;
  const c = 1 + a / 3;
  let d = `M ${a} 0 H ${1 - a}`;
  for (let i = 0; i < n; i++) {
    const y0 = i * step, y1 = (i + 1) * step;
    d += ` C ${c} ${y0} ${c} ${y1} ${1 - a} ${y1}`;
  }
  d += ` H ${a}`;
  for (let i = n; i > 0; i--) {
    const y0 = i * step, y1 = (i - 1) * step;
    d += ` C ${-a / 3} ${y0} ${-a / 3} ${y1} ${a} ${y1}`;
  }
  return d + " Z";
}

/* rotating "I am available" badge (unique path id per member) */
function AvailBadge({ id, email }) {
  const pathId = `availCircle-${id}`;
  return (
    <a href={`mailto:${email}`} className="tp-avail" aria-label="Email me">
      <svg className="tp-avail-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path
            id={pathId}
            d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          />
        </defs>
        <text>
          <textPath href={`#${pathId}`} textLength="445" lengthAdjust="spacing">
            I AM AVAILABLE - FOR FREELANCE -
          </textPath>
        </text>
      </svg>
      <LuMail className="tp-avail-icon" />
    </a>
  );
}

function TeamPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const rows = page.querySelectorAll(".tp-row");
    if (!rows.length) return;

    // reduced motion: show everything right away
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rows.forEach((r) => r.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <main className="tp" ref={pageRef}>
      {/* the shape used to cut out the photos */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <clipPath id="scallop" clipPathUnits="objectBoundingBox">
          <path d={scallopPath()} />
        </clipPath>
      </svg>

      <header className="tp-head">
        <h1>Meet the team</h1>
        <p>A quick look at each member. Open a portfolio to see the full profile.</p>
      </header>

      {members.map((m) => (
        <section key={m.id} className="tp-row">
          <div className="tp-photo-wrap">
            <span className="tp-tape" aria-hidden="true" />
            <div className="tp-outline">
              <div className="tp-photo" style={{ background: m.bg }}>
                <img src={m.photo} alt={m.name} />
              </div>
            </div>
            <AvailBadge id={m.id} email={m.email} />
          </div>

          <div className="tp-text">
            <p className="tp-role">{m.name} &middot; {m.role}</p>
            <h2>{m.heading}</h2>

            <div className="tp-skills">
              {m.skills.map((s) => (
                <div key={s.label}>
                  <div className="tp-skill-top">
                    <span>{s.label}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="tp-bar">
                    <span style={{ "--w": `${s.value}%`, "--c": s.color }} />
                  </div>
                </div>
              ))}
            </div>

            <Link to={`/member/${m.id}`} className="tp-btn">
              Portfolio
              <span className="tp-btn-arrow"><FaArrowRight /></span>
            </Link>
          </div>
        </section>
      ))}
    </main>
  );
}

export default TeamPage;