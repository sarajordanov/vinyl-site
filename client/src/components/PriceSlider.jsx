import { useEffect, useState } from "react";
import "./PriceSlider.css";

// A price slider with two handles. min/max are the ends of the whole track,
// low/high are the current choice. onCommit runs when you let go of a handle.
export default function PriceSlider({ min, max, low, high, onCommit }) {
  const [open, setOpen] = useState(true);
  const [range, setRange] = useState([low, high]);
  const [a, b] = range;

  // If the address changes (Clear, back button), follow it
  useEffect(() => {
    setRange([low, high]);
  }, [low, high]);

  const percent = (value) => ((value - min) / (max - min)) * 100;

  function moveLow(event) {
    setRange([Math.min(Number(event.target.value), b), b]);
  }

  function moveHigh(event) {
    setRange([a, Math.max(Number(event.target.value), a)]);
  }

  const commit = () => onCommit(a, b);

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
              onPointerUp={commit}
              onKeyUp={commit}
            />
            <input
              type="range"
              aria-label="Maximum price"
              min={min}
              max={max}
              step="1"
              value={b}
              onChange={moveHigh}
              onPointerUp={commit}
              onKeyUp={commit}
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