export function createBorealViewModel() {
  let currentUrl = "";
  let loading = false;
  let history: string[] = [];
  let historyIndex = -1;

  return {
    getCurrentUrl: () => currentUrl,
    isLoading: () => loading,
    canGoBack: () => historyIndex > 0,
    canGoForward: () => historyIndex < history.length - 1,

    navigate(url: string) {
      history = history.slice(0, historyIndex + 1);
      history.push(url);
      historyIndex = history.length - 1;
      currentUrl = url;
      loading = true;
    },

    onLoadComplete() {
      loading = false;
    },

    goBack() {
      if (historyIndex <= 0) return;
      historyIndex--;
      currentUrl = history[historyIndex];
    },

    goForward() {
      if (historyIndex >= history.length - 1) return;
      historyIndex++;
      currentUrl = history[historyIndex];
    },

    reload() {
      loading = true;
    },

    loadSaturnoGraph() {
      this.navigate("saturno://graph");
    },
  };
}
