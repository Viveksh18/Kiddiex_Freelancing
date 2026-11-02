import { FaXTwitter, FaInstagram, FaLinkedinIn  } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../style/navbar.css";

function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="navbar navbar-expand-lg navbar-light pill-nav">
        <Link className="navbar-brand brand-text" to="/">
        {/* <li><img src="logo.png" alt="Home"/></li> */}
          Kiddiex
        </Link>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* center links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            {/* <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#services" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Services
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#video">Video Editing</a>
                <a className="dropdown-item" href="#writing">Content Writing</a>
                <a className="dropdown-item" href="#design">Graphic Design</a>
                <a className="dropdown-item" href="#design">AI Agents</a>
                <a className="dropdown-item" href="#design">Web Development</a>
              </div>
            </li> */}
            <li className="nav-item"><Link className="nav-link" to="/member">Portfolio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/project">Projects</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>

          {/* right icons */}
          <ul className="navbar-nav social-list">
            <li className="nav-item">
              <a className="social-icon" href="https://x.com/KIDDIEX_TECH" target="_blank" rel="noopener noreferrer" aria-label="X">
                <FaXTwitter size={16} />
              </a>
            </li>
            <li className="nav-item">
              <a className="social-icon" href="https://www.instagram.com/kiddiex._?exln=ZWUwejdjZWRwc3Jh" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
            </li>
            <li className="nav-item">
              <a className="social-icon" href="https://www.linkedin.com/in/kiddiex-undefined-1139b3448/" target="_blank" rel="noopener noreferrer" aria-label="Linkdin">
                <FaLinkedinIn size={16} />
              </a>
              </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;