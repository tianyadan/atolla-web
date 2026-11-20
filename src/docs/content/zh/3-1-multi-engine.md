## 概览

如果你同时订阅了多家 AI 服务，来回切换不同的终端和工具既麻烦又难以管理。Atolla 目前支持 **Claude Code、Codex CLI、Cursor Agent** 三家主流引擎：每位数字员工绑定其中一种，所有员工在同一个工作台里协作——不用切换平台，也不用逐个窗口查看谁中断了。

<!-- demo:engine-hub -->

## 工作原理

```text
数字员工选择 engine
        ↓
agent.Run 创建引擎适配器
        ↓
Claude: stream-json + hooks
Codex:  exec --json + resume
Cursor: agent JSON + resume
        ↓
统一 AskEvent → SSE → 对话时间线
```

后端 `server/internal/agent` 中的适配器负责组装命令、系统提示、工作区与继续会话的参数；解析层把三种不同的 JSONL 格式转换为统一事件，`service` 层负责保存消息、绑定 `engine_session_id` 并向前端推流。

## 统一事件

无论员工背后是哪家引擎，界面看到的都是同一组事件：

| 事件 | 含义 |
| --- | --- |
| 文本 | 员工的思考与回答，增量流式输出 |
| 工具 | 读写文件、浏览器等工具调用 |
| 命令 | Shell 命令及其审批、执行状态 |
| 用量 | 上下文用量等观测信息 |
| 规划 | 开启任务规划后的阶段与步骤 |

## 三家引擎的差异

三种引擎的原生能力并不完全相同，Atolla 不会把它们「伪装」成一样：

| 能力 | Claude | Codex | Cursor |
| --- | --- | --- | --- |
| 输出格式 | stream-json | exec --json | agent JSON |
| 会话续接 | 原生 Session | resume | resume |
| 执行前拦截 | 通过 Hook 阻断 | 仅在提供等价前置事件时接入 | 仅在提供等价前置事件时接入 |
| 图片附件 | 直接接收多模态附件 | 优先通过工作区可读路径传递 | 优先通过工作区可读路径传递 |

> [!IMPORTANT]
> 引擎不支持的事件不会被伪装为执行前拦截。事后从 JSONL 中观察到的命令，不等于平台已经在执行前拦截了它。

## 会话与切换

- 每位员工的引擎原生 Session 通过 `engine_session_id` 续接，下次提问会延续它自己的上下文。
- **切换员工的引擎不会把原 Session 转换成另一种引擎的 Session**——不同引擎的 Session ID 不能互相复用。
- Codex、Cursor 的上下文用量按默认窗口估算，可通过环境变量 `AVATAR_CONTEXT_WINDOW_CODEX`、`AVATAR_CONTEXT_WINDOW_CURSOR` 调整（默认 200000）。

## 最佳实践

- 按岗位而不是按引擎组织员工：例如产品经理用 Claude、前端用 Cursor、后端用 Codex。
- 让不同引擎的员工通过 [`@` 委托与群聊](/docs/3-3-collaboration) 协作，而不是在终端之间复制粘贴。
- 在「设置 → 工作引擎」中关注用量窗口，提前发现额度不足。
