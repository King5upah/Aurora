import { useState, useCallback, useMemo } from "react";
import { createLayoutViewModel } from "../viewmodels/layoutViewModel";
import type { PanelType } from "../types";

export function useLayout() {
  const vm = useMemo(() => createLayoutViewModel(), []);
  const [, forceRender] = useState(0);

  const update = useCallback(() => forceRender((n) => n + 1), []);

  return {
    layout: vm.getLayout(),

    openPanel(type: PanelType) {
      vm.openPanel(type);
      update();
    },
    closePanel(id: string) {
      vm.closePanel(id);
      update();
    },
    focusPanel(id: string) {
      vm.focusPanel(id);
      update();
    },
    moveFocus(direction: "left" | "right") {
      vm.moveFocus(direction);
      update();
    },
    toggleFullscreen() {
      vm.toggleFullscreen();
      update();
    },
  };
}
