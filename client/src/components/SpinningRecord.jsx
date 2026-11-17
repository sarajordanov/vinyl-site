export default function SpinningRecord({ className = "", label = "var(--lime)", showLabel = true }) {
  return (
    <div className={`record ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" fill="#0d0624" />

        {/* The grooves */}
        <g fill="none" stroke="#2b2158" strokeWidth="1.2">
          <circle cx="100" cy="100" r="88" />
          <circle cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="68" />
          <circle cx="100" cy="100" r="58" />
          <circle cx="100" cy="100" r="48" />
        </g>

        {/* Light arcs, so you can see the record turning */}
        <g fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
          <path d="M115.3 13.3 A88 88 0 0 1 167.4 43.4" />
          <path d="M84.7 186.7 A88 88 0 0 1 32.6 156.6" />
          <path d="M111.8 33 A68 68 0 0 1 152.1 56.3" />
          <path d="M88.2 167 A68 68 0 0 1 47.9 143.7" />
        </g>

                {showLabel && (
          <>
            <circle cx="100" cy="100" r="30" fill={label} />
            <circle cx="100" cy="80" r="2.5" fill="#1a0089" />
            <text x="100" y="106" textAnchor="middle" fontSize="11" fill="#1a0089" fontFamily="Caprasimo, serif">
              VINYL.
            </text>
            <circle cx="100" cy="100" r="3" fill="#efe7d3" />
          </>
        )}
      </svg>
    </div>
  );
}