import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

export function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(function () {
    inputEl.current.focus();
  }, []);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      placeholder="Search movies..."
      type="text"
      ref={inputEl}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
