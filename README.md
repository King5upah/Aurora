# Aurora

A workspace built for humans and AI to work together — not an AI-powered IDE, but a shared environment where both operate as co-users of the same space.

## Concept

Most IDEs treat AI as a feature bolted on top. Aurora inverts this: the Claude conversation is the primary interface, and everything else — terminals, editor, browser, knowledge base — spawns from it as needed.

The goal is a fast, keyboard-driven workspace where you never have to leave to get context, run code, preview a page, or check how close you are to blowing the context window.

## Panels

Panels are invoked on demand and dismissed when not needed:

- **Claude** — Claude Code session, always present
- **Terminal** — one or two PTY instances
- **Editor** — lightweight code editor with syntax highlighting (Tree-sitter)
- **Boreal** — embedded WebKit browser for previewing web work
- **Saturno** — interactive graph of the project knowledge base
- **Mission Telemetry** — real-time stats: token usage, context meter, degradation indicator, conversation management

## Navigation

- `Cmd + Arrow` — move between panels / temporary fullscreen
- `Opt + Number` — jump to specific subtab
- `Opt + Arrow` — move between subtabs sequentially

## Mission Telemetry

Observability for your Claude session:

- Context window meter (how full it is, not just when it collapses)
- Context degradation indicator (gradual, not binary)
- Compaction warning before auto-collapse happens
- Approximate token count per conversation
- Usage graphs over time
- Commands: `/compact`, `/clear`, new session

Tokens are counted locally using a tokenizer — Aurora tracks context independently without relying on Claude Code's output.

## Saturno

A Markdown knowledge base that lives in the workspace. Long-term memory for the project: features, architecture decisions, tools, incident post-mortems. Navigable as an interactive D3.js graph rendered inside Boreal.

Not a wiki for humans. A reference file for the agent — so sessions start with context loaded, not from scratch.

## Stack

- **Tauri** (Rust + WebKit) — native on macOS and Linux
- **Frontend** — React, MVVM
- **Terminal** — PTY via Rust backend
- **Browser** — WKWebView (macOS) / WebKitGTK (Linux), no Chromium dependency
- **Tokenizer** — local token counting, no API calls needed for telemetry

## Platforms

- macOS (primary)
- Linux (planned)

## Status

Early planning. Nothing runs yet.
