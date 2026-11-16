import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="VINYL home">
        <svg viewBox="0 0 60 60" width="48" height="48" fill="none" stroke="currentColor">
          <rect x="6" y="6" width="48" height="48" />
          <circle cx="30" cy="30" r="22" />
          <circle cx="30" cy="30" r="2" />
          <circle cx="30" cy="30" r="29" className="logo-ring" />
        </svg>
        <b>VINYL.</b>
      </Link>

      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/store">Store</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  );
}