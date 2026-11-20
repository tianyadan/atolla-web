## Requirements

| Item | Requirement |
| --- | --- |
| OS | macOS on **Apple silicon (arm64)** |
| Package | `Atolla-0.6.5-mac-arm64.dmg` |
| Engine | At least one of `claude`, `codex` or `agent` (see [2.2](/docs/2-2-engines)) |
| Windows / Linux | In development |

> [!WARNING]
> The current build supports Apple silicon Macs (M-series) only. Intel Macs cannot install it.

## Download

```text
https://github.com/tianyadan/Atolla/releases/latest
```

Or use the "Download" button at the top of the website.

## Install

1. Open the `.dmg` and drag **Atolla** into Applications.
2. The build is **not yet signed or notarized**, so macOS may refuse to open it. **Right-click Atolla → Open** and confirm.
3. If it's still blocked, clear the quarantine attribute:

```bash
xattr -dr com.apple.quarantine /Applications/Atolla.app
```

## First launch

1. The bundled Go backend starts, reads config and runs migrations.
2. **Engine check** — looks for `claude`, `codex` and `agent`. Missing engines get version-locked install commands (with China mirror variants).
3. **Create an admin** — the first run asks for an admin account; later runs restore your session and recent agent chat.
4. Open the workspace and hire your first agent from the Talent Market.

> [!TIP]
> Passing the check only means the command was found. If a task stops, check usage windows under Settings → Engines.

## Where files live

| Content | Path |
| --- | --- |
| Database | `~/Library/Application Support/Atolla/data/atolla.db` |
| Backend log | `~/Library/Application Support/Atolla/logs/backend.log` |
| Desktop config | `~/Library/Application Support/Atolla/config/` |

## If startup fails

- Read `backend.log`.
- Make sure a supported engine command is on the launch `PATH` (e.g. `which claude`).
- Confirm `Atolla.app/Contents/Resources/bin/atolla-server` and `Contents/Resources/web/index.html` exist.
