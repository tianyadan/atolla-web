## Platform support

| Platform | Status | Notes |
| --- | --- | --- |
| macOS (Apple silicon) | ✅ v0.6.5 released | Electron app with bundled Go backend |
| macOS (Intel) | — | Not supported by the current package |
| Windows | 🚧 In development | — |
| Linux desktop | 🚧 In development | The relay itself runs on Linux servers |
| iOS | ✅ Available | Chats, approvals, Live Activity, Siri |
| Remote relay | ✅ Available | Node.js + SQLite, self-hosted, systemd |
| LAN direct | 🧪 Beta | iPhone ↔ Mac on the same network, cloud fallback |

## New in v0.6.5

- **GitHub Idea dispatch** — route issues by role, capability tags and load, with idempotent enqueue, history and re-dispatch.
- **iOS & Siri** — ask about agents, check progress, send tasks and ask the front desk; improved deep links, task plans and Live Activity sync.
- **Remote improvements** — site sign-in now lasts 30 days, plus mobile credentials, usage widgets and recovery paths.

## Known limitations

| Limitation | Detail |
| --- | --- |
| Unsigned build | Right-click open or clear quarantine on first launch |
| Live Activity freshness | No APNs Live Activity push yet |
| LAN direct unencrypted | HTTP + signatures; trusted networks only |
| Single site gate | No multi-user accounts or fine-grained RBAC yet |
| Engine differences | Pre-execution hooks, images and usage vary by engine |

## Direction

From the product design docs — **not committed release dates**:

- **Windows and Linux desktop** — in development.
- **Encrypted LAN direct** — self-signed TLS with app certificate pinning, no purchased certificate needed.
- **Relay** — optional TLS, multiple users, per-agent access control; outbound WebSocket instead of long-polling.
- **Workflows** — AI-judged conditions and resumable runs are reserved in the data model.

> [!TIP]
> Follow releases at `https://github.com/tianyadan/Atolla/releases`.
