import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import "./AlbumCard.css";

export default function AlbumCard({ album, dark = false }) {
  // A placeholder color made from the album name, until we add real covers
  const hue = [...album.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;

  return (
    <Link to={`/albums/${album.slug}`} className={dark ? "card card-dark" : "card"}>
      <div className="card-cover" style={{ background: `hsl(${hue} 35% 22%)` }}>
        <span>{album.title}</span>
      </div>
      <h3>{album.artist}</h3>
      <p className="card-title">{album.title}</p>
      <div className="card-meta">
        <span>{album.format}</span>
        <span>{formatPrice(album.price_cents)}</span>
      </div>
    </Link>
  );
}