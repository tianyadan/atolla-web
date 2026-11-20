## Supported engines

Agents ship no model; they drive engine CLIs **already signed in** on your computer. Atolla pins verified versions:

| Engine | Command | Description | Pinned version |
| --- | --- | --- | --- |
| Claude | `claude` | Anthropic Claude Code | `2.1.185` |
| Codex | `codex` | OpenAI Codex CLI | `0.153.4` |
| Cursor | `agent` | Cursor Agent CLI | `2026.10.22-27dcf5f` |

## Install commands

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code@2.1.185
# China mirror
npm install -g @anthropic-ai/claude-code@2.1.185 --registry=https://registry.npmmirror.com
```

### Codex CLI

```bash
npm install -g @openai/codex@0.153.4
# China mirror
npm install -g @openai/codex@0.153.4 --registry=https://registry.npmmirror.com
```

### Cursor Agent

Cursor has no npm package. Atolla's onboarding generates a **version-pinned** command that downloads the package for your OS and architecture from `downloads.cursor.com`, installs it to `~/.local/share/cursor-agent/versions/<version>`, and links `agent` and `cursor-agent` in `~/.local/bin`.

> [!TIP]
> If `agent` isn't found afterwards, add `~/.local/bin` to your `PATH` and reopen the terminal.

## Sign in

Run each command once in a terminal and **complete that engine's own sign-in**. Atolla never creates accounts or buys plans for you.

## Confirm in Atolla

Re-run the check in onboarding or Settings → Engines. Each engine shows install state, path and version, health and last check, plus **usage windows** when available.

## About usage

Usage is read from local credentials or CLI sources only — **Atolla never changes your accounts, plans or tokens**. It is informational, does not drive scheduling and never pauses or reassigns tasks. "Unavailable" means the vendor has no stable usage API, not that your quota is zero.
