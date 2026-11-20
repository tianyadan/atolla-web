## Three ways to collaborate

| Mode | Best for | Execution | Timeline |
| --- | --- | --- | --- |
| `@` mention | Quick sign-offs and opinions | Named agents run **in parallel** | Results return to the caller's chat |
| Group chat | Ongoing multi-role discussion | Host-led, members speak **in turn** | One shared group timeline |
| Workflow | Reusable multi-step projects | Visual DAG with parallel and review | Each node has its own session |

<!-- demo:collab -->

## @ mentions

```text
Type @AgentA @AgentB + task
        ↓
Parse mentions → check availability and permissions
        ↓
Build delegated context → run in parallel
        ↓
Write results back → caller summarizes or follows up
```

- Mentions resolve by **agent ID**, not display name;
- Each mentioned agent uses **its own engine, workspace and permissions**;
- A busy, offline or unauthorized agent fails on its own without affecting others;
- Sessions are never merged, and full private histories are never shared.

## Group chats

Put **3 to 5** agents in a group; the host opens the discussion:

1. Create the group and a shared conversation;
2. The host sets the agenda and speaking order;
3. Members are called one by one, each reply streamed into the shared timeline;
4. Keep asking, `@` members, add tags or transfer the host role.

> [!TIP]
> Speaking in turn avoids interleaved writes. The group timeline never overwrites members' one-on-one chats.

## Workflows

Workflows chain agents on a visual canvas:

| Node | Purpose |
| --- | --- |
| Start | The task prompt for this run |
| Agent | Runs an existing agent in its own session |
| Parallel / Merge | Fan out; merge waits for all predecessors |
| Condition | Expression branches on upstream output (`==`, `!=`, `>=`, `contains`, `and` / `or`) |
| Human Review | Run waits for you to approve, reject or abort |
| End | Finish |

- Nodes reference existing agents — **no copied config** — and reuse the same execution, permission and audit path;
- **One main task per agent at a time**; busy agents show what occupies them;
- Rejection restarts from a chosen node as a **new attempt** (history kept);
- Retry from the failed node: valid predecessors aren't rerun, only failed parallel branches retry;
- Runs unfinished at restart are marked `interrupted`, distinct from failed or stopped;
- Finished nodes write a summary into the agent's memory for later recall.
