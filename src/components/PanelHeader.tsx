import type { Panel, PanelType } from "../types";

const PANEL_LABELS: Record<PanelType, string> = {
  claude: "Claude",
  terminal: "Terminal",
  editor: "Editor",
  boreal: "Boreal",
  saturno: "Saturno",
  telemetry: "Telemetría",
};

interface Props {
  panel: Panel;
  isFocused: boolean;
  onClose?: () => void;
  onFocus: () => void;
}

export function PanelHeader({ panel, isFocused, onClose, onFocus }: Props) {
  return (
    <div
      className={`panel-header ${isFocused ? "focused" : ""}`}
      onClick={onFocus}
    >
      <span className="panel-title">{PANEL_LABELS[panel.type]}</span>
      <div className="panel-tabs">
        {panel.tabs.map((tab, i) => (
          <span
            key={tab.id}
            className={`tab ${i === panel.activeTabIndex ? "active" : ""}`}
          >
            {tab.title}
          </span>
        ))}
      </div>
      {panel.type !== "claude" && onClose && (
        <button
          className="panel-close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          ×
        </button>
      )}
    </div>
  );
}
