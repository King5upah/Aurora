import type { SaturnoNode, SaturnoGraph } from "../types";

export function createSaturnoViewModel() {
  let nodes: SaturnoNode[] = [];
  let selectedNodeId: string | null = null;

  function buildEdges(ns: SaturnoNode[]): [string, string][] {
    const filenameToId = new Map(ns.map((n) => [n.filename, n.id]));
    const edges: [string, string][] = [];

    for (const node of ns) {
      for (const link of node.links) {
        const targetId = filenameToId.get(link);
        if (targetId) {
          edges.push([node.id, targetId]);
        }
      }
    }
    return edges;
  }

  return {
    getGraph(): SaturnoGraph {
      return { nodes: [...nodes], edges: buildEdges(nodes) };
    },

    getSelectedNode(): SaturnoNode | null {
      return nodes.find((n) => n.id === selectedNodeId) ?? null;
    },

    loadNodes(incoming: SaturnoNode[]) {
      nodes = [...incoming];
    },

    setNodeActive(id: string, active: boolean) {
      nodes = nodes.map((n) => (n.id === id ? { ...n, isActive: active } : n));
    },

    selectNode(id: string | null) {
      selectedNodeId = id;
    },

    getNodesByCategory(category: SaturnoNode["category"]): SaturnoNode[] {
      return nodes.filter((n) => n.category === category);
    },

    searchNodes(query: string): SaturnoNode[] {
      const q = query.toLowerCase();
      return nodes.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    },
  };
}
