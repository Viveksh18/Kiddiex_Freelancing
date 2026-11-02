import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useRef } from "react";
import { LuGlobe, LuNotebookPen, LuMailOpen, LuSparkles, LuStar, LuTriangle, LuHeart, LuDiamond, LuGamepad } from "react-icons/lu";
import "../style/home.css";
import { Link } from "react-router-dom";
// delete: import { members } from "../member";



const cards = [
  {
    title: "My Portfolio",
    text: "Explore selected projects and my approach to design.",
    href: "/member",
    icon: <LuGlobe />,
    color: "#e3f3ff",
  },
  {
    title: "About Me",
    text: "A closer look at my background, skills, and creative journey.",
    href: "/about",
    icon: <LuNotebookPen />,
    color: "#ffe3a3",
  },
  {
    title: "Contact Me",
    text: "Let's work together to bring your ideas and vision to life.",
    href: "/contact",
    icon: <LuMailOpen />,
    color: "#d9f5ee",
  },
];


const services = [
  { label: "Video Editing", icon: LuSparkles, color: "#d4a017" },
  { label: "Graphic Design", icon: LuStar, color: "#4a86c5" },
  { label: "Game Development", icon: LuGamepad, color: "#7fe052" },
  { label: "Web Development", icon: LuTriangle, color: "#a45fc0" },
  { label: "AI Agents", icon: LuDiamond, color: "#5b5bd6" },
  { label: "Content Writing", icon: LuHeart, color: "#e0527a" },
];

// const TILTS = [-7, 4, 8, -4];

// const TILTS = [-7, 4, 8];

function Home() {


  const sectionRef = useRef(null);
  const gridRef = useRef(null);        // .cards-grid (your original animation)

  const servicesRef = useRef(null);

  useEffect(() => {
    const section = servicesRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("in-view");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
          io.disconnect();            // animate once
        }
      },
      { threshold: 0.3 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    // no scroll animation for people who turned off motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grid.style.setProperty("--p", 1);
      return;
    }

    let target = 0;   // where the scroll says the cards should be
    let current = 0;  // where the cards are now (smoothed)
    let raf = 0;

    const measure = () => {
      const top = section.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * 0.6;    // section top at 60% down the screen: still a pile
      const end = vh * 0.1;      // section top near the top: fully spread out
      target = Math.min(1, Math.max(0, (start - top) / (start - end)));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      current += (target - current) * 0.08;
      if (Math.abs(target - current) < 0.001) current = target;

      // smoothstep: gentle start, gentle end (the pile stays visible longer)
      const eased = current * current * (3 - 2 * current);
      grid.style.setProperty("--p", eased.toFixed(4));

      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <section className="hero" id="home">
        {/* floating badges and doodles */}
        <span className="pill pill-blue">Video Editing</span>
        <span className="pill pill-pink">Web Development</span>
        <span className="doodle d-sparkle">✨</span>
        <span className="doodle d-pen">✒️</span>
        <span className="doodle d-cup">🥤</span>
        <span className="doodle d-peace">✌️</span>

        <h1 className="hero-title">
          Hello<span className="excl">! </span>
          {/* <img className="hero-photo" src="/profile.jpg" alt="Keddix" /> */}
          I'm Kiddiex,
          <br />
          a creative freelancer.
        </h1>

        <p className="hero-text">
          We're a creative startup delivering <strong>Video Editing</strong>,{" "}
          <strong>Content Writing</strong>, <strong>Game Development</strong>, <strong>Graphic Design</strong>,{" "}
          <strong>Web Development</strong>, and <strong>AI Agents</strong>, helping
          brands turn ideas into polished, ready-to-launch results.
        </p>

        {/* <a href="#contact" className="hero-cta">Hire me</a> */}
      </section>
      <section className="cards-section" ref={sectionRef}>
        <div className="cards-grid" ref={gridRef}>
          {cards.map((card, i) => (
            <a key={card.title} href={card.href} className={`info-card card-${i}`}>
              <div className="info-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span className="info-arrow" style={{ background: card.color }}>
                <FaArrowRight />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="services" ref={servicesRef}>
        <h2 className="svc-reveal">What we do best</h2>
        <p className="services-sub svc-reveal">
          From first idea to final polish, we handle it all under one roof.
        </p>

        <div className="svc-pills">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                to="/contact"
                className="svc-pill"
                style={{ "--i": i, "--tc": s.color }}
              >
                <Icon /> {s.label}
              </Link>
            );
          })}
        </div>

        <Link to="/member" className="team-viewall">
          Meet the team
          <span className="team-viewall-arrow"><FaArrowRight /></span>
        </Link>
      </section>
    </>
  );
}

export default Home;