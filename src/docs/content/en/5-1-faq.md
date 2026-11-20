## Install and platforms

### Does it run on Intel Macs?

No. The current package `Atolla-0.6.5-mac-arm64.dmg` supports **Apple silicon only**.

### "Developer cannot be verified"?

The build isn't signed or notarized yet. Right-click Atolla → Open, or run:

```bash
xattr -dr com.apple.quarantine /Applications/Atolla.app
```

### Windows and Linux?

In development — see [5.2](/docs/5-2-roadmap).

## Engines and cost

### Does Atolla charge for models?

No model is bundled or resold. Agents use the engines signed in on your machine; costs and quotas belong to your own accounts.

### The engine check passed but tasks stop?

The check only finds the command. Look at usage windows under Settings → Engines for quota, network or credential issues.

### Can I move an agent from Claude to Codex?

Yes, but the old session isn't converted; the new engine starts its own session.

## Relay and mobile

### Do I need the relay?

Only for phone access. Desktop-only use doesn't need it.

### Can the relay see my code?

It stores only mobile mirrors (agent summaries, task state, structured messages) — **never your file system or full engine logs** — and it runs on your own server.

### Can I send tasks while my computer is off?

They wait in the mailbox until the computer is back; the phone shows the instance as offline.

### Is HTTPS required?

Not enforced, but strongly recommended on the public internet. See [4.1](/docs/4-1-data-security).

## Approvals and safety

### Do approvals auto-pass if I'm away?

**Never.** Closing the page or timing out never allows.

### Does "allow for this session" allow similar commands?

No — only the **exact** normalized command signature.

### Is turning off workspace restriction dangerous?

It only widens paths; Hard Deny, write, network and delete still apply. Turn it off only when needed.

### Does Stop roll back changes?

No. Stop sends an interrupt; external side effects remain. Use version control.

## Data

### Where is my data?

`~/Library/Application Support/Atolla/data/atolla.db`, with logs alongside in `logs/`.

### Can I use MySQL?

Yes — verify the connection in settings, then migrate and switch.
