import { useId } from "react";

// A ticket-shaped sticker. Change the text, and optionally the colors.
export default function TicketSticker({
  text = "LIMITED DROP",
  small = "ONLY 3 LEFT",
  band = "DROP TIME",
  bg = "var(--lime)",
  fg = "var(--ink)",
  className = "",
}) {
  // Each sticker needs its own mask name, so several can share a page
  const id = useId().replace(/:/g, "");

  const corners = [[10, 30], [390, 30], [10, 220], [390, 220]];
  const bites = [85, 105, 125, 145, 165];
  const bandText = `${band} · ${band} · ${band} · ${band}`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 250"
      role="img"
      aria-label={`${text}, ${small}`}
    >
      <defs>
        {/* The mask cuts the notched corners and the small bites out of the ticket */}
        <mask id={`${id}-cut`}>
          <rect width="400" height="250" fill="#fff" />
          {corners.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="34" fill="#000" />
          ))}
          {bites.map((y) => (
            <g key={y}>
              <circle cx="10" cy={y} r="8" fill="#000" />
              <circle cx="390" cy={y} r="8" fill="#000" />
            </g>
          ))}
        </mask>
      </defs>

      <g mask={`url(#${id}-cut)`}>
        <rect x="10" y="30" width="380" height="190" fill={bg} />

        <g fill={fg} fontFamily="Montserrat, sans-serif" fontSize="15" letterSpacing="2" textAnchor="middle">
          <text x="200" y="62">{bandText}</text>
          <text x="200" y="199">{bandText}</text>
        </g>
      </g>

      <g fill="none" stroke={fg}>
        <ellipse cx="200" cy="125" rx="150" ry="52" strokeWidth="2" />
        <ellipse cx="200" cy="125" rx="145" ry="47" strokeWidth="1" />
      </g>

      <text x="200" y="130" fill={fg} fontFamily="Caprasimo, serif" fontSize="34" textAnchor="middle">
        {text}
      </text>
      <text x="200" y="158" fill={fg} fontFamily="Montserrat, sans-serif" fontSize="14" fontWeight="600" letterSpacing="2" textAnchor="middle">
        {small}
      </text>
    </svg>
  );
}