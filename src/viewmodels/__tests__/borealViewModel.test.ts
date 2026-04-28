import { describe, it, expect, beforeEach } from "vitest";
import { createBorealViewModel } from "../borealViewModel";

describe("BorealViewModel", () => {
  let vm: ReturnType<typeof createBorealViewModel>;

  beforeEach(() => {
    vm = createBorealViewModel();
  });

  // --- Estado inicial ---
  it("inicia con URL vacía", () => {
    expect(vm.getCurrentUrl()).toBe("");
  });

  it("inicia sin historial", () => {
    expect(vm.canGoBack()).toBe(false);
    expect(vm.canGoForward()).toBe(false);
  });

  it("inicia sin carga en progreso", () => {
    expect(vm.isLoading()).toBe(false);
  });

  // --- Navegación ---
  it("puede navegar a una URL", () => {
    vm.navigate("http://localhost:3000");
    expect(vm.getCurrentUrl()).toBe("http://localhost:3000");
  });

  it("navegar activa el estado de carga", () => {
    vm.navigate("http://localhost:3000");
    expect(vm.isLoading()).toBe(true);
  });

  it("confirmar carga desactiva estado de carga", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    expect(vm.isLoading()).toBe(false);
  });

  it("navegar a segunda URL habilita volver atrás", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.navigate("http://localhost:3000/about");
    expect(vm.canGoBack()).toBe(true);
  });

  it("puede volver atrás", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.navigate("http://localhost:3000/about");
    vm.onLoadComplete();
    vm.goBack();
    expect(vm.getCurrentUrl()).toBe("http://localhost:3000");
  });

  it("volver atrás habilita ir adelante", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.navigate("http://localhost:3000/about");
    vm.onLoadComplete();
    vm.goBack();
    expect(vm.canGoForward()).toBe(true);
  });

  it("puede ir adelante", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.navigate("http://localhost:3000/about");
    vm.onLoadComplete();
    vm.goBack();
    vm.goForward();
    expect(vm.getCurrentUrl()).toBe("http://localhost:3000/about");
  });

  it("navegar a nueva URL limpia el historial hacia adelante", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.navigate("http://localhost:3000/about");
    vm.onLoadComplete();
    vm.goBack();
    vm.navigate("http://localhost:3000/new");
    expect(vm.canGoForward()).toBe(false);
  });

  it("puede recargar la URL actual", () => {
    vm.navigate("http://localhost:3000");
    vm.onLoadComplete();
    vm.reload();
    expect(vm.isLoading()).toBe(true);
    expect(vm.getCurrentUrl()).toBe("http://localhost:3000");
  });

  // --- Archivos locales ---
  it("puede navegar a un archivo local (file://)", () => {
    vm.navigate("file:///Users/rodo/proyecto/index.html");
    expect(vm.getCurrentUrl()).toBe("file:///Users/rodo/proyecto/index.html");
  });

  // --- Saturno view ---
  it("puede cargar la vista del grafo de Saturno", () => {
    vm.loadSaturnoGraph();
    expect(vm.getCurrentUrl()).toContain("saturno");
  });
});
