# Atolla 官网

Atolla 多智能体协作平台产品营销站（简体中文 / English 单页）。

包含：
- 像素水母头像与 CLI 引擎介绍
- 纯 CSS MacBook + 可交互 macOS 应用演示
- 可交互 iPhone 聊天 / 侧栏（共享 `IPhoneFrame`：固定 390×844 画布 + `ResizeObserver` 等比缩放）
- Mac ↔ iPhone 命令授权 Continuity（Island 通知 → 授权 sheet，不同时叠加）

## 本地开发

```bash
npm install
npm run dev
```

可用 `npm run dev -- --port 4317 --host 127.0.0.1` 指定端口。

## 构建

```bash
npm run build
npm run preview
```

产物在 `dist/`。请用 HTTP 静态服务打开；不要用 `file://` 直接打开。

## 技术栈

- React + Vite + TypeScript
- 自定义 CSS 设备外壳（MacBook / iPhone）
- React Bits 滚动动效
- 静态部署友好（`base: '/'`）
