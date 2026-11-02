import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import "../style/footer.css";

function Footer() {
    return (
        <footer className="footer" id="contact">
            {/* rotating badge on the edge */}
            <a href="mailto:hello@keddix.com" className="badge" aria-label="Email me">
                <svg className="badge-ring" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                        <path
                            id="badgeCircle"
                            d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
                        />
                    </defs>
                    <text>
                        <textPath href="#badgeCircle" textLength="445" lengthAdjust="spacing">
                            FOR FREELANCE - I AM AVAILABLE -
                        </textPath>
                    </text>
                </svg>
                <LuMail className="badge-icon" />
            </a>

            {/* chat bubble */}
            <div className="bubble">
                <span></span><span></span><span></span>
            </div>

            <h2 className="footer-title">
                Let's talk about
                <br />
                your next project
            </h2>

            <p className="footer-text">
                Got a project in mind? Let's create something great.
                <br />
                We can transform that idea into real product.
            </p>

            <div className="cta-wrap">
                <a href="mailto:kiddiex2026@gmail.com" className="footer-cta">
                    Get in Touch
                </a>

                <div className="cta-note">
                    <svg className="cta-arrow" viewBox="0 0 80 50" aria-hidden="true">
                        <path
                            d="M70 40 C 66 20, 40 8, 8 14 M8 14 L20 4 M8 14 L22 22"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>
                        and make it
                        <br />
                        real together
                    </span>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Kiddiex. All rights reserved.</p>

                <div className="footer-social">
                    <a href="https://x.com/KIDDIEX_TECH" target="_blank" rel="noopener noreferrer" aria-label="X">
                        <FaXTwitter />
                    </a>
                    <a href="https://www.instagram.com/kiddiex._?exln=ZWUwejdjZWRwc3Jh" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                    <a href="https://www.linkedin.com/in/kiddiex-undefined-1139b3448/" target="_blank" rel="noopener noreferrer" aria-label="Linkdin">
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;