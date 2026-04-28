import { describe, it, expect, beforeEach } from "vitest";
import { createLayoutViewModel } from "../layoutViewModel";

describe("LayoutViewModel", () => {
  let vm: ReturnType<typeof createLayoutViewModel>;

  beforeEach(() => {
    vm = createLayoutViewModel();
  });

  // --- Estado inicial ---
  it("inicia con un panel Claude activo", () => {
    expect(vm.getLayout().panels).toHaveLength(1);
    expect(vm.getLayout().panels[0].type).toBe("claude");
  });

  it("inicia con modo single", () => {
    expect(vm.getLayout().mode).toBe("single");
  });

  it("inicia sin panel en fullscreen", () => {
    const panels = vm.getLayout().panels;
    expect(panels.every((p) => !p.isFullscreen)).toBe(true);
  });

  // --- Abrir paneles ---
  it("puede abrir un panel terminal", () => {
    vm.openPanel("terminal");
    expect(vm.getLayout().panels).toHaveLength(2);
    expect(vm.getLayout().panels[1].type).toBe("terminal");
  });

  it("puede abrir hasta 3 paneles", () => {
    vm.openPanel("terminal");
    vm.openPanel("editor");
    expect(vm.getLayout().panels).toHaveLength(3);
  });

  it("no puede abrir más de 3 paneles", () => {
    vm.openPanel("terminal");
    vm.openPanel("editor");
    vm.openPanel("boreal");
    expect(vm.getLayout().panels).toHaveLength(3);
  });

  it("no abre un panel del mismo tipo si ya existe", () => {
    vm.openPanel("terminal");
    vm.openPanel("terminal");
    expect(vm.getLayout().panels.filter((p) => p.type === "terminal")).toHaveLength(1);
  });

  // --- Cerrar paneles ---
  it("puede cerrar un panel que no sea Claude", () => {
    vm.openPanel("terminal");
    const terminalId = vm.getLayout().panels[1].id;
    vm.closePanel(terminalId);
    expect(vm.getLayout().panels).toHaveLength(1);
  });

  it("no puede cerrar el panel de Claude", () => {
    const claudeId = vm.getLayout().panels[0].id;
    vm.closePanel(claudeId);
    expect(vm.getLayout().panels).toHaveLength(1);
    expect(vm.getLayout().panels[0].type).toBe("claude");
  });

  // --- Focus ---
  it("puede enfocar un panel por id", () => {
    vm.openPanel("terminal");
    const terminalId = vm.getLayout().panels[1].id;
    vm.focusPanel(terminalId);
    expect(vm.getLayout().focusedPanelId).toBe(terminalId);
  });

  it("mover foco a la derecha desde el último panel lo mantiene ahí", () => {
    vm.openPanel("terminal");
    vm.focusPanel(vm.getLayout().panels[1].id);
    vm.moveFocus("right");
    expect(vm.getLayout().focusedPanelId).toBe(vm.getLayout().panels[1].id);
  });

  it("mover foco a la izquierda desde el primer panel lo mantiene ahí", () => {
    vm.focusPanel(vm.getLayout().panels[0].id);
    vm.moveFocus("left");
    expect(vm.getLayout().focusedPanelId).toBe(vm.getLayout().panels[0].id);
  });

  it("mover foco a la derecha desde el primer panel enfoca el segundo", () => {
    vm.openPanel("terminal");
    vm.focusPanel(vm.getLayout().panels[0].id);
    vm.moveFocus("right");
    expect(vm.getLayout().focusedPanelId).toBe(vm.getLayout().panels[1].id);
  });

  // --- Fullscreen temporal ---
  it("puede hacer fullscreen el panel enfocado", () => {
    const claudeId = vm.getLayout().panels[0].id;
    vm.focusPanel(claudeId);
    vm.toggleFullscreen();
    expect(vm.getLayout().panels[0].isFullscreen).toBe(true);
  });

  it("salir de fullscreen restaura el layout anterior", () => {
    vm.openPanel("terminal");
    const claudeId = vm.getLayout().panels[0].id;
    vm.focusPanel(claudeId);
    vm.toggleFullscreen();
    vm.toggleFullscreen();
    expect(vm.getLayout().panels).toHaveLength(2);
    expect(vm.getLayout().panels.every((p) => !p.isFullscreen)).toBe(true);
  });

  it("solo un panel puede estar en fullscreen a la vez", () => {
    vm.openPanel("terminal");
    vm.focusPanel(vm.getLayout().panels[0].id);
    vm.toggleFullscreen();
    vm.focusPanel(vm.getLayout().panels[0].id);
    vm.toggleFullscreen();
    vm.focusPanel(vm.getLayout().panels[1]?.id ?? vm.getLayout().panels[0].id);
    vm.toggleFullscreen();
    const fullscreenCount = vm.getLayout().panels.filter((p) => p.isFullscreen).length;
    expect(fullscreenCount).toBeLessThanOrEqual(1);
  });

  // --- Modo de layout ---
  it("con 1 panel el modo es single", () => {
    expect(vm.getLayout().mode).toBe("single");
  });

  it("con 2 paneles el modo es split-h", () => {
    vm.openPanel("terminal");
    expect(vm.getLayout().mode).toBe("split-h");
  });

  it("con 3 paneles el modo es triple", () => {
    vm.openPanel("terminal");
    vm.openPanel("editor");
    expect(vm.getLayout().mode).toBe("triple");
  });
});
