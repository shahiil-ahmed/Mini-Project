import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-title">
            <span className="department-name">ASSAM PUBLIC WORKS DEPARTMENT</span>
            <span className="system-name">CONSTRUCTION MANAGEMENT SYSTEM</span>
          </h1>
        </div>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            <span className="link-text">ATTENDANCE</span>
            <span className="link-desc">Worker Tracking</span>
          </Link>
          <Link to="/quality" className="nav-link">
            <span className="link-text">QUALITY</span>
            <span className="link-desc">Inspections</span>
          </Link>
          <Link to="/projects" className="nav-link">
            <span className="link-text">PROJECTS</span>
            <span className="link-desc">Portfolio</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;