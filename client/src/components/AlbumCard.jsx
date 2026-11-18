import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import "./AlbumCard.css";

// Placeholder colors, used when an album has no image (or it fails to load)
const palette = [
  { bg: "#3a14b8", fg: "#efe7d3" },
  { bg: "#ff5e33", fg: "#0d0624" },
  { bg: "#b7cf4f", fg: "#0d0624" },
];

export default function AlbumCard({ album }) {
  const [broken, setBroken] = useState(false);
  const showImage = album.cover_url && !broken;

  const n = [...album.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const color = palette[n % palette.length];

  return (
    <Link to={`/albums/${album.slug}`} className="card">
      <div className="card-art">
        {/* The record hides behind the cover and slides out on hover */}
        <svg className="card-record" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="98" fill="#0d0624" stroke="#efe7d3" strokeOpacity="0.35" strokeWidth="2" />
          <g fill="none" stroke="#2b2158" strokeWidth="1.2">
            <circle cx="100" cy="100" r="86" />
            <circle cx="100" cy="100" r="74" />
            <circle cx="100" cy="100" r="62" />
            <circle cx="100" cy="100" r="50" />
          </g>
          <path d="M115 13 A88 88 0 0 1 167 43" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="28" fill="#b7cf4f" />
          <circle cx="100" cy="100" r="3" fill="#0d0624" />
        </svg>

        <div
          className={showImage ? "card-cover card-cover--image" : "card-cover"}
          style={showImage ? undefined : { background: color.bg, color: color.fg }}
        >
          {showImage ? (
            <img
              src={album.cover_url}
              alt={`Cover of ${album.title} by ${album.artist}`}
              loading="lazy"
              onError={() => setBroken(true)}
            />
          ) : (
            <span>{album.title}</span>
          )}
        </div>
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