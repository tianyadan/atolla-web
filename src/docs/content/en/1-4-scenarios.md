## Who it is for

| Who | Need | What changes |
| --- | --- | --- |
| Indie developers | Several AI subscriptions, each with a job | One workspace for three engines, each agent with its own folder |
| Small team leads | Split work across "roles" in parallel | Talent Market roles, group chats, workflows |
| Ops / backend engineers | AI help with databases and servers, without accidents | Managed resources, gateway, approvals and audit |
| People often away from the desk | Long tasks needing approval | Phone approvals, Live Activity, Bark |
| Security-minded teams | Keep code off third-party platforms | Local execution, self-hosted relay, local SQLite |

## Typical scenarios

### A one-person dev squad

Hire a PM, a frontend engineer and a Go backend engineer from the Talent Market, bound to Claude, Cursor and Codex with their own workspaces. Hand the PM a requirement, then `@` the two engineers for parallel reviews.

### A pre-release group chat

Put PM, frontend, backend and ops in a group chat. The host runs the meeting; members report build, tests, health checks and rollback in turn, then the host concludes.

### Approving on the commute

An agent needs to install a dependency while you're away. Your phone's Live Activity lights up; expand it, tap "Once", and the task continues on your computer.

### Issue-driven dispatch

With GitHub Idea dispatch, new issues are routed by role, capability tags and load into an agent's queue, with results written back. See [3.10](/docs/3-10-github-idea).

## When it's not a fit

- You only want a web chatbot and won't install any engine CLI.
- You need multi-tenant, fine-grained RBAC — the relay uses a single site gate today.
- You need a Windows or Linux desktop app — in development, see [5.2](/docs/5-2-roadmap).
