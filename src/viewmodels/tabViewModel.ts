import type { Tab } from "../types";

export function createTabViewModel(_panelId: string) {
  let tabs: Tab[] = [{ id: crypto.randomUUID(), title: "1" }];
  let activeTabIndex = 0;

  return {
    getTabs: () => [...tabs],
    getActiveTabIndex: () => activeTabIndex,

    setActiveTab(index: number) {
      if (index < 0 || index >= tabs.length) return;
      activeTabIndex = index;
    },

    addTab(title: string) {
      tabs = [...tabs, { id: crypto.randomUUID(), title }];
      activeTabIndex = tabs.length - 1;
    },

    closeTab(index: number) {
      if (tabs.length <= 1) return;
      tabs = tabs.filter((_, i) => i !== index);
      if (activeTabIndex >= tabs.length) {
        activeTabIndex = tabs.length - 1;
      }
    },

    moveNext() {
      if (activeTabIndex < tabs.length - 1) activeTabIndex++;
    },

    movePrev() {
      if (activeTabIndex > 0) activeTabIndex--;
    },

    jumpToTab(oneIndexed: number) {
      const idx = oneIndexed - 1;
      if (idx < 0 || idx >= tabs.length) return;
      activeTabIndex = idx;
    },
  };
}
