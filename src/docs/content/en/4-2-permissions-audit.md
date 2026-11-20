## Layers

| Layer | Decided by | Overridable? |
| --- | --- | --- |
| Hard Deny | Platform floor | **No** — not by grants, auto-review or humans |
| Agent policy | Write / network / delete / workspace switches | Only by changing the agent |
| Safe read-only | Static rules | — |
| Session grant | Your "allow for this session" | Exact normalized signature only |
| JEV auto-review | Local risk scoring | Falls back to humans on failure |
| Human approval | You | Deny, once, this session |

> [!IMPORTANT]
> Auto-review **never widens** an agent's permissions or bypasses Hard Deny. ALLOW covers only the current normalized action.

## Command audits

Every decision is written to `command_audits`:

| Field | Content |
| --- | --- |
| Action | Tool, command summary, action type |
| Context | Instance, agent, chat, engine, environment, time |
| Verdict | ALLOW / DENY / REVIEW and reason |
| Decided by | Hard Deny, policy, session grant, JEV or user |
| Risk | Risk score from JEV and others |

The audit page paginates and filters. Audits **exclude full credentials** and sensitive values are masked.

## Network allowlist

```text
Request → normalize domain → match allowlist → sync to engine sandbox rules
```

The allowlist is generated into network constraints at engine start or on change, keeping platform policy, sandbox and UI consistent.

> [!NOTE]
> An allowlist defines what's permitted, not what's safe; DNS, proxies and engine sandboxes can still affect results.

## Recommended practice

1. Keep "stay in workspace" on and grant only needed folders;
2. Enable write, network and delete per role, minimally;
3. Register production resources separately;
4. Use TLS for a public relay and protect the gate password and `RELAY_JWT_SECRET`;
5. Review high-risk commands and deciders in the audit page regularly.
