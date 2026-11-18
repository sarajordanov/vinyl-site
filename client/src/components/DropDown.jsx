import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./Dropdown.css";

const MENU_MAX = 320; // tallest the menu may be, in pixels
const OPTION_HEIGHT = 42; // roughly one row of the menu
const SPACE = 16; // keep this much distance from the edge of the window

// A dropdown menu. options look like [{ value: "pop", label: "Pop" }, ...]
// It opens downward when there is room, and upward when there is not.
export default function Dropdown({ prefix = "", options, value, onChange, align = "left" }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ up: false, maxHeight: MENU_MAX });
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  const current = options.find((option) => option.value === value) ?? options[0];

  // Look at where the button is in the window and decide where the menu goes
  const measure = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const wanted = Math.min(options.length * OPTION_HEIGHT + 12, MENU_MAX);
    const below = window.innerHeight - rect.bottom - SPACE;
    const above = rect.top - SPACE;

    const up = below < wanted && above > below;
    const maxHeight = Math.max(120, Math.min(MENU_MAX, up ? above : below));

    // Only update when something changed
    setPlacement((prev) =>
      prev.up === up && prev.maxHeight === maxHeight ? prev : { up, maxHeight }
    );
  }, [options.length]);

  // While the menu is open: close it on a click outside or Escape,
  // and re-check the position when the page scrolls or the window changes size
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!rootRef.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  function toggle() {
    if (!open) measure(); // decide the direction before the menu appears
    setOpen(!open);
  }

  function choose(nextValue) {
    onChange(nextValue);
    setOpen(false);
    buttonRef.current.focus();
  }

  return (
    <div className="dd-disc" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="dd-disc__btn"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={toggle}
      >
        {prefix && <span>{prefix}</span>}
        <span>{current.label}</span>
      </button>

      {open && (
        <ul
          id={menuId}
          className={`dd-disc__sub dd-disc__sub--${align} ${placement.up ? "dd-disc__sub--up" : ""}`}
          style={{ maxHeight: placement.maxHeight }}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className="dd-disc__opt"
                aria-current={option.value === value ? "true" : undefined}
                onClick={() => choose(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}