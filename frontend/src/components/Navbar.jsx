import { Link } from "react-router-dom";
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <h2>CMS</h2>
      <div className="nav-menu">
      <Link to="/" style={{ marginRight: "15px" }}>Attendance</Link>
      <Link to="/quality" style={{ marginRight: "15px" }}>Quality Check</Link>
      {/* <Link to="/payment">Payment</Link> */}
      </div>
    </nav>
  );
}

export default Navbar;
