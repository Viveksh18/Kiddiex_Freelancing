import { useId } from "react";
import { LuMail } from "react-icons/lu";
import "../style/scallopphoto.css";

/* bumpy left and right edge, in 0-1 units so it scales with the photo */
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

function ScallopPhoto({ photo, name, bg, email, badge = true }) {
  // unique ids so several photos can sit on one page
  const uid = useId().replace(/:/g, "");
  const clipId = `sp-clip-${uid}`;
  const circleId = `sp-circle-${uid}`;

  return (
    <div className="sp-wrap">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={scallopPath()} />
        </clipPath>
      </svg>

      <div className="sp-outline">
        <div
          className="sp-photo"
          style={{
            background: bg || "#5a0018",
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          {photo && <img src={photo} alt={name || "Team member"} />}
        </div>
      </div>

      {badge && (
        <a
          href={email ? `mailto:${email}` : "#"}
          className="sp-badge"
          aria-label="Email me"
        >
          <svg className="sp-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path
                id={circleId}
                d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
              />
            </defs>
            <text>
              <textPath href={`#${circleId}`} textLength="445" lengthAdjust="spacing">
                I AM AVAILABLE - FOR FREELANCE -
              </textPath>
            </text>
          </svg>
          <LuMail className="sp-mail" />
        </a>
      )}
    </div>
  );
}

export default ScallopPhoto;