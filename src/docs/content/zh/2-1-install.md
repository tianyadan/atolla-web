## 系统要求

| 项目 | 要求 |
| --- | --- |
| 操作系统 | macOS，**Apple 芯片（arm64）** |
| 安装包 | `Atolla-0.6.5-mac-arm64.dmg` |
| 工作引擎 | 至少一种：`claude`、`codex` 或 `agent`（见 [2.2 接入 AI 引擎](/docs/2-2-engines)） |
| Windows / Linux | 正在开发中 |

> [!WARNING]
> 当前安装包仅支持 Apple 芯片 Mac（M 系列），Intel 芯片的 Mac 无法安装。

## 下载

前往 GitHub Releases 下载最新版本：

```text
https://github.com/tianyadan/Atolla/releases/latest
```

也可以直接点击官网顶部的「下载」按钮。

## 安装步骤

1. 打开下载好的 `.dmg`，把 **Atolla** 拖入「应用程序」文件夹。
2. 首次打开时，由于当前版本**尚未签名与公证**，macOS 可能提示无法验证开发者。请在「应用程序」中**右键点击 Atolla → 打开**，并在弹窗中再次确认。
3. 如果仍被拦截，可以在终端清除隔离属性后再打开：

```bash
xattr -dr com.apple.quarantine /Applications/Atolla.app
```

## 首次启动

Atolla 启动时会依次完成以下检查：

1. 启动内置 Go 后端，读取配置并执行数据库迁移。
2. **检测工作引擎**：查找本机的 `claude`、`codex`、`agent` 命令。缺少引擎时，引导页会给出锁定版本的安装命令，并提供国内镜像命令。
3. **注册管理员**：首次使用需要创建管理员账号；之后启动会自动恢复登录态和最近使用的员工对话。
4. 进入对话工作台，从人才市场招聘你的第一位数字员工。

> [!TIP]
> 首次检测通过只代表命令可以找到，不代表订阅额度、网络或凭据永远有效。如果任务中断，可以在设置页的「工作引擎」卡片里查看用量窗口。

## 运行目录

桌面版的数据与日志保存在当前用户目录下：

| 内容 | 路径 |
| --- | --- |
| 数据库 | `~/Library/Application Support/Atolla/data/atolla.db` |
| 后端日志 | `~/Library/Application Support/Atolla/logs/backend.log` |
| 桌面配置 | `~/Library/Application Support/Atolla/config/` |

## 启动失败怎么办

- 查看 `backend.log` 中的错误信息。
- 确认启动环境中能找到至少一种受支持的引擎命令（例如在终端执行 `which claude`）。
- 确认 `Atolla.app/Contents/Resources/bin/atolla-server` 与 `Contents/Resources/web/index.html` 存在。
