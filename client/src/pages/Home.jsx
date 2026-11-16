import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";
import { formatPrice } from "../utils";
import "./Home.css";

// One row of albums with a title, like "New" or "Coming soon"
function Section({ title, albums, dark = false }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <Link to="/store">Show all</Link>
      </div>
      <div className="grid">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} dark={dark} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(false);

  // When the page opens, ask the server for the albums
  useEffect(() => {
    fetch("/api/albums")
      .then((res) => res.json())
      .then(setAlbums)
      .catch(() => setError(true));
  }, []);

  const featured = albums.find((album) => album.featured);
  const inSection = (name) => albums.filter((album) => album.section === name);

  if (error) {
    return <p className="message">Could not load the albums. Is the server running?</p>;
  }

  return (
    <>
      {featured && (
        <section className="hero">
          <div className="hero-rings" aria-hidden="true" />
          <div className="hero-text">
            <p className="hero-label">Special edition</p>
            <h1>{featured.artist}</h1>
            <p className="hero-title">{featured.title}</p>
            <div className="hero-meta">
              <span>{featured.format}</span>
              <span>{formatPrice(featured.price_cents)}</span>
            </div>
            <Link to={`/albums/${featured.slug}`} className="hero-link">
              More details
            </Link>
          </div>
        </section>
      )}

      <Section title="New" albums={inSection("new")} />
      <Section title="Best sellers" albums={inSection("bestseller")} />
      <Section title="Coming soon" albums={inSection("coming_soon")} dark />
    </>
  );
}