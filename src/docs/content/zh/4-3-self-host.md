## 适用对象

本节面向**持有 Atolla 源码的开发者**。普通用户直接使用 [macOS 安装包](/docs/2-1-install) 即可。

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| Go | 1.22+（打包 Electron 桌面版需 1.26+） |
| Node.js | 20+ |
| 工作引擎 | `claude`、`codex`、`agent` 至少一个 |
| Docker | 仅在使用 MySQL 时需要 |

## 启动

```bash
cp .env.example .env
./scripts/start.sh
```

浏览器打开 `http://localhost:5173`。首次进入会检查引擎，并引导你注册管理员。

| 命令 | 作用 |
| --- | --- |
| `./scripts/start.sh` | 前台启动（占用终端） |
| `./scripts/start-bg.sh` 或 `./scripts/start.sh --daemon` | 后台启动，关窗口仍保持运行 |
| `./scripts/start.sh --mysql` | 改用 MySQL（会启动 docker compose） |
| `./scripts/shutdown.sh` | 停止 |
| `./scripts/restart.sh` | 重启（可加 `--daemon`） |

日志位于 `logs/backend.log` 与 `logs/frontend.log`。

## 服务地址

| 服务 | 地址 |
| --- | --- |
| 页面 | `http://localhost:5173` |
| API | `http://localhost:8080` |
| SQLite（默认） | `./data/atolla.db` |
| MySQL（可选） | `127.0.0.1:3307` |

## 常用配置

密钥放在仓库根目录的 `.env`，**不要提交**。

| 变量 | 作用 | 默认 |
| --- | --- | --- |
| `AVATAR_ADDR` | API 监听地址 | `:8080` |
| `AVATAR_DB_DRIVER` | 平台库驱动 `sqlite` / `mysql` | `sqlite` |
| `AVATAR_DB_DSN` | sqlite 为文件路径；mysql 为连接串 | `./data/atolla.db` |
| `AVATAR_ALLOWED_IPS` | 允许访问的客户端 IP | `127.0.0.1` |
| `AVATAR_ADMIN_USER` / `AVATAR_ADMIN_PASS` | 管理员账号 | 请务必修改 |
| `AVATAR_JEVOS_URL` | 本机 JEV 审核服务地址 | `http://127.0.0.1:8017` |
| `BARK_KEY` | iPhone Bark 推送，可留空 | — |

## 数据库模式

默认 SQLite 无需 Docker。需要外部 MySQL 时，可以在设置页完成切换：

```text
选择 SQLite 或 MySQL → 验证连接
        ↓
迁移表结构与业务数据 → 写入 .env
        ↓
异步重启 → /health 检查 → 新驱动接管读写
```

> [!WARNING]
> 切换数据库是运维操作，执行前请确认目标库权限、磁盘与备份可用。切换只影响 Atolla 平台数据，不会搬运员工工作区里的文件。

## 打包桌面版

```bash
cd desktop
npm run package
```

产物输出到 `dist/electron/`：构建 React 资源、以 `GOOS=darwin GOARCH=arm64` 编译 Go 后端，校验后生成 arm64 DMG。仓库也提供 GitHub Actions 工作流，可手动或通过推送版本标签构建同样的 DMG。

## 本地开发中继

```bash
scripts/start-remote-relay.sh
# 中继 API :3080 + 手机端 Vite :15174
```
