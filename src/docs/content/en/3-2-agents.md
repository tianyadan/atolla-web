## Overview

An agent = **a local AI engine** + name, role, pixel-jellyfish avatar, workspace, permission policy and skills. Start from a Talent Market template or define everything yourself. Try it live:

<!-- demo:agent-studio -->

## Hiring

```text
Open the Talent Market
        ↓
Pick a template or go custom
        ↓
Choose engine + jellyfish color + workspace
        ↓
Write persona, permission policy and starter skills
        ↓
Create agent + main chat → appears in your list
```

The Talent Market ships six official templates:

| Role | Preset agent |
| --- | --- |
| Product Manager | Lin Xiaoqing |
| Frontend Engineer | Shen Qinghe |
| Java Backend | Chen Siyu |
| Go Backend | Lu Jingxing |
| Full-stack Engineer | Su Wanzhou |
| Ops Engineer | Han Yuche |

> [!NOTE]
> Templates are a starting point; they don't grant external tools or accounts. The engine must be installed and signed in. New agents can stay ungrouped.

## The pixel jellyfish

Every agent has a pixel jellyfish whose **color is saved at creation** (12 colors). Its motion and status light reflect what it's doing:

| State | Look |
| --- | --- |
| Running | Soft orange glow |
| Idle, nothing unread | Soft green glow |
| Finished, unread | Blue glow |
| Error, unread | Error state |

Priority across the UI: **error > waiting for approval > running > finished unread > idle**.

## Workspace and permission policy

The workspace is the engine's working directory. Each agent also has **independent** switches:

| Switch | Effect |
| --- | --- |
| Write | May modify files |
| Network | May make network requests (with an optional domain allowlist) |
| Delete | May delete — **write does not imply delete** |
| Stay in workspace | Paths are normalized (`..`, symlinks) and checked against the workspace |

> [!WARNING]
> Turning off workspace restriction only widens reachable paths; **Hard Deny, write and delete still apply independently.**

## Skill store

1. Browse skills with their description, source, dependencies and required permissions;
2. Install for a specific agent;
3. At run time only **that agent's enabled skills** are summarized into the prompt;
4. Desktop and mobile settings install, toggle and remove through the same API.

Installing a skill doesn't install its external programs or credentials; skills can't exceed Hard Deny, permissions or workspace bounds; uninstalling never deletes files a skill created.

## Groups

Groups express departments and power filtering. The sidebar sorts by **recent activity**, with name search and group filters. Groups never grant skills or file access.

## Copy and dismiss

- **Copy** creates a new agent from the source's persona, engine, workspace and policy — without its sessions, history or unread state.
- **Dismiss** stops running work, optionally distills [legacy memory](/docs/3-7-memory), removes the agent and its data, and syncs the removal to mobile. It requires explicit confirmation.
