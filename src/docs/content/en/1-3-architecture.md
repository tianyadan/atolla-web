## The big picture

Atolla is **local at the core, bridged by a relay, reachable from every device**. Click a node to see its role and switch scenarios to follow the packets.

<!-- demo:architecture -->

## Components

| Component | Stack | Responsibility |
| --- | --- | --- |
| Desktop app | Electron + React (Vite) | Starts the backend; chat, agents, skills, approvals, settings |
| Local backend | Go (Gin) | Engine adapters, gateway, queue, persistence, RemoteBridge |
| Platform data | SQLite (default) / MySQL 8 (optional) | Agents, chats, messages, approvals, queue, audits |
| Engines | Local CLIs | `claude`, `codex`, `agent`, working inside workspaces |
| Remote relay | Node.js + TypeScript + SQLite (Express) | Instance registry, command mailbox, cache mirrors, device sessions |
| Mobile | iOS app | Chats, tasks, approvals, Live Activity |
| macOS island | SwiftUI | Always-on capsule with four-state priority and task steps |

## Key paths

### Chat: streamed over SSE

Engine stdout (JSONL) is converted by adapters into unified events — text, tool, command, usage, plan — pushed over SSE and persisted. Closing the browser does not cancel the backend task; you can resume from saved messages.

### Mobile: outbound long-poll

The computer and relay talk over **HTTP long-polling, not WebSocket**. The computer pulls commands and pushes snapshots; **the server never connects to your computer**, so it needs no public IP and no inbound ports.

### Approvals: one record, many devices

When the gateway needs a human, it creates one pending approval. The desktop card, phone and Live Activity show the same record, and **it can be decided exactly once**.

## Principles

1. **Don't rebuild engines.** Use each CLI's native sessions, hooks and compaction; Atolla unifies and governs.
2. **The computer is the source of truth.** The relay is a cache and mailbox; offline instances are shown as offline, never silently swapped.
3. **Safe by default.** Unknown risk, failing review services or timeouts never auto-allow.
4. **Honest state.** Progress comes from real engine steps; commands seen after the fact are never presented as pre-execution blocks.
5. **Sync only what is needed.** Local files and full engine logs never leave your machine.
