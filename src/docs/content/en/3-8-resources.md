## Overview

Beyond the workspace, agents can use **browsers, databases and servers** within scope. Every call goes through the gateway and audit like any other tool.

| Resource | What agents can do | Prerequisite |
| --- | --- | --- |
| Browser | Read pages, click, fill forms, screenshot | Browser skill enabled and environment check passed |
| Database | Query registered data sources | Admin registers, verifies and binds the source |
| Server | Inspect services or run ops commands over SSH | Admin registers, verifies and binds the host |

## Browser actions

```text
Enable browser skill → check browser and control channel
        ↓
Ask for a page task → read page state
        ↓
Click / type / screenshot / wait → results into chat and tool timeline
```

Page text and screenshots stay in the current chat; without the skill an agent can't spin up its own automation; logins, payments, publishing and deletes still follow approvals.

## Databases and servers

```text
Admin registers data source or SSH host → verify connection
        ↓
Bind to agent → pick target during a task
        ↓
Read-only query / controlled command → gateway
        ↓
Result and audit written back
```

Connection details are managed centrally with **sensitive fields encrypted**; agents only see names, types and capabilities; chats and logs never echo full passwords, keys or tokens; a successful connection test does **not** permit writes, restarts or deploys.

> [!TIP]
> Register production and test resources separately with separate grants.

## Files and workspace

Before any file tool runs, absolute and real paths are resolved and checked against the workspace — including `..`, case differences and symlink targets.

> [!WARNING]
> Atolla doesn't back up files agents change. Keep using version control.
