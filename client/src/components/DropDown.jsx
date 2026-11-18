import { useEffect, useId, useRef, useState } from "react";
import "./DropDown.css";

// A dropdown menu. options look like [{ value: "pop", label: "Pop" }, ...]
export default function Dropdown({ prefix = "", options, value, onChange, align = "left" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  const current = options.find((option) => option.value === value) ?? options[0];

  // While the menu is open: close it on a click outside, or on Escape
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
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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
        onClick={() => setOpen(!open)}
      >
        {prefix && <span>{prefix}</span>}
        <span>{current.label}</span>
      </button>

      {open && (
        <ul id={menuId} className={`dd-disc__sub dd-disc__sub--${align}`}>
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