import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** A fine pointer that can hover: the only case that gets the custom cursor. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useMobile = () => useMediaQuery("(max-width: 760px)");
/** Too narrow or too short to pin a full-screen section without clipping it. */
export const useNoPin = () => useMediaQuery("(max-width: 760px), (max-height: 700px)");
