// import logo from '../public/logo2.png';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./component/navbar.js";
import Home from "./component/home.js";
import Footer from "./component/footer.js";
import Contact from "./component/contact.js";
import Projects from "./component/project.js";
import MemberPage from "./component/memberpage.js";
import TeamPage from "./component/teampage.js";
import ScrollToTop from "./component/ScrollToTop.jsx";
import AboutPage from "./component/about.js";
import ProjectPage from "./component/projectpage.js";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/member/:id" element={<MemberPage />} />
          <Route path="/member" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
