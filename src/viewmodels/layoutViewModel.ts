import type { Layout, Panel, PanelType } from "../types";

function makePanel(type: PanelType): Panel {
  return {
    id: crypto.randomUUID(),
    type,
    title: type,
    activeTabIndex: 0,
    tabs: [{ id: crypto.randomUUID(), title: "1" }],
    isFullscreen: false,
  };
}

function modeForCount(count: number): Layout["mode"] {
  if (count === 1) return "single";
  if (count === 2) return "split-h";
  return "triple";
}

export function createLayoutViewModel() {
  let layout: Layout = {
    mode: "single",
    panels: [makePanel("claude")],
    focusedPanelId: null,
    previousLayout: null,
  };

  function sync() {
    const visible = layout.panels.filter((p) => !p.isFullscreen || layout.panels.length === 1);
    layout = {
      ...layout,
      mode: modeForCount(layout.panels.length),
    };
  }

  return {
    getLayout: () => layout,

    openPanel(type: PanelType) {
      if (layout.panels.length >= 3) return;
      if (layout.panels.some((p) => p.type === type)) return;
      layout = {
        ...layout,
        panels: [...layout.panels, makePanel(type)],
      };
      sync();
    },

    closePanel(id: string) {
      const panel = layout.panels.find((p) => p.id === id);
      if (!panel || panel.type === "claude") return;
      layout = {
        ...layout,
        panels: layout.panels.filter((p) => p.id !== id),
      };
      sync();
    },

    focusPanel(id: string) {
      layout = { ...layout, focusedPanelId: id };
    },

    moveFocus(direction: "left" | "right") {
      const idx = layout.panels.findIndex((p) => p.id === layout.focusedPanelId);
      if (idx === -1) return;
      const next = direction === "right" ? idx + 1 : idx - 1;
      if (next < 0 || next >= layout.panels.length) return;
      layout = { ...layout, focusedPanelId: layout.panels[next].id };
    },

    toggleFullscreen() {
      const focused = layout.panels.find((p) => p.id === layout.focusedPanelId);
      if (!focused) return;

      if (focused.isFullscreen) {
        layout = layout.previousLayout!;
        return;
      }

      const snapshot: Layout = JSON.parse(JSON.stringify(layout));
      layout = {
        ...layout,
        previousLayout: snapshot,
        panels: layout.panels.map((p) => ({
          ...p,
          isFullscreen: p.id === focused.id,
        })),
      };
    },
  };
}
