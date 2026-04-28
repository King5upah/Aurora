import { useCallback } from "react";
import { useLayout } from "../hooks/useLayout";
import { useKeyboard } from "../hooks/useKeyboard";
import { PanelContainer } from "./PanelContainer";
import { CommandBar } from "./CommandBar";
import type { PanelType } from "../types";

export function Workspace() {
  const { layout, openPanel, closePanel, focusPanel, moveFocus, toggleFullscreen } = useLayout();

  const handlers = useCallback(() => ({
    onPanelMove: (dir: "left" | "right") => moveFocus(dir),
    onToggleFullscreen: () => toggleFullscreen(),
    onTabJump: (_n: number) => {},
    onTabMove: (_d: "prev" | "next") => {},
  }), [moveFocus, toggleFullscreen]);

  useKeyboard(handlers());

  const anyFullscreen = layout.panels.some((p) => p.isFullscreen);
  const visiblePanels = anyFullscreen
    ? layout.panels.filter((p) => p.isFullscreen)
    : layout.panels;

  return (
    <div className={`workspace layout-${layout.mode}`}>
      <div className="panels">
        {visiblePanels.map((panel) => (
          <PanelContainer
            key={panel.id}
            panel={panel}
            isFocused={layout.focusedPanelId === panel.id}
            onFocus={() => focusPanel(panel.id)}
            onClose={() => closePanel(panel.id)}
          />
        ))}
      </div>
      <CommandBar
        activePanelTypes={layout.panels.map((p) => p.type as PanelType)}
        onOpen={openPanel}
      />
    </div>
  );
}
