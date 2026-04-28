import { describe, it, expect, beforeEach } from "vitest";
import { createTabViewModel } from "../tabViewModel";

describe("TabViewModel", () => {
  let vm: ReturnType<typeof createTabViewModel>;

  beforeEach(() => {
    vm = createTabViewModel("panel-1");
  });

  // --- Estado inicial ---
  it("inicia con una tab activa en índice 0", () => {
    expect(vm.getActiveTabIndex()).toBe(0);
  });

  it("inicia con una tab por defecto", () => {
    expect(vm.getTabs()).toHaveLength(1);
  });

  // --- Navegación ---
  it("puede moverse a la siguiente tab con moveNext", () => {
    vm.addTab("Tab 2");
    vm.moveNext();
    expect(vm.getActiveTabIndex()).toBe(1);
  });

  it("puede moverse a la tab anterior con movePrev", () => {
    vm.addTab("Tab 2");
    vm.setActiveTab(1);
    vm.movePrev();
    expect(vm.getActiveTabIndex()).toBe(0);
  });

  it("moveNext desde la última tab no hace nada", () => {
    vm.moveNext();
    expect(vm.getActiveTabIndex()).toBe(0);
  });

  it("movePrev desde la primera tab no hace nada", () => {
    vm.movePrev();
    expect(vm.getActiveTabIndex()).toBe(0);
  });

  it("puede saltar a tab por número (1-indexado)", () => {
    vm.addTab("Tab 2");
    vm.addTab("Tab 3");
    vm.jumpToTab(2);
    expect(vm.getActiveTabIndex()).toBe(1);
  });

  it("jumpToTab con índice fuera de rango no hace nada", () => {
    vm.jumpToTab(99);
    expect(vm.getActiveTabIndex()).toBe(0);
  });

  // --- Agregar y cerrar tabs ---
  it("puede agregar una tab", () => {
    vm.addTab("Nueva");
    expect(vm.getTabs()).toHaveLength(2);
  });

  it("al agregar una tab se enfoca automáticamente", () => {
    vm.addTab("Nueva");
    expect(vm.getActiveTabIndex()).toBe(1);
  });

  it("puede cerrar una tab que no sea la única", () => {
    vm.addTab("Tab 2");
    vm.closeTab(1);
    expect(vm.getTabs()).toHaveLength(1);
  });

  it("no puede cerrar la última tab", () => {
    vm.closeTab(0);
    expect(vm.getTabs()).toHaveLength(1);
  });

  it("al cerrar la tab activa, enfoca la anterior", () => {
    vm.addTab("Tab 2");
    vm.setActiveTab(1);
    vm.closeTab(1);
    expect(vm.getActiveTabIndex()).toBe(0);
  });
});
