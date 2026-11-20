## Overview

**GitHub Idea dispatch** (new in v0.6.5) listens to GitHub issues and routes new ideas to the best-fit agent's task queue.

## Flow

```text
GitHub issue event (webhook)
        ↓
Verify webhook, record source revision
        ↓
Recommend an agent by role, capability tags and load
        ↓
Atomically enqueue to that agent (idempotent)
        ↓
Agent runs from its queue
        ↓
Result written back asynchronously after completion
```

## Highlights

| Feature | Detail |
| --- | --- |
| Smart routing | Considers **role, capability tags and load** |
| Idempotent enqueue | Concurrent duplicates enqueue once |
| Reuses the queue | One main task per agent, same gateway |
| Write-back | Asynchronous, never blocks the next dispatch |
| History & audit | Dispatch history is kept |
| Re-dispatch | Failed tasks can be dispatched again |

> [!TIP]
> Dispatch only assigns work — each run still goes through the permission gateway and asks you when needed.
