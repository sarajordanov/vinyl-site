import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";
import "./Home.css";
import TicketSticker from "../components/TicketSticker";
import StarBuddy from "../components/StarBuddy";

// A decorative vinyl record, drawn with SVG
function Disc({ className, label }) {
  return (
    <svg className={`sticker ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#0d0624" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#3a2f66" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#3a2f66" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="15" fill={label} />
      <circle cx="50" cy="50" r="2.5" fill="#efe7d3" />
      <path d="M50 4a46 46 0 0 1 32 14" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// A decorative starburst with text in it
function Burst({ className, text }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 ? 34 : 48;
    const a = (Math.PI * 2 * i) / 24;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg className={`sticker ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={points} fill="#b7cf4f" stroke="#0d0624" strokeWidth="3" strokeLinejoin="round" />
      <text x="50" y="58" textAnchor="middle" fontSize="22" fill="#0d0624" fontFamily="Caprasimo, serif">
        {text}
      </text>
    </svg>
  );
}

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const rowRef = useRef(null);
  const { hash } = useLocation();

  // Ask the server for the albums when the page opens
  useEffect(() => {
    fetch("/api/albums")
      .then((res) => res.json())
      .then(setAlbums)
      .catch(() => setError(true));
  }, []);

  // Scroll to #about or #contact when the address has one
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true); // the real sending comes later, with the server
  }

  return (
    <>
      <section className="hero">
        <Disc className="s1" label="#b7cf4f" />
        <Disc className="s2" label="#efe7d3" />
        <Disc className="s3" label="#1a0089" />
        <Burst className="s4" text="NEW!" />
        <Disc className="s5" label="#efe7d3" />
        <Disc className="s6" label="#b7cf4f" />

        <div className="hero-inner">
          <h1>Welcome to VINYL.</h1>
          <p>
            Explore a vibrant collection of exclusive vinyl records and immerse
            yourself in the urban vinyl culture.
          </p>
          <Link to="/store" className="btn btn-cream">Discover More</Link>
        </div>
      </section>

      <section className="products">
        <h2>All Products</h2>
        {error && <p>Could not load the albums. Is the server running?</p>}
        <div className="row-wrap">
          <div className="row" ref={rowRef}>
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
          <button
            className="row-next"
            aria-label="Scroll to the next products"
            onClick={() => rowRef.current.scrollBy({ left: 420, behavior: "smooth" })}
          >
            ›
          </button>
        </div>
      </section>

            <section className="about" id="about">
        <StarBuddy className="buddy b1" />
        <StarBuddy className="buddy b2" />
        <StarBuddy className="buddy b3" />

        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
            VINYL is your online destination for unique vinyl records. We are
            passionate about preserving vinyl culture and providing an engaging
            shopping experience that reflects the artistic essence of urban style.
          </p>
          <Link to="/#contact" className="btn btn-black">Get in Touch</Link>
        </div>
      </section>
      
      <section className="drops">
        <div className="ribbon">
          <h2>Exclusive Vinyl Drops</h2>
        </div>
        <div className="drops-body">
          <TicketSticker className="ticket" />
          <Disc className="d2" label="#ff5e33" />
          <p>
            Don&apos;t miss out on our latest vinyl releases that showcase the
            best in music and artistry.
          </p>
          <Link to="/store?sort=newest" className="btn btn-black">Shop Now</Link>
        </div>
      </section>

      <section className="connect" id="contact">
        <div className="connect-left">
          <div className="cloud">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <g fill="#ff5e33">
                <circle cx="28" cy="28" r="28" />
                <circle cx="72" cy="28" r="28" />
                <circle cx="28" cy="72" r="28" />
                <circle cx="72" cy="72" r="28" />
                <rect x="28" y="28" width="44" height="44" />
              </g>
            </svg>
            <div className="cloud-text">
              <h2>Connect with Us</h2>
              <p>We are eager to hear from you! Reach out for inquiries, suggestions, or collaborations.</p>
            </div>
          </div>
        </div>

        <div className="connect-right">
          <form className="form" onSubmit={handleSubmit}>
            <label>First name *
              <input name="firstName" required />
            </label>
            <label>Last name
              <input name="lastName" />
            </label>
            <label>Email *
              <input name="email" type="email" required />
            </label>
            <label>Phone
              <input name="phone" type="tel" />
            </label>
            <label className="wide">Write a message
              <textarea name="message" rows="4" />
            </label>
            <button className="btn btn-black wide" type="submit">Submit</button>
            {sent && <p className="wide" role="status">Thank you! We will be in touch.</p>}
          </form>
        </div>
      </section>
    </>
  );
}