## 支持的引擎

数字员工不内置模型，而是调用你电脑上**已登录**的引擎 CLI。Atolla 为每种引擎锁定了经过验证的版本：

| 引擎 | 命令名 | 说明 | 锁定版本 |
| --- | --- | --- | --- |
| Claude | `claude` | Anthropic Claude Code | `2.1.185` |
| Codex | `codex` | OpenAI Codex CLI | `0.153.4` |
| Cursor | `agent` | Cursor Agent CLI | `2026.10.22-27dcf5f` |

> [!NOTE]
> 锁定版本是当前已验证能与 Atolla 跑通的版本。首次启动的引导页会直接给出对应的安装命令，可一键复制。

## 安装命令

### Claude Code

```bash
npm install -g @anthropic-ai/claude-code@2.1.185
# 国内镜像
npm install -g @anthropic-ai/claude-code@2.1.185 --registry=https://registry.npmmirror.com
```

### Codex CLI

```bash
npm install -g @openai/codex@0.153.4
# 国内镜像
npm install -g @openai/codex@0.153.4 --registry=https://registry.npmmirror.com
```

### Cursor Agent

Cursor 官方不提供 npm 包。Atolla 的引导页会生成一条**按锁定版本下载**的安装命令：它从 `downloads.cursor.com` 下载对应系统与架构的包，安装到 `~/.local/share/cursor-agent/versions/<版本>`，并在 `~/.local/bin` 下创建 `agent` 与 `cursor-agent` 链接。

> [!TIP]
> 安装 Cursor Agent 后如果提示找不到 `agent`，请把 `~/.local/bin` 加入 `PATH` 并重新打开终端。勾选国内镜像不会改变这条命令。

## 登录引擎

安装完成后，请先在终端里分别运行一次对应的命令并**完成该引擎自身的登录**。Atolla 不会替你创建账号或购买订阅。

## 在 Atolla 中确认

回到 Atolla 的引擎检测页（或「设置 → 工作引擎」），点击重新检测。每种引擎会显示：

- 是否已安装、可执行文件路径与实际版本；
- 健康状态与最近检测时间；
- 可获取时的**用量窗口**（主窗口 / 次窗口 / 重置时间）。

## 关于引擎用量

用量信息只读取本机已登录的凭据或 CLI 用量源，**不会修改引擎账号、订阅或 Token**。它是观测信息，帮助你判断任务中断是平台问题还是额度不足，**不参与任务调度**，也不会自动暂停或改派任务。供应商没有稳定用量接口时，界面会显示「不可用」或上次结果，这并不代表剩余额度为零。
