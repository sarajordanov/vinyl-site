import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  // Orange on the home page, cream on every other page
  const { pathname } = useLocation();
  const tone = pathname === "/" ? "orange" : "paper";

  return (
    <header className={`header header--${tone}`}>
      <Link to="/" className="logo">VINYL.</Link>

      <nav className="nav">
        <NavLink to="/store">Shop All</NavLink>
        <Link to="/#contact">Contact</Link>
        <Link to="/#about">About</Link>
      </nav>

      <div className="header-actions">
        <Link to="/account">Account</Link>
        <Link to="/cart" aria-label="Cart, 0 items">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4h2l2.4 11h10.2L20 7H6" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="17" cy="19" r="1.5" />
          </svg>
        </Link>
      </div>
    </header>
  );
}