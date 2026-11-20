## Overview

The relay lets your phone or tablet see your computer's agents, chats and tasks, send new tasks and handle approvals. Three rules:

1. **Outbound only** — the computer connects to the relay; the server never connects back;
2. **Cache only** — the truth lives on your computer; the relay keeps per-instance mirrors and a mailbox;
3. **On your own server** — no third-party platform in between.

<!-- demo:relay -->

## Topology

```text
Phone / tablet ──HTTP(S)──▶  Remote relay (your server)  ◀──outbound long-poll + push──  Your computer
                                   │                                              │
                            SQLite mirrors                                  RemoteBridge
                            + mailbox                                       ActionRegistry
```

- One relay can serve **many computers**, each an instance;
- Stack: Node.js + TypeScript + Express + SQLite, default port `3080`;
- On the computer, **RemoteBridge** in the Go backend handles registration, heartbeats, long-polling and mirrors.

## The command mailbox

| State | Meaning |
| --- | --- |
| `pending` | Queued, waiting for the computer |
| `leased` | Picked up via long-poll, running (with a lease) |
| `done` | Finished, result returned |
| `error` / `rejected` | Failed, or not a registered action on the computer |
| `expired` | Lease timed out without a result |

> [!IMPORTANT]
> The relay can only queue **registered actions**, and the computer only runs actions it has a handler for. Unknown or version-mismatched commands are `rejected`.

## What syncs

| Synced | Not synced |
| --- | --- |
| Agent list and status | Your local file system |
| Task and run state | Full engine logs |
| Structured messages for mobile (incl. command cards) | Credentials and secrets |
| Viewing and unread state (both ways) | — |

Clients merge **idempotently by message ID**, then reconcile against the computer's snapshot.

## What the phone can do

- Restore the last instance, agent and chat;
- Send tasks, upload images, view the queue;
- Decide pending approvals — **the same record** as on the desktop;
- Change agent settings, notification preferences and JEV auto-review.

Engines and workspaces still run on the computer: **the relay never runs agents in the cloud.**

## Offline and flaky networks

- With the computer offline, the phone shows the last mirror marked "offline" — **never another computer**;
- Queued commands wait until the instance returns;
- Clients reconnect with backoff, catch up from a cursor, or fetch a fresh snapshot;
- Brief disconnects are not treated as task failures.

## Device sessions

Each device has **its own session** that you can review, revoke or unlock again. Revocation blocks further requests immediately; kicking a device **doesn't stop** tasks already running on the computer.

## LAN direct (Beta)

On the same LAN (incl. iPhone hotspot) the iPhone can bypass the cloud relay: the computer runs a separate listener bound to private addresses and advertises `_atolla._tcp` over Bonjour; pairing by QR creates a per-device key; every request carries device ID, timestamp, nonce and an HMAC signature; when LAN is unreachable it falls back to the cloud relay.

> [!WARNING]
> LAN direct uses HTTP. Signatures prevent tampering and replay, but **content is not encrypted** — use trusted networks only.
