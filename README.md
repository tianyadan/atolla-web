# Atolla 官网

Atolla 多智能体协作平台产品营销站（简体中文单页）。包含像素水母头像、CLI 引擎介绍，以及可交互的 iPhone 聊天协作演示（侧栏选人、发送消息、打字回复）。

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认端口见终端输出；可用 `npm run dev -- --port 4317 --host 127.0.0.1` 指定。

## 构建

```bash
npm run build
```

产物在 `dist/`。请用 HTTP 静态服务打开（例如 `npm run preview`，或部署到 Vercel / Nginx）。**不要**用浏览器直接打开 `file://.../index.html`，模块与资源路径在该协议下无法正常加载。

## 技术栈

- React + Vite + TypeScript
- Tailwind 风格自定义 CSS + React Bits 动效
- 静态部署友好（`base: '/'`）
