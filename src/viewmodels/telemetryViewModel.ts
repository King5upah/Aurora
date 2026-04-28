import type { TokenUsage, ConversationSession, Message } from "../types";

const DEGRADATION_THRESHOLD = 0.50;
const COMPACTION_WARNING_THRESHOLD = 0.80;

function emptyUsage(contextWindowSize: number): TokenUsage {
  return {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    contextWindowSize,
    contextWindowUsedPercent: 0,
    degradationThreshold: DEGRADATION_THRESHOLD * 100,
    compactionWarningThreshold: COMPACTION_WARNING_THRESHOLD * 100,
  };
}

export function createTelemetryViewModel(contextWindowSize: number) {
  let usage = emptyUsage(contextWindowSize);
  let messages: Message[] = [];
  let sessionHistory: ConversationSession[] = [];
  let sessionStart = new Date();

  function recalc() {
    usage = {
      ...usage,
      contextWindowUsedPercent: (usage.totalTokens / contextWindowSize) * 100,
    };
  }

  return {
    getUsage: () => ({ ...usage }),
    getSessionHistory() {
      const active: ConversationSession = {
        id: "active",
        startedAt: sessionStart,
        messages: [...messages],
        tokenUsage: { ...usage },
      };
      return [...sessionHistory, active];
    },

    addMessage(role: "user" | "assistant", tokens: number) {
      const msg: Message = {
        id: crypto.randomUUID(),
        role,
        content: "",
        tokens,
        timestamp: new Date(),
      };
      messages = [...messages, msg];

      if (role === "user") {
        usage = { ...usage, inputTokens: usage.inputTokens + tokens, totalTokens: usage.totalTokens + tokens };
      } else {
        usage = { ...usage, outputTokens: usage.outputTokens + tokens, totalTokens: usage.totalTokens + tokens };
      }
      recalc();
    },

    isDegrading() {
      return usage.contextWindowUsedPercent > DEGRADATION_THRESHOLD * 100;
    },

    needsCompactionWarning() {
      return usage.contextWindowUsedPercent > COMPACTION_WARNING_THRESHOLD * 100;
    },

    reset() {
      messages = [];
      usage = emptyUsage(contextWindowSize);
      sessionStart = new Date();
    },

    startNewSession() {
      sessionHistory = [
        ...sessionHistory,
        {
          id: crypto.randomUUID(),
          startedAt: sessionStart,
          messages: [...messages],
          tokenUsage: { ...usage },
        },
      ];
      messages = [];
      usage = emptyUsage(contextWindowSize);
      sessionStart = new Date();
    },
  };
}
