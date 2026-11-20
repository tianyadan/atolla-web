## Why a relay

Your computer usually has no public IP. The relay is a small server **you deploy yourself**: the computer connects out to it, your phone connects to it, and they talk through it. The server never connects into your computer. Background: [3.4](/docs/3-4-relay).

## Prerequisites

| Item | Notes |
| --- | --- |
| A Linux server | Reachable over SSH; Node.js 20 and build tools are installed if missing |
| An open port | Default `3080`; allow it in your firewall / security group |
| Site gate password | Set at deploy time; used to sign in to the relay |
| Domain & TLS (optional) | HTTPS is not enforced; on the public internet, add a reverse proxy with TLS |

## Step 1 — Deploy the relay

Open the deploy wizard on Atolla's **Remote relay** page and fill in:

1. Server address, SSH port and user;
2. Remote directory (default `/opt/atolla-remote-relay`) and listen port (default `3080`);
3. Initial site gate password;
4. Download source: official or **China Mirror**.

The wizard checks SSH and ports → uploads the relay → installs and builds → installs a systemd service → checks `/api/health` → saves the relay address, showing stage logs throughout with retry on timeout.

> [!NOTE]
> The gate password is stored as a bcrypt hash and cleared from the process environment after first boot.

Developers with the source can run the same script directly:

```bash
remote-relay/deploy/install.sh \
  --host 203.0.113.10 --user root \
  --port 3080 --site-password 'your-gate-password' \
  --china-mirror
```

```bash
curl http://your-server:3080/api/health
```

## Step 2 — Register the computer

- A random `instance_id` is created once and kept across restarts;
- The computer **generates a six-character code** (digits + letters) locally and registers it — the server only receives and verifies it;
- Heartbeats keep the instance online.

## Step 3 — Pair your phone

1. Open the relay site or the Atolla iOS app and sign in with the gate password;
2. Add an instance using its address and the six-character code shown on the computer;
3. The relay issues an **independent device session**, and your agents appear.

> [!WARNING]
> The six-character code is a short-lived pairing credential. Don't store or share it as a long-term token. Rotating it invalidates the old one immediately.

## LAN direct (Beta)

On the same Wi-Fi or iPhone hotspot, the iPhone can connect directly: enable LAN direct on the Remote relay page and scan the pairing QR code. Policies: Auto (LAN first, fall back to cloud), LAN only, Cloud only. LAN mode is HTTP with signed requests — **content is not encrypted; use trusted networks only.**

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Health check fails | Firewall / security group, service running |
| Phone shows offline | Computer on, Atolla running, relay reachable from the computer |
| Code rejected | Rotated or expired code; too many failures are rate-limited |
| SSH works but site doesn't | Domain, certificate, firewall and public port are separate concerns |
