## Overview

Every action with side effects — writing files, network, commands, deletion — passes the **permission gateway**, which returns **ALLOW**, **DENY** or **REVIEW**. When you need to decide, your computer, phone and Live Activity all prompt you.

<!-- demo:approval -->

## Five stages

```text
Engine is about to call a tool
        ↓
Hook / tool event → normalized ToolAction
        ↓
① Hard Deny → ② Agent policy → ③ Safe read-only rules
        ↓
④ Exact session grant → ⑤ JEV auto-review
        ↓
ALLOW / DENY / REVIEW → audited and streamed over SSE
```

| Stage | Role |
| --- | --- |
| ① Hard Deny | Platform floor: shutdown, dangerous deletes and the like are **refused**; nothing can override it |
| ② Agent policy | Write, network, delete and workspace scope |
| ③ Safe read-only | Routine read-only actions pass |
| ④ Session grant | The **exact** normalized command signature already allowed in this session |
| ⑤ JEV | Local multi-dimensional risk scoring when auto-review is on |

Unknown risk or a failing review service **downgrades to REVIEW — never auto-allow**.

## Your three choices

| Choice | Effect |
| --- | --- |
| Deny | The engine receives a refusal |
| Allow once | Only this request proceeds |
| Allow for this session | Saves the **exact signature**; identical commands in this session pass |

> [!IMPORTANT]
> Session grants are **not wildcards**. Closing the page or timing out **never** allows. Actions already denied by Hard Deny or policy never reach a human approval.

## On your phone and islands

- Mobile command cards show the command, risk and status, linked to **the same approval record**;
- The iOS Live Activity surfaces "waiting for approval" with high priority and deep-links to it;
- macOS island rows open the matching spot in the console;
- **An approval can be submitted successfully only once.**

## JEV auto-review

JEV is a local risk-review service (default `127.0.0.1:8017`). Install and enable it in settings, then turn on auto-review for an agent. Pending actions are scored for destructiveness, data loss, services, permissions and credentials. If JEV is missing, off, slow or failing, it **falls back to human approval**. JEV never replaces Hard Deny, agent permissions or OS permissions.

## Stopping

You can **Stop** a task anytime. Atolla guarantees the interrupt signal, but side effects already produced by external commands **aren't rolled back**.

More on audits and allowlists: [4.2](/docs/4-2-permissions-audit).
