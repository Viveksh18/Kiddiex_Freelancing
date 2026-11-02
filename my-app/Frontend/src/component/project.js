import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import "../style/project.css";
import { Link } from "react-router-dom";
import { projects } from "../projectdetail.js";

// Put your screenshots in public/projects/ (see the tip below)

function Projects() {
    const [active, setActive] = useState(null);   // the open book on touch screens

    // phones and tablets can't hover, so a tap opens and closes the book
    const handleTap = (i) => {
        if (window.matchMedia("(hover: none)").matches) {
            setActive(active === i ? null : i);
        }
    };

    return (
        <>
            {/* ---------- header ---------- */}
            <section className="projects-hero">
                <h1>My Projects</h1>
                <p>
                    Discover my remarkable projects built with innovative ideas.
                    <br />
                    See for yourself exactly why I stand out.
                </p>
            </section>

            {/* ---------- grid ---------- */}
            <section className="projects-wrap">
                <div className="projects-grid">
                    {projects.map((p, i) => (
                        <div
                            key={p.title}
                            className={`book-slot ${active === i ? "open" : ""}`}
                            style={{ "--c": p.color }}
                            tabIndex={0}
                            role="group"
                            aria-label={p.title}
                            onClick={() => handleTap(i)}
                        >
                            <div className="book">
                                {/* right page: description + button */}
                                <div className="book-page">
                                    <div>
                                        <h3>{p.title}</h3>
                                        <p>{p.description}</p>
                                    </div>
                                    <Link className="view-btn" to={`/project/${p.id}`}>
                                        View <FaArrowRight />
                                    </Link>
                                </div>

                                {/* the cover: front face, and the inside face (left page) */}
                                <div className="book-cover">
                                    <div className="cover-front">
                                        <span className="cover-tag">{p.tag}</span>
                                        <div className="cover-art">
                                            <img
                                                src={p.image}
                                                alt=""
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        </div>
                                        <h3>{p.title}</h3>
                                    </div>

                                    <div className="cover-inner">
                                        <h4>Details</h4>
                                        <dl>
                                            <dt>Role</dt>
                                            <dd>{p.role}</dd>
                                            <dt>Year</dt>
                                            <dd>{p.year}</dd>
                                            <dt>Tools</dt>
                                            <dd className="chips">
                                                {p.tools.map((t) => (
                                                    <span key={t}>{t}</span>
                                                ))}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Projects;