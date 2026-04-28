const LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  rs: "rust",
  md: "markdown",
  py: "python",
  go: "go",
  json: "json",
  css: "css",
  html: "html",
};

export function createEditorViewModel() {
  let filePath: string | null = null;
  let content = "";
  let unsaved = false;
  let open = false;
  let cursor = { line: 0, column: 0 };

  function lineCount() {
    return content.split("\n").length;
  }

  return {
    isOpen: () => open,
    getCurrentFile: () => filePath,
    getContent: () => content,
    hasUnsavedChanges: () => unsaved,
    getCursorPosition: () => ({ ...cursor }),

    openFile(path: string, fileContent: string) {
      filePath = path;
      content = fileContent;
      unsaved = false;
      open = true;
      cursor = { line: 0, column: 0 };
    },

    close() {
      open = false;
    },

    setContent(next: string) {
      content = next;
      unsaved = true;
    },

    markSaved() {
      unsaved = false;
    },

    getLanguage(): string {
      if (!filePath) return "plaintext";
      const ext = filePath.split(".").pop() ?? "";
      return LANGUAGE_MAP[ext] ?? "plaintext";
    },

    setCursorPosition(line: number, column: number) {
      if (line < 0 || line >= lineCount()) return;
      cursor = { line, column };
    },
  };
}
