## Who this is for

Developers **with the Atolla source**. Everyone else should use the [macOS app](/docs/2-1-install).

## Requirements

| Dependency | Version |
| --- | --- |
| Go | 1.22+ (1.26+ to package the Electron app) |
| Node.js | 20+ |
| Engines | At least one of `claude`, `codex`, `agent` |
| Docker | Only for MySQL |

## Start

```bash
cp .env.example .env
./scripts/start.sh
```

Open `http://localhost:5173`; the first visit checks engines and creates an admin.

| Command | Purpose |
| --- | --- |
| `./scripts/start.sh` | Foreground |
| `./scripts/start-bg.sh` or `./scripts/start.sh --daemon` | Background |
| `./scripts/start.sh --mysql` | Use MySQL (starts docker compose) |
| `./scripts/shutdown.sh` | Stop |
| `./scripts/restart.sh` | Restart (`--daemon` optional) |

Logs: `logs/backend.log`, `logs/frontend.log`.

## Endpoints

| Service | Address |
| --- | --- |
| Web | `http://localhost:5173` |
| API | `http://localhost:8080` |
| SQLite (default) | `./data/atolla.db` |
| MySQL (optional) | `127.0.0.1:3307` |

## Configuration

Secrets go in `.env` at the repo root — **never commit it**.

| Variable | Purpose | Default |
| --- | --- | --- |
| `AVATAR_ADDR` | API listen address | `:8080` |
| `AVATAR_DB_DRIVER` | `sqlite` / `mysql` | `sqlite` |
| `AVATAR_DB_DSN` | File path or MySQL DSN | `./data/atolla.db` |
| `AVATAR_ALLOWED_IPS` | Allowed client IPs | `127.0.0.1` |
| `AVATAR_ADMIN_USER` / `AVATAR_ADMIN_PASS` | Admin account | Change these |
| `AVATAR_JEVOS_URL` | Local JEV service | `http://127.0.0.1:8017` |
| `BARK_KEY` | iPhone Bark push (optional) | — |

## Database mode

SQLite needs no Docker. To move to MySQL, use settings: verify → migrate schema and data → write `.env` → restart → `/health`.

> [!WARNING]
> Switching databases is an ops task — check permissions, disk and backups first. Workspace files are not moved.

## Package the desktop app

```bash
cd desktop
npm run package
```

Output goes to `dist/electron/`: React assets, the Go backend built with `GOOS=darwin GOARCH=arm64`, verification, then an arm64 DMG. A GitHub Actions workflow builds the same DMG manually or on version tags.

## Local relay for development

```bash
scripts/start-remote-relay.sh
# relay API :3080 + mobile Vite :15174
```
