## In one sentence

**Atolla is a "digital employee" platform that runs on your own computer.** It wraps the Claude Code, Codex CLI or Cursor Agent you are already signed in to into agents with a name, a role, a workspace, permissions and skills. They work inside folders you allow — and anything risky, like writing files, going online or deleting, asks you first.

> [!NOTE]
> These docs are written for Atolla **v0.6.5**. Every capability described here comes from the product source and its built-in manual.

## What Atolla is not

| Common assumption | Reality |
| --- | --- |
| Atolla ships its own model | **It does not.** Agents drive the Claude Code, Codex CLI or Cursor Agent already signed in on your machine. |
| Atolla buys or manages my subscriptions | No. Accounts, plans and quotas stay yours; Atolla only reads usage for display. |
| Agents run in the cloud | No. Engines and workspaces always run on your computer; the relay only forwards and caches. |
| The mobile app is a separate system | No. Your phone works with **the same agents and chats on the same computer** through the relay. |

## Core concepts

| Concept | Meaning |
| --- | --- |
| **Agent** (digital employee) | A wrapped local AI engine with a name, role, pixel-jellyfish avatar, workspace, permission policy and skills. |
| **Engine** | The CLI behind an agent: `claude` (Claude Code), `codex` (Codex CLI) or `agent` (Cursor Agent). |
| **Workspace** | The agent's default folder. You can restrict the agent to read and write only inside it. |
| **Conversation** | Each agent has its own chats, streamed live over SSE. |
| **Permission gateway** | The single checkpoint for every tool action: allow, deny or ask you. |
| **Instance** | One computer running Atolla. Phones pair with it using its address and a six-character code. |
| **Remote relay** | A small service you deploy on your own server so your phone can follow your computer anywhere. |

## Product pieces

- **Desktop app** — Electron app that starts the bundled Go backend and reuses the React workspace. Available for macOS on Apple silicon.
- **Local backend** — Go (Gin) service for agents, engine adapters, the permission gateway, task queue and storage (SQLite by default).
- **Remote relay** — Node.js + TypeScript + SQLite service you host yourself.
- **Mobile** — iOS app to view agents, continue chats, handle approvals, with an iOS Live Activity.
- **macOS island** — a standalone SwiftUI capsule that shows agent status at the top of your desktop.

See [1.3 Architecture & principles](/docs/1-3-architecture) for how they fit together.
