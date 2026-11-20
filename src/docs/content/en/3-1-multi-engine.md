## Overview

Juggling several AI subscriptions and switching between their tools is tedious and hard to manage. Atolla supports **Claude Code, Codex CLI and Cursor Agent**: each agent binds one engine, and every agent works in the same workspace — no platform switching, no checking each window for interruptions.

<!-- demo:engine-hub -->

## How it works

```text
Agent picks an engine
        ↓
agent.Run creates the engine adapter
        ↓
Claude: stream-json + hooks
Codex:  exec --json + resume
Cursor: agent JSON + resume
        ↓
Unified AskEvent → SSE → chat timeline
```

Adapters in `server/internal/agent` build the command, system prompt, workspace and resume arguments; the parser turns three JSONL dialects into unified events; the `service` layer stores messages, binds `engine_session_id` and streams to the UI.

## Unified events

| Event | Meaning |
| --- | --- |
| Text | Thinking and answers, streamed incrementally |
| Tool | File edits, browser and other tool calls |
| Command | Shell commands with approval and run state |
| Usage | Context usage and similar signals |
| Plan | Stages and steps when task planning is on |

## Engine differences

| Capability | Claude | Codex | Cursor |
| --- | --- | --- | --- |
| Output | stream-json | exec --json | agent JSON |
| Resume | Native session | resume | resume |
| Pre-execution block | Hooks | Only with an equivalent pre-event | Only with an equivalent pre-event |
| Images | Multimodal attachments | Via readable workspace paths | Via readable workspace paths |

> [!IMPORTANT]
> Events an engine doesn't support are never faked as pre-execution blocks. A command observed in JSONL afterwards was not intercepted beforehand.

## Sessions and switching

- Each agent resumes its native session through `engine_session_id`.
- **Changing an agent's engine does not convert its session** — session IDs aren't portable between engines.
- Codex and Cursor context usage is estimated from a default window, configurable via `AVATAR_CONTEXT_WINDOW_CODEX` / `AVATAR_CONTEXT_WINDOW_CURSOR` (default 200000).

## Best practices

- Organize by role, not engine — e.g. PM on Claude, frontend on Cursor, backend on Codex.
- Let agents on different engines collaborate through [`@` mentions and group chats](/docs/3-3-collaboration).
- Watch usage windows under Settings → Engines.
