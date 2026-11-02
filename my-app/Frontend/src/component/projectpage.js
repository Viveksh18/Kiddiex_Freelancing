import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaArrowRight, FaArrowLeft, FaGithub, FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import {
    LuSparkles, LuZap, LuLayers, LuSearch, LuShieldCheck, LuTarget, LuCheck, LuLoader, LuClock, LuPlay,
} from "react-icons/lu";
import { projects } from "../projectdetail.js";
import "../style/projectpage.css";

const featureIcons = [LuSparkles, LuZap, LuLayers, LuSearch, LuShieldCheck, LuTarget];

function ProjectDetail({ id }) {
    const pageRef = useRef(null);
    const barRef = useRef(null);

    const index = projects.findIndex((p) => p.id === id);
    const project = projects[index];

    /* scroll reveal: anything with data-pj gets "in-view" when it appears */
    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;

        const els = page.querySelectorAll("[data-pj]");
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
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    /* reading-progress bar at the top of the screen */
    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        let ticking = false;
        const update = () => {
            ticking = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            bar.style.transform = `scaleX(${p})`;
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    if (!project) {
        return (
            <main className="pj-missing">
                <h1>Project not found</h1>
                <Link to="/" className="pj-btn">Back to home</Link>
            </main>
        );
    }

    const status = getProgress(project.timeline);

    const next = projects[(index + 1) % projects.length];
    const words = project.title.split(" ");

    function getProgress(timeline = []) {
        const total = timeline.length;
        if (!total) return { percent: 0, key: "planned", label: "Planned" };

        const done = timeline.filter((t) => t.state === "done").length;
        const current = timeline.some((t) => t.state === "current");
        const percent = Math.round(((done + (current ? 0.5 : 0)) / total) * 100);

        if (done === total) return { percent: 100, key: "done", label: "Completed" };
        if (done === 0 && !current) return { percent: 0, key: "planned", label: "Planned" };
        return { percent, key: "progress", label: "In progress" };
    }

    /* shows a poster first, and only loads the video after a click */
    function VideoCard({ video, index }) {
        const [playing, setPlaying] = useState(false);
        const isYouTube = video.type === "youtube";

        const poster =
            video.poster ||
            (isYouTube ? `https://img.youtube.com/vi/${video.src}/hqdefault.jpg` : "");

        return (
            <figure className="pj-video" data-pj="zoom" style={{ "--i": index }}>
                <div className="pj-video-frame">
                    {playing ? (
                        isYouTube ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${video.src}?autoplay=1&rel=0`}
                                title={video.title}
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        ) : (
                            <video src={video.src} poster={poster || undefined} controls autoPlay playsInline />
                        )
                    ) : (
                        <button
                            type="button"
                            className="pj-video-poster"
                            onClick={() => setPlaying(true)}
                            aria-label={`Play ${video.title}`}
                        >
                            {poster && <img src={poster} alt="" />}
                            <span className="pj-play"><LuPlay /></span>
                        </button>
                    )}
                </div>
                <figcaption>{video.title}</figcaption>
            </figure>
        );
    }

    return (
        <main className="pj" ref={pageRef} style={{ "--pc": project.color }}>
            {/* <div className="pj-progress" ref={barRef} aria-hidden="true" /> */}

            {/* ---------- hero ---------- */}
            <section className="pj-hero">
                <Link to="/project" className="pj-back">
                    <FaArrowLeft /> All projects
                </Link>

                <div className="pj-badges">
                    <p className="pj-tag">{project.tag}</p>
                    <span className={`pj-status pj-status-${status.key}`}>
                        <i /> {status.label}
                    </span>
                </div>

                <h1 className="pj-title">
                    {words.map((w, i) => (
                        <span key={i} className="pj-word" style={{ "--i": i }}>
                            <span>{w}</span>
                        </span>
                    ))}
                </h1>

                <p className="pj-lead">{project.description}</p>
            </section>

            {/* ---------- cover image ---------- */}
            <div className="pj-cover-wrap">
                <div className="pj-cover" data-pj="zoom">
                    <img src={project.image} alt={project.title} />
                </div>
            </div>

            {/* ---------- quick facts ---------- */}
            <section className="pj-meta">
                {[
                    { label: "Role", value: project.role },
                    { label: "Year", value: project.year },
                    { label: "Category", value: project.tag },
                ].map((m, i) => (
                    <div key={m.label} className="pj-meta-card" data-pj="up" style={{ "--i": i }}>
                        <span>{m.label}</span>
                        <strong>{m.value}</strong>
                    </div>
                ))}
            </section>

            {/* ---------- overview + tech ---------- */}
            <section className="pj-overview">
                <div className="pj-overview-text" data-pj="left">
                    <p className="pj-label">Overview</p>
                    <h2>About this project</h2>
                    {project.overview.map((para) => (
                        <p key={para}>{para}</p>
                    ))}
                </div>

                <aside className="pj-side" data-pj="right">
                    <h3>Tech stack</h3>
                    <div className="pj-tools">
                        {project.tools.map((t) => (
                            <span key={t} className="pj-tool">{t}</span>
                        ))}
                    </div>

                    <div className="pj-actions">
                        {project.href && (
                            <a href={project.href} target="_blank" rel="noreferrer" className="pj-btn">
                                <FaGithub /> View code
                                <span className="pj-btn-arrow"><FaArrowRight /></span>
                            </a>
                        )}
                        {project.live && (
                            <a href={project.live} target="_blank" rel="noreferrer" className="pj-btn">
                                Live demo
                                <span className="pj-btn-arrow"><FaArrowUpRightFromSquare /></span>
                            </a>
                        )}
                    </div>
                </aside>
            </section>

            {project.videos && project.videos.length > 0 && (
                <section className="pj-section pj-videos">
                    <h2 data-pj="up">Watch it in action</h2>
                    <p className="pj-sub" data-pj="up" style={{ "--i": 1 }}>
                        {project.videos.length > 1 ? "Videos from this project." : "A video from this project."}
                    </p>

                    <div className={`pj-video-grid ${project.videos.length === 1 ? "single" : ""}`}>
                        {project.videos.map((v, i) => (
                            <VideoCard key={v.src} video={v} index={i} />
                        ))}
                    </div>
                </section>
            )}

            {/* ---------- challenge + solution ---------- */}
            <section className="pj-duo">
                <div className="pj-duo-card pj-duo-a" data-pj="tilt" style={{ "--tilt": "-3deg" }}>
                    <p className="pj-label">The challenge</p>
                    <p>{project.challenge}</p>
                </div>
                <div className="pj-duo-card pj-duo-b" data-pj="tilt" style={{ "--tilt": "3deg", "--i": 1 }}>
                    <p className="pj-label">The solution</p>
                    <p>{project.solution}</p>
                </div>
            </section>

            {/* ---------- timeline ---------- */}
            {project.timeline && project.timeline.length > 0 && (
                <section className="pj-section pj-timeline">
                    <h2 data-pj="up">Project timeline</h2>
                    <p className="pj-sub" data-pj="up" style={{ "--i": 1 }}>
                        {status.key === "done"
                            ? "Every milestone is complete."
                            : "Where the project stands today."}
                    </p>

                    <div className="pj-progress-card" data-pj="up">
                        <div className="pj-progress-top">
                            <span>Overall progress</span>
                            <strong>{status.percent}%</strong>
                        </div>
                        <div className="pj-pbar">
                            <span style={{ "--w": `${status.percent}%` }} />
                        </div>
                    </div>

                    <ol className="pj-tl" data-pj="line">
                        {project.timeline.map((t, i) => {
                            const Icon =
                                t.state === "done" ? LuCheck : t.state === "current" ? LuLoader : LuClock;
                            const chip =
                                t.state === "done" ? "Done" : t.state === "current" ? "In progress" : "Coming up";

                            return (
                                <li key={t.title} className={`pj-tl-item pj-tl-${t.state}`} style={{ "--i": i }}>
                                    <span className="pj-tl-dot"><Icon /></span>
                                    <div className="pj-tl-card">
                                        <span className="pj-tl-date">{t.date}</span>
                                        <h3>{t.title}</h3>
                                        <p>{t.text}</p>
                                        <em className="pj-tl-chip">{chip}</em>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            )}

            {/* ---------- features ---------- */}
            <section className="pj-section">
                <h2 data-pj="up">Key features</h2>
                <p className="pj-sub" data-pj="up" style={{ "--i": 1 }}>
                    What makes this project useful.
                </p>

                <div className="pj-features">
                    {project.features.map((f, i) => {
                        const Icon = featureIcons[i % featureIcons.length];
                        return (
                            <div key={f.title} className="pj-feature" data-pj="up" style={{ "--i": i }}>
                                <div className="pj-feature-icon"><Icon /></div>
                                <h3>{f.title}</h3>
                                <p>{f.text}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ---------- gallery (only if you add images) ---------- */}
            {project.gallery && project.gallery.length > 0 && (
                <section className="pj-section">
                    <h2 data-pj="up">Gallery</h2>
                    <div className="pj-gallery">
                        {project.gallery.map((src, i) => (
                            <div key={src} className="pj-shot" data-pj="zoom" style={{ "--i": i }}>
                                <img src={src} alt={`${project.title} screenshot ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ---------- next project ---------- */}
            {next && next.id !== project.id && (
                <section className="pj-next-wrap">
                    <Link
                        to={`/project/${next.id}`}
                        className="pj-next"
                        data-pj="zoom"
                        style={{ background: next.color }}
                    >
                        <span className="pj-next-label">Next project</span>
                        <span className="pj-next-title">{next.title}</span>
                        <span className="pj-next-arrow"><FaArrowRight /></span>
                    </Link>
                </section>
            )}
        </main>
    );
}

/* key={id} remounts the page when you go from one project to the next,
   so the entrance animation plays again */
function ProjectPage() {
    const { id } = useParams();
    return <ProjectDetail key={id} id={id} />;
}

export default ProjectPage;