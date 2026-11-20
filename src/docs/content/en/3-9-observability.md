## Overview

| Channel | Platform | Use |
| --- | --- | --- |
| Bark | iPhone (Bark app) | Push on finish, approval needed, error |
| iOS Live Activity | iPhone | Top-priority status on Lock Screen and Dynamic Island |
| macOS island | Mac | Always-on capsule with agents and steps |
| Audit & health | Console | Durations, tool calls and host resources |

## Four-state priority

All surfaces share: **error > approval > running > done**. After a task ends, each agent keeps **its latest unread final-state snapshot** (kind, time, duration, summary), cleared when you open the chat. Marking read never deletes messages, results or audits.

## Bark

1. Enter your Bark address; Atolla sends a **six-digit code** to verify;
2. Enable finish / approval / error notifications;
3. Titles name Atolla and the event; bodies carry the agent and a short summary with a deep link.

Duplicate alerts are suppressed while you're viewing that agent; queues notify once at the end; full command JSON, credentials and sensitive logs are never sent.

## iOS Live Activity

Compact view shows a status symbol; expanded shows up to three lines. Running states can carry plan steps; final states show agent, department, duration and finish time. Taps restore the instance and deep-link to the chat or approval, still checked against the device session.

> [!NOTE]
> APNs Live Activity push isn't wired up yet: updates are best-effort in the foreground and short background periods, not guaranteed once iOS suspends the app.

## macOS island

A standalone SwiftUI process that polls local events once the console syncs its token and API address, animates between compact and expanded, and opens the matching console spot when you click an agent or approval. It isn't a system Live Activity and must stay running.

## Audit & health

Task timing, engine events, tool calls, permission decisions and host metrics (CPU, memory, disk, version via heartbeats) help separate agent logic issues from engine, resource or relay problems. The background guard and `/health` endpoint confirm Atolla keeps running.
