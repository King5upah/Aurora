import { describe, it, expect, beforeEach } from "vitest";
import { createEditorViewModel } from "../editorViewModel";

describe("EditorViewModel", () => {
  let vm: ReturnType<typeof createEditorViewModel>;

  beforeEach(() => {
    vm = createEditorViewModel();
  });

  // --- Estado inicial ---
  it("inicia sin archivo abierto", () => {
    expect(vm.getCurrentFile()).toBeNull();
  });

  it("inicia sin cambios sin guardar", () => {
    expect(vm.hasUnsavedChanges()).toBe(false);
  });

  it("inicia cerrado", () => {
    expect(vm.isOpen()).toBe(false);
  });

  // --- Abrir y cerrar ---
  it("puede abrir el editor con un archivo", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    expect(vm.isOpen()).toBe(true);
  });

  it("puede cerrar el editor", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    vm.close();
    expect(vm.isOpen()).toBe(false);
  });

  it("al abrir un archivo se carga su contenido", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    expect(vm.getContent()).toBe("const x = 1;");
  });

  it("al abrir un archivo se guarda su ruta", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    expect(vm.getCurrentFile()).toBe("/ruta/archivo.ts");
  });

  // --- Edición ---
  it("puede actualizar el contenido", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    vm.setContent("const x = 2;");
    expect(vm.getContent()).toBe("const x = 2;");
  });

  it("actualizar contenido marca cambios sin guardar", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    vm.setContent("const x = 2;");
    expect(vm.hasUnsavedChanges()).toBe(true);
  });

  it("guardar limpia cambios sin guardar", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    vm.setContent("const x = 2;");
    vm.markSaved();
    expect(vm.hasUnsavedChanges()).toBe(false);
  });

  // --- Lenguaje y syntax ---
  it("detecta TypeScript por extensión .ts", () => {
    vm.openFile("/ruta/archivo.ts", "");
    expect(vm.getLanguage()).toBe("typescript");
  });

  it("detecta JavaScript por extensión .js", () => {
    vm.openFile("/ruta/archivo.js", "");
    expect(vm.getLanguage()).toBe("javascript");
  });

  it("detecta Rust por extensión .rs", () => {
    vm.openFile("/ruta/archivo.rs", "");
    expect(vm.getLanguage()).toBe("rust");
  });

  it("detecta Markdown por extensión .md", () => {
    vm.openFile("/ruta/archivo.md", "");
    expect(vm.getLanguage()).toBe("markdown");
  });

  it("devuelve 'plaintext' para extensiones desconocidas", () => {
    vm.openFile("/ruta/archivo.xyz", "");
    expect(vm.getLanguage()).toBe("plaintext");
  });

  // --- Cursor ---
  it("inicia con cursor en posición 0,0", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    expect(vm.getCursorPosition()).toEqual({ line: 0, column: 0 });
  });

  it("puede mover el cursor a una posición válida", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;\nconst y = 2;");
    vm.setCursorPosition(1, 5);
    expect(vm.getCursorPosition()).toEqual({ line: 1, column: 5 });
  });

  it("cursor no puede ir a una línea que no existe", () => {
    vm.openFile("/ruta/archivo.ts", "const x = 1;");
    vm.setCursorPosition(99, 0);
    expect(vm.getCursorPosition()).toEqual({ line: 0, column: 0 });
  });
});
