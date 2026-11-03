import { useState, useEffect, useRef } from "react";
import { LuMapPin, LuPhone, LuMail, LuPlus } from "react-icons/lu";
import "../style/contact.css";

const API = "https://kiddiex-freelancing.onrender.com";

const faqs = [
  {
    q: "Do you offer custom design solutions?",
    a: "Yes. Every project is made to fit your brand, goals, and audience, so nothing is based on a generic template.",
  },
  {
    q: "What kind of clients do you usually work with?",
    a: "I work with startups, small businesses, and creators who need video, content, design, websites, or AI tools.",
  },
  {
    q: "How do you usually start a new project?",
    a: "We begin with a short call or message to understand your goals. Then I send a plan with the scope, timeline, and price.",
  },
  {
    q: "How do we communicate during the project?",
    a: "Mostly by email or chat, with regular updates. I'm also happy to hop on a call when something needs a discussion.",
  },
  {
    q: "Can you help define the scope if I'm unsure what I need?",
    a: "Absolutely. Tell me your idea and I'll help turn it into a clear list of deliverables.",
  },
];

const emptyForm = { name: "", email: "", message: "", website: "" };

function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");   // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(null);         // index of the open FAQ item
  const faqRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (status === "sending") return;

  setStatus("sending");
  setErrorMsg("");

  try {
    const res = await fetch(`${API}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const contentType = res.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
      ? await res.json()
      : null;

    if (!res.ok || !data?.ok) {
      throw new Error(
        data?.error || `Request failed (${res.status})`
      );
    }

    setStatus("sent");
    setForm(emptyForm);

    console.log("Contact API response:", data);

    if (!data.welcomeEmailSent) {
      console.warn("Welcome email was not sent.");
    }

  } catch (error) {
    console.error("Contact submission error:", error);

    setStatus("error");

    setErrorMsg(
      error.message === "Failed to fetch"
        ? "Unable to connect. Please check your internet connection and try again."
        : error.message
    );
  }
};


  /* FAQ scroll reveal */
  useEffect(() => {
    const section = faqRef.current;
    if (!section) return;

    // reduced motion: show everything right away
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("in-view");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
          io.disconnect();          // animate once
        }
      },
      { threshold: 0.15 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ---------- header ---------- */}
      <section className="contact-hero">
        <h1>
          How can I help you with
          <br />
          your next project?
        </h1>
        <p>
          Whether you have a clear vision or just an idea, I'm here to help
          shape it into something meaningful.
        </p>
      </section>

      {/* ---------- big card ---------- */}
      <section className="contact-wrap">
        <div className="contact-card">
          <h2>Let's get in touch</h2>
          <p className="contact-sub">
            Feel free to reach out for collaborations, project inquiries, or
            just to say hello.
          </p>

          <ul className="contact-info">
            <li>
              <LuMapPin />
              <div>
                <strong>Address</strong>
                <span>Noida, Uttar Pradesh – 201301, India</span>
              </div>
            </li>
            <li>
              <LuPhone />
              <div>
                <strong>Phone</strong>
                <span>+91 6397667241</span>
              </div>
            </li>
            <li>
              <LuMail />
              <div>
                <strong>E-mail</strong>
                <span>kiddiex2026@gmail.com</span>
              </div>
            </li>
          </ul>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="What is your name*"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Your email address*"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                rows="4"
                placeholder="Tell me about your idea*"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            {/* hidden spam trap: real visitors never see or fill this */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px" }}
            />

            <button type="submit" className="send-btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send a Message"}
            </button>

            {status === "sent" && (
              <p className="sent-note" role="status">
                Thanks! Your message was sent. Check your email for a welcome
                note.
              </p>
            )}

            {status === "error" && (
              <p className="sent-note form-error" role="alert">
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="faq" ref={faqRef}>
        <h2 className="faq-reveal">Need more details?</h2>
        <p className="faq-sub faq-reveal">
          Here are a few answers to things clients usually ask
          <br />
          before starting a project together with me.
        </p>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className={`faq-item faq-reveal ${open === i ? "open" : ""}`}
              style={{ "--i": i }}
            >
              <button
                type="button"
                className="faq-q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
                <LuPlus className="faq-plus" />
              </button>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Contact;