## Chats and sessions

Each agent has its own chats, possibly several threads. Desktop and mobile reopen **the most recent agent and chat for that instance**. Sessions are always checked together with instance and agent, never reused across instances.

## Streaming over SSE

```text
You submit a task
        ↓
An independent run context starts (detached from the HTTP request)
        ↓
Engine stdout JSONL → unified events
        ↓
SSE broadcasts text / tool / command / usage / plan
        ↓
UI merges by message and event ID → final answer saved + completion notice
```

- Thinking, tools, commands and the answer arrive **progressively**;
- **A dropped SSE connection doesn't cancel the task** — reopen and resume;
- Streamed text and the final result are de-duplicated, not appended twice.

## Task planning

Turn on "task plan" when sending, and long tasks show a structured card:

| Stage | Meaning |
| --- | --- |
| planning | Building the plan |
| running (step / total) | Executing a step |
| done | Finished |
| failed / interrupted | Failed or stopped |

Progress reflects **real steps reported by the engine**, not time or tokens; the same plan state feeds the Live Activity.

## Task queue

**An agent runs one main task at a time.** Sending while it's busy lets you choose:

| Option | Behavior |
| --- | --- |
| Interrupt first | The new task jumps the queue and the current one stops |
| Add to queue | Saved as `queued`, picked up when the current task ends |

```text
queued → running → done / failed
Manual Stop → hold → resume with "Continue queue"
```

Normal completion pulls the next item; **a manual Stop pauses the queue**. Only items not yet started can be edited or cancelled, and each item still gets its own approvals.

## Images and attachments

- Paste, drop or pick images and preview them before sending — **up to 6 per message**;
- Images are compressed and stored locally, optionally synced to OSS;
- Claude receives multimodal attachments directly; Codex / Cursor get readable workspace paths;
- Local image paths in Codex / Cursor answers render only from your home or workspace allowlist, never from `.ssh`, `.aws` or Keychains.

## The timeline

Tool calls, approvals, results, attachments and final states share one traceable timeline. Finished commands fold by default, pending ones stay open, **retries are new rounds** that keep earlier errors, and durations use server time.
