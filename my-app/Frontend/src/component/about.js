import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import {
  LuVideo, LuPenLine, LuPalette, LuCode, LuBot,
  LuMessagesSquare, LuLightbulb, LuRocket,
} from "react-icons/lu";
import { members } from "../member";
import "../style/about.css";

/* change this to your startup's name */
const BRAND = "Kiddiex";

const heroWords = [
  "We're", `${BRAND},`, "a", "creative", "studio",
  "turning", "ideas", "into", "polished", "results.",
];

const services = [
  { title: "Video Editing", text: "Clean cuts, pacing and polish that keep viewers watching.", icon: <LuVideo />, bg: "#e3f3ff" },
  { title: "Content Writing", text: "Clear, engaging copy for blogs, websites and social media.", icon: <LuPenLine />, bg: "#ffe3a3" },
  { title: "Graphic Design", text: "Logos, posts and visuals that make your brand stand out.", icon: <LuPalette />, bg: "#ffe0f3" },
  { title: "Web Development", text: "Fast, responsive websites and web apps built to convert.", icon: <LuCode />, bg: "#e6e6ff" },
  { title: "AI Agents", text: "Smart assistants that automate repetitive work for you.", icon: <LuBot />, bg: "#d9f5ee" },
];

const steps = [
  { title: "Discover", text: "We listen first: your goals, audience and what success looks like.", icon: <LuMessagesSquare />, bg: "#e3f3ff" },
  { title: "Plan", text: "We shape the idea into a clear plan, timeline and scope.", icon: <LuLightbulb />, bg: "#ffe3a3" },
  { title: "Create", text: "We design, write, edit and build, sharing progress along the way.", icon: <LuPalette />, bg: "#ffe0f3" },
  { title: "Launch", text: "We polish every detail and deliver results that are ready to go live.", icon: <LuRocket />, bg: "#d9f5ee" },
];

/* edit these numbers to match your real ones */
const stats = [
  { to: 50, suffix: "+", label: "Projects delivered", bg: "#e3f3ff", tilt: -6 },
  { to: 30, suffix: "+", label: "Happy clients", bg: "#ffe3a3", tilt: 5 },
  { to: members.length, suffix: "", label: "Team members", bg: "#ffe0f3", tilt: 6 },
  { to: 5, suffix: "", label: "Core services", bg: "#d9f5ee", tilt: -5 },
];

/* counts up from 0 when it scrolls into view */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return <span ref={ref}>{n}{suffix}</span>;
}

function AboutPage() {
  const pageRef = useRef(null);

  /* scroll reveal: anything with data-reveal gets "in-view" when it appears */
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const els = page.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);   // animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const ribbon = [...services, ...services];   // doubled so the loop is seamless

  return (
    <main className="ab" ref={pageRef}>
      {/* ---------- hero ---------- */}
      <section className="ab-hero">
        <span className="ab-pill ab-pill-blue">Video Editing</span>
        <span className="ab-pill ab-pill-pink">Web Development</span>
        <span className="ab-doodle ab-d1">✨</span>
        <span className="ab-doodle ab-d2">✒️</span>
        <span className="ab-doodle ab-d3">🚀</span>
        <span className="ab-doodle ab-d4">✌️</span>

        <p className="ab-tag">About us</p>

        <h1 className="ab-title">
          {heroWords.map((w, i) => (
            <span key={i} className="ab-word" style={{ "--i": i }}>
              <span>{w}</span>
            </span>
          ))}
        </h1>

        <p className="ab-lead">
          We're a small team of creators and builders who care about the
          details, helping brands look sharp, sound clear and work smarter.
        </p>
      </section>

      {/* ---------- scrolling ribbon ---------- */}
      <div className="ab-ribbon" aria-hidden="true">
        <div className="ab-ribbon-track">
          {ribbon.map((s, i) => (
            <span key={i} className="ab-ribbon-item">
              {s.title} <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- story + stats ---------- */}
      <section className="ab-story">
        <div className="ab-story-text" data-reveal="left">
          <p className="ab-label">Our story</p>
          <h2>Built by people who love making things.</h2>
          <p>
            {BRAND} started with a simple idea: great creative work shouldn't
            be complicated. We bring video, writing, design, web and AI under
            one roof, so you work with one team instead of five.
          </p>
          <p>
            Every project gets the same care, from the first conversation to
            the final polish. We keep communication honest, deadlines real and
            the results something you're proud to share.
          </p>
          <Link to="/contact" className="ab-btn">
            Work with us
            <span className="ab-btn-arrow"><FaArrowRight /></span>
          </Link>
        </div>

        <div className="ab-stats">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="ab-stat"
              data-reveal="tilt"
              style={{ "--i": i, "--tilt": `${s.tilt}deg`, background: s.bg }}
            >
              <strong><Counter to={s.to} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="ab-section">
        <h2 data-reveal="up">What we do</h2>
        <p className="ab-sub" data-reveal="up" style={{ "--i": 1 }}>
          Five services, one team, and results that feel made for you.
        </p>

        <div className="ab-services">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="ab-service"
              data-reveal="up"
              style={{ "--i": i }}
            >
              <div className="ab-icon" style={{ background: s.bg }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="ab-section ab-process">
        <h2 data-reveal="up">How we work</h2>
        <p className="ab-sub" data-reveal="up" style={{ "--i": 1 }}>
          A simple process that keeps every project clear and on track.
        </p>

        <div className="ab-steps" data-reveal="line">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="ab-step"
              style={{ "--i": i }}
            >
              <div className="ab-step-icon" style={{ background: s.bg }}>
                {s.icon}
                <em>{i + 1}</em>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- team ---------- */}
      {members.length > 0 && (
        <section className="ab-section">
          <h2 data-reveal="up">Meet the people</h2>
          <p className="ab-sub" data-reveal="up" style={{ "--i": 1 }}>
            The creators behind the work. Tap a card to see their full profile.
          </p>

          <div className="ab-team">
            {members.map((m, i) => (
              <Link
                key={m.id}
                to={`/member/${m.id}`}
                className="ab-member"
                data-reveal="zoom"
                style={{ "--i": i }}
              >
                <div className="ab-member-photo" style={{ background: m.bg }}>
                  <img src={m.photo} alt={m.name} />
                </div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
                <span className="ab-member-arrow"><FaArrowRight /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- call to action ---------- */}
      <section className="ab-cta-wrap">
        <div className="ab-cta" data-reveal="zoom">
          <span className="ab-doodle ab-c1">✨</span>
          <span className="ab-doodle ab-c2">🚀</span>
          <h2>Have an idea? Let's build it.</h2>
          <p>Tell us what you're working on and we'll get back to you quickly.</p>
          <Link to="/contact" className="ab-btn">
            Get in touch
            <span className="ab-btn-arrow"><FaArrowRight /></span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;