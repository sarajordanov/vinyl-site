import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import "./AlbumCard.css";

// Placeholder cover colors, until we add real cover images
const palette = [
  { bg: "#1a0089", fg: "#efe7d3" },
  { bg: "#ff5e33", fg: "#0d0624" },
  { bg: "#b7cf4f", fg: "#0d0624" },
];

export default function AlbumCard({ album }) {
  const n = [...album.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const color = palette[n % palette.length];

  return (
    <Link to={`/albums/${album.slug}`} className="card">
      <div className="card-cover" style={{ background: color.bg, color: color.fg }}>
        <span>{album.title}</span>
      </div>
      <div className="card-info">
        <div>
          <h3>{album.title}</h3>
          <p>{album.artist}</p>
        </div>
        <span>{formatPrice(album.price_cents)}</span>
      </div>
    </Link>
  );
}