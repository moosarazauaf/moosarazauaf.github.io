import { useEffect, useRef } from "react";

/** Pointer position in a ref, updated without re-rendering. Read it inside a
 *  ticker or event handler, never during render. */
export function useMousePosition() {
  const pos = useRef({ x: -100, y: -100, nx: 0, ny: 0, moved: false });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const p = pos.current;
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      p.moved = true;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return pos;
}
