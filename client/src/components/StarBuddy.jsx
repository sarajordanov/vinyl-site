// How far each spike sticks out. Different lengths make it look hand-drawn.
const spikes = [78, 60, 82, 58, 76, 62, 80, 58, 74];

// An arm or a leg: a dark outline with a lighter line on top
function Limb({ d, color }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#0d0624" strokeWidth="11" />
      <path d={d} stroke={color} strokeWidth="6" />
    </g>
  );
}

export default function StarBuddy({
  className = "",
  star = "#0d0624",
  face = "#efe7d3",
  limb = "#efe7d3",
}) {
  const step = (Math.PI * 2) / spikes.length;

  // Work out the corners of the star: a tip, then a dent, then a tip...
  const points = spikes
    .flatMap((r, i) => {
      const tip = -Math.PI / 2 + step * i;
      const dent = tip + step / 2;
      return [
        [100 + r * Math.cos(tip), 105 + r * Math.sin(tip)],
        [100 + 34 * Math.cos(dent), 105 + 34 * Math.sin(dent)],
      ];
    })
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg className={className} viewBox="0 0 200 250" aria-hidden="true">
      {/* Arms and legs are drawn first, so they come out from behind the star */}
      <Limb color={limb} d="M88 150 Q80 185 72 212" />
      <Limb color={limb} d="M116 150 Q128 182 136 208" />
      <Limb color={limb} d="M62 110 Q30 112 16 140" />
      <Limb color={limb} d="M142 98 Q172 90 186 60" />

      {/* Shoes and gloves */}
      <g fill="#fff" stroke="#0d0624" strokeWidth="3">
        <ellipse cx="62" cy="219" rx="17" ry="9" />
        <ellipse cx="146" cy="214" rx="17" ry="9" />
        <circle cx="14" cy="144" r="11" />
        <circle cx="188" cy="56" r="11" />
      </g>

      {/* The star body and its face */}
      <polygon points={points} fill={star} strokeLinejoin="round" />
      <g fill="none" stroke={face} strokeWidth="3" strokeLinecap="round">
        <path d="M86 88 v16" />
        <path d="M114 88 v16" />
        <path d="M82 120 Q100 138 118 120" />
      </g>
    </svg>
  );
}