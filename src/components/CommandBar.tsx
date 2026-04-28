import type { PanelType } from "../types";

const AVAILABLE_PANELS: { type: PanelType; label: string; icon: string }[] = [
  { type: "terminal",  label: "Terminal",         icon: "$" },
  { type: "editor",    label: "Editor",           icon: "✦" },
  { type: "boreal",    label: "Boreal",           icon: "◎" },
  { type: "saturno",   label: "Saturno",          icon: "⬡" },
  { type: "telemetry", label: "Mission Telemetry", icon: "◉" },
];

interface Props {
  activePanelTypes: PanelType[];
  onOpen: (type: PanelType) => void;
}

export function CommandBar({ activePanelTypes, onOpen }: Props) {
  return (
    <div className="command-bar">
      {AVAILABLE_PANELS.map(({ type, label, icon }) => {
        const isActive = activePanelTypes.includes(type);
        return (
          <button
            key={type}
            className={`command-btn ${isActive ? "active" : ""}`}
            onClick={() => onOpen(type)}
            title={label}
            disabled={isActive}
          >
            <span className="cmd-icon">{icon}</span>
            <span className="cmd-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
