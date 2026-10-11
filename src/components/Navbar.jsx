import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Pawfect Home
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/pets">Adopt</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/account">My Account</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;