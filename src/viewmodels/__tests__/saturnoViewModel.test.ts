import { describe, it, expect, beforeEach } from "vitest";
import { createSaturnoViewModel } from "../saturnoViewModel";
import type { SaturnoNode } from "../../types";

const mockNodes: SaturnoNode[] = [
  {
    id: "1",
    filename: "trade_in.md",
    title: "Trade-In",
    category: "features",
    description: "Flujo completo del módulo trade-in",
    links: ["architecture.md"],
    isActive: true,
  },
  {
    id: "2",
    filename: "architecture.md",
    title: "Arquitectura general",
    category: "architecture",
    description: "Decisiones técnicas globales",
    links: [],
    isActive: false,
  },
  {
    id: "3",
    filename: "deploy.md",
    title: "Deploy",
    category: "tools",
    description: "Cómo hacer deploy",
    links: [],
    isActive: false,
  },
];

describe("SaturnoViewModel", () => {
  let vm: ReturnType<typeof createSaturnoViewModel>;

  beforeEach(() => {
    vm = createSaturnoViewModel();
  });

  // --- Estado inicial ---
  it("inicia sin nodos", () => {
    expect(vm.getGraph().nodes).toHaveLength(0);
  });

  it("inicia sin edges", () => {
    expect(vm.getGraph().edges).toHaveLength(0);
  });

  it("no tiene nodo seleccionado al inicio", () => {
    expect(vm.getSelectedNode()).toBeNull();
  });

  // --- Carga de nodos ---
  it("puede cargar nodos", () => {
    vm.loadNodes(mockNodes);
    expect(vm.getGraph().nodes).toHaveLength(3);
  });

  it("genera edges a partir de links entre nodos", () => {
    vm.loadNodes(mockNodes);
    expect(vm.getGraph().edges).toContainEqual(["1", "2"]);
  });

  it("no genera edges para links que no existen", () => {
    vm.loadNodes(mockNodes);
    expect(vm.getGraph().edges).toHaveLength(1);
  });

  // --- Nodos activos ---
  it("identifica correctamente los nodos activos", () => {
    vm.loadNodes(mockNodes);
    const activos = vm.getGraph().nodes.filter((n) => n.isActive);
    expect(activos).toHaveLength(1);
    expect(activos[0].filename).toBe("trade_in.md");
  });

  it("puede marcar un nodo como activo", () => {
    vm.loadNodes(mockNodes);
    vm.setNodeActive("2", true);
    const nodo = vm.getGraph().nodes.find((n) => n.id === "2");
    expect(nodo?.isActive).toBe(true);
  });

  it("puede desactivar un nodo activo", () => {
    vm.loadNodes(mockNodes);
    vm.setNodeActive("1", false);
    const nodo = vm.getGraph().nodes.find((n) => n.id === "1");
    expect(nodo?.isActive).toBe(false);
  });

  // --- Selección ---
  it("puede seleccionar un nodo por id", () => {
    vm.loadNodes(mockNodes);
    vm.selectNode("1");
    expect(vm.getSelectedNode()?.id).toBe("1");
  });

  it("puede deseleccionar un nodo", () => {
    vm.loadNodes(mockNodes);
    vm.selectNode("1");
    vm.selectNode(null);
    expect(vm.getSelectedNode()).toBeNull();
  });

  // --- Filtrado por categoría ---
  it("puede filtrar nodos por categoría", () => {
    vm.loadNodes(mockNodes);
    const features = vm.getNodesByCategory("features");
    expect(features).toHaveLength(1);
    expect(features[0].filename).toBe("trade_in.md");
  });

  it("filtrado por categoría sin coincidencias devuelve vacío", () => {
    vm.loadNodes(mockNodes);
    const incidents = vm.getNodesByCategory("incidents");
    expect(incidents).toHaveLength(0);
  });

  // --- Búsqueda ---
  it("puede buscar nodos por título", () => {
    vm.loadNodes(mockNodes);
    const results = vm.searchNodes("Trade");
    expect(results).toHaveLength(1);
  });

  it("búsqueda es case-insensitive", () => {
    vm.loadNodes(mockNodes);
    const results = vm.searchNodes("trade");
    expect(results).toHaveLength(1);
  });

  it("búsqueda sin coincidencias devuelve vacío", () => {
    vm.loadNodes(mockNodes);
    const results = vm.searchNodes("xyznotfound");
    expect(results).toHaveLength(0);
  });
});
