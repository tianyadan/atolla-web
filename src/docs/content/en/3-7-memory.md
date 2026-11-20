## Two-layer session memory

| Layer | Where | Purpose |
| --- | --- | --- |
| Platform messages | Atolla database | Restore the timeline, tool state and audits |
| Engine session | The engine itself (linked by `engine_session_id`) | Continue the engine's native context |

> [!NOTE]
> Database history restores the UI but is not a copy of the engine's internal context, and session IDs can't move between engines.

## Context compaction

Near the context limit, compaction (manual or platform-triggered) calls the engine's **native compact** while keeping the session, resets usage estimates, trims redundant platform history and **re-injects** system rules, policy and mounted memory. It is lossy — keep key facts in tasks or files. A failed compact never pretends to succeed or wipes the session.

## Legacy memory

When dismissing an agent you can distill its experience into a **read-only memory book**:

```text
Dismiss → generate legacy memory (Markdown)
        ↓
generating → ready / failed
        ↓
Shelf: view, edit or retry
        ↓
Another agent claims it → read-only mount
        ↓
Future tasks get a compact memory summary
```

A memory can be claimed by **one agent**; claiming never restores the source's sessions, files, skills or permissions; only the information types you choose are extracted; failures must be retried explicitly.

## Workflow memory

Finished [workflow](/docs/3-3-collaboration) agent nodes write a summary of responsibilities, outputs and decisions; everyday chats recall a few relevant summaries instead of merging full workflow transcripts.

## Boundaries

Memory is isolated by **instance → agent → conversation**. Queries use entity IDs, never display names; agents don't share full histories by default; missing objects lead to clear guidance, never silent switching.
