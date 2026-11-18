import { useEffect, useState } from "react";
import "./PriceSlider.css";

// A price slider with two handles. min/max are the ends of the whole track,
// low/high are the current choice. onCommit runs a moment after you stop moving a handle.
export default function PriceSlider({ min, max, low, high, onCommit }) {
  const [open, setOpen] = useState(true);
  const [range, setRange] = useState([low, high]);
  const [a, b] = range;

  // If the address changes (Clear, back button), follow it
  useEffect(() => {
    setRange([low, high]);
  }, [low, high]);

  // Wait until the handle stops moving, then tell the page
  useEffect(() => {
    if (a === low && b === high) return;
    const timer = setTimeout(() => onCommit(a, b), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b]);

  const percent = (value) => ((value - min) / (max - min)) * 100;

  function moveLow(event) {
    setRange([Math.min(Number(event.target.value), b), b]);
  }

  function moveHigh(event) {
    setRange([a, Math.max(Number(event.target.value), a)]);
  }

  return (
    <div className="price">
      <button
        type="button"
        className="price-head"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>Price</span>
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>

      {open && (
        <>
          <div className="dual">
            <div className="dual-line">
              <div className="dual-track" />
              <div
                className="dual-fill"
                style={{ left: `${percent(a)}%`, width: `${percent(b) - percent(a)}%` }}
              />
            </div>

            <input
              type="range"
              aria-label="Minimum price"
              min={min}
              max={max}
              step="1"
              value={a}
              className={a > (min + max) / 2 ? "on-top" : ""}
              onChange={moveLow}
            />
            <input
              type="range"
              aria-label="Maximum price"
              min={min}
              max={max}
              step="1"
              value={b}
              onChange={moveHigh}
            />
          </div>

          <div className="price-values" aria-live="polite">
            <span>${a}</span>
            <span>${b}</span>
          </div>
        </>
      )}
    </div>
  );
}