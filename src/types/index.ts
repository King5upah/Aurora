export type PanelType = "claude" | "terminal" | "editor" | "boreal" | "saturno" | "telemetry";

export type LayoutMode = "single" | "split-h" | "split-v" | "triple";

export interface Panel {
  id: string;
  type: PanelType;
  title: string;
  activeTabIndex: number;
  tabs: Tab[];
  isFullscreen: boolean;
}

export interface Tab {
  id: string;
  title: string;
}

export interface Layout {
  mode: LayoutMode;
  panels: Panel[];
  focusedPanelId: string | null;
  previousLayout: Layout | null;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  contextWindowSize: number;
  contextWindowUsedPercent: number;
  degradationThreshold: number;
  compactionWarningThreshold: number;
}

export interface ConversationSession {
  id: string;
  startedAt: Date;
  messages: Message[];
  tokenUsage: TokenUsage;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokens: number;
  timestamp: Date;
}

export interface SaturnoNode {
  id: string;
  filename: string;
  title: string;
  category: "features" | "architecture" | "tools" | "components" | "incidents" | "meetings";
  description: string;
  links: string[];
  isActive: boolean;
}

export interface SaturnoGraph {
  nodes: SaturnoNode[];
  edges: [string, string][];
}
