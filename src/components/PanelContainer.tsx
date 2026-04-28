import type { Panel } from "../types";
import { PanelHeader } from "./PanelHeader";
import { ClaudePanel } from "../panels/ClaudePanel";
import { TerminalPanel } from "../panels/TerminalPanel";
import { EditorPanel } from "../panels/EditorPanel";
import { BorealPanel } from "../panels/BorealPanel";
import { SaturnoPanel } from "../panels/SaturnoPanel";
import { TelemetryPanel } from "../panels/TelemetryPanel";

interface Props {
  panel: Panel;
  isFocused: boolean;
  onFocus: () => void;
  onClose: () => void;
}

function PanelBody({ panel }: { panel: Panel }) {
  switch (panel.type) {
    case "claude":    return <ClaudePanel />;
    case "terminal":  return <TerminalPanel />;
    case "editor":    return <EditorPanel />;
    case "boreal":    return <BorealPanel />;
    case "saturno":   return <SaturnoPanel />;
    case "telemetry": return <TelemetryPanel />;
  }
}

export function PanelContainer({ panel, isFocused, onFocus, onClose }: Props) {
  return (
    <div
      className={`panel-container ${isFocused ? "focused" : ""} ${panel.isFullscreen ? "fullscreen" : ""}`}
      data-panel-id={panel.id}
      data-panel-type={panel.type}
    >
      <PanelHeader
        panel={panel}
        isFocused={isFocused}
        onFocus={onFocus}
        onClose={panel.type !== "claude" ? onClose : undefined}
      />
      <PanelBody panel={panel} />
    </div>
  );
}
