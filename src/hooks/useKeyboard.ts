import { useEffect } from "react";

export interface KeyboardHandlers {
  onPanelMove?: (direction: "left" | "right") => void;
  onToggleFullscreen?: () => void;
  onTabJump?: (index: number) => void;
  onTabMove?: (direction: "prev" | "next") => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      const cmd = e.metaKey;
      const opt = e.altKey;

      if (cmd && !opt) {
        if (e.key === "ArrowLeft") { e.preventDefault(); handlers.onPanelMove?.("left"); return; }
        if (e.key === "ArrowRight") { e.preventDefault(); handlers.onPanelMove?.("right"); return; }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); handlers.onToggleFullscreen?.(); return; }
      }

      if (opt && !cmd) {
        if (e.key === "ArrowLeft") { e.preventDefault(); handlers.onTabMove?.("prev"); return; }
        if (e.key === "ArrowRight") { e.preventDefault(); handlers.onTabMove?.("next"); return; }
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          e.preventDefault();
          handlers.onTabJump?.(num);
        }
      }
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handlers]);
}
