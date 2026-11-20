import type { Locale } from '../i18n/types'

export type DocItem = {
  slug: string
  num: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
}

export type DocGroup = {
  num: string
  title: Record<Locale, string>
  items: DocItem[]
}

const item = (slug: string, zh: [string, string], en: [string, string]): DocItem => ({
  slug,
  num: slug.split('-').slice(0, 2).join('.'),
  title: { zh: zh[0], en: en[0] },
  summary: { zh: zh[1], en: en[1] },
})

export const DOC_GROUPS: DocGroup[] = [
  {
    num: '1',
    title: { zh: '产品概览', en: 'Overview' },
    items: [
      item('1-1-definition', ['产品定义', 'Atolla 是什么：一个在你自己电脑上运行的数字员工平台。'], ['Product definition', 'What Atolla is: a digital-employee platform that runs on your own computer.']),
      item('1-2-value', ['产品价值', '为什么需要 Atolla：统一引擎、安全执行、随时随地掌控。'], ['Why Atolla', 'One entry for every engine, safe execution and control from anywhere.']),
      item('1-3-architecture', ['核心架构与设计理念', '桌面端、Go 后端、本机引擎、自托管中继与移动端如何协同。'], ['Architecture & principles', 'How the desktop app, Go backend, local engines, relay and mobile fit together.']),
      item('1-4-scenarios', ['适用人群与典型场景', '谁适合用 Atolla，以及几种典型的一天。'], ['Who it is for', 'Who benefits from Atolla and what a typical day looks like.']),
    ],
  },
  {
    num: '2',
    title: { zh: '快速开始', en: 'Getting started' },
    items: [
      item('2-1-install', ['下载与安装', 'macOS Apple 芯片版 v0.6.5 的安装、首次启动与运行目录。'], ['Download & install', 'Install the v0.6.5 macOS (Apple silicon) build and complete first launch.']),
      item('2-2-engines', ['接入 AI 引擎', '安装并登录 Claude Code、Codex CLI 或 Cursor Agent。'], ['Connect an engine', 'Install and sign in to Claude Code, Codex CLI or Cursor Agent.']),
      item('2-3-relay-pairing', ['配置远程中继与移动端配对', '把中继部署到自己的服务器，并让手机绑定这台电脑。'], ['Relay & mobile pairing', 'Deploy the relay to your own server and pair your phone with this computer.']),
    ],
  },
  {
    num: '3',
    title: { zh: '核心功能详解', en: 'Features' },
    items: [
      item('3-1-multi-engine', ['多引擎统一编排', '三家引擎，一个入口：输出归一、会话独立、无需来回切换。'], ['Unified multi-engine', 'Three engines, one entry: normalized output, isolated sessions, no switching.']),
      item('3-2-agents', ['数字员工、像素水母与技能商店', '招聘、定制、权限与技能：打造属于你的智能体。'], ['Agents, jellyfish & skills', 'Hire, customize, scope and skill up your own agents.']),
      item('3-3-collaboration', ['多员工协作：@ 委托、群聊与流程编排', '从一次性会签到多角色讨论，再到可视化 DAG 流程。'], ['Multi-agent collaboration', 'From quick @ mentions to group chats and visual DAG workflows.']),
      item('3-4-relay', ['跨端同步与自托管中继', '电脑只出站、中继只缓存、手机随时查看与继续。'], ['Cross-device sync & relay', 'Outbound-only computer, cache-only relay, phone always in the loop.']),
      item('3-5-approval', ['远程审批与安全护栏', '权限网关五道关卡，危险操作先问你再执行。'], ['Remote approval & guardrails', 'A five-stage permission gateway: risky actions ask you first.']),
      item('3-6-conversation', ['对话、任务规划与队列', 'SSE 流式执行、结构化任务规划、打断优先与持久化队列。'], ['Conversations, plans & queue', 'Streaming runs, structured task plans and a persistent queue.']),
      item('3-7-memory', ['记忆与上下文', '双层会话记忆、原生压缩与离职记忆继承。'], ['Memory & context', 'Two-layer session memory, native compaction and legacy memory.']),
      item('3-8-resources', ['浏览器、数据库与服务器资源', '让员工在授权范围内操作浏览器、查询数据、运维服务器。'], ['Browser, data & servers', 'Let agents drive a browser, query data and operate servers within scope.']),
      item('3-9-observability', ['通知、灵动岛与运行观测', 'Bark 通知、iOS / macOS 灵动岛、终态未读与健康视图。'], ['Notifications & islands', 'Bark, iOS / macOS islands, unread states and health views.']),
      item('3-10-github-idea', ['GitHub Idea 调度', '监听 Issue，自动推荐合适的数字员工并入队执行。'], ['GitHub Idea dispatch', 'Listen to issues and route them to the right agent automatically.']),
    ],
  },
  {
    num: '4',
    title: { zh: '安全、隐私与部署', en: 'Security & deployment' },
    items: [
      item('4-1-data-security', ['数据本地化与自托管中继安全模型', '真相在你的电脑，中继只是缓存镜像与指令信箱。'], ['Data locality & relay security', 'The truth lives on your computer; the relay is only a cache and mailbox.']),
      item('4-2-permissions-audit', ['权限控制与审计机制', 'Hard Deny、员工策略、会话授权、JEV 与命令审计。'], ['Permissions & audit', 'Hard Deny, agent policies, session grants, JEV and command audits.']),
      item('4-3-self-host', ['从源码运行与配置', '面向开发者：脚本启动、数据库切换与环境变量。'], ['Run from source', 'For developers: start scripts, database modes and environment variables.']),
    ],
  },
  {
    num: '5',
    title: { zh: '常见问题与版本规划', en: 'FAQ & roadmap' },
    items: [
      item('5-1-faq', ['常见问题（FAQ）', '安装、引擎、中继、审批与数据的高频问题。'], ['FAQ', 'Frequent questions on install, engines, relay, approvals and data.']),
      item('5-2-roadmap', ['平台支持与演进路线', '当前支持的平台、已知限制与后续方向。'], ['Platforms & roadmap', 'Supported platforms, known limits and what comes next.']),
    ],
  },
]

export const DOC_ITEMS: DocItem[] = DOC_GROUPS.flatMap((g) => g.items)
export const DEFAULT_SLUG = DOC_ITEMS[0].slug

export function groupOf(slug: string) {
  return DOC_GROUPS.find((g) => g.items.some((i) => i.slug === slug))
}

const raw = import.meta.glob('./content/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export function docSource(locale: Locale, slug: string): string {
  return raw[`./content/${locale}/${slug}.md`] ?? raw[`./content/zh/${slug}.md`] ?? ''
}

export const DOCS_UI: Record<Locale, Record<string, string>> = {
  zh: {
    docs: '文档',
    search: '搜索文档…',
    noResult: '没有匹配的条目',
    onThisPage: '本页目录',
    prev: '上一节',
    next: '下一节',
    toc: '目录',
    close: '关闭目录',
    copy: '复制',
    copied: '已复制',
    version: '基于 Atolla v0.6.5 · 内容来自产品源码',
    backTop: '回到顶部',
    home: '返回官网',
  },
  en: {
    docs: 'Docs',
    search: 'Search docs…',
    noResult: 'No matching pages',
    onThisPage: 'On this page',
    prev: 'Previous',
    next: 'Next',
    toc: 'Contents',
    close: 'Close contents',
    copy: 'Copy',
    copied: 'Copied',
    version: 'Written for Atolla v0.6.5 · grounded in the product source',
    backTop: 'Back to top',
    home: 'Back to site',
  },
}
