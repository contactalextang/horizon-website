# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **重要**：本项目使用 Next.js 16，与常见版本有破坏性变更。修改代码前请先阅读 `node_modules/next/dist/docs/` 中的相关指南，注意弃用提示。

## 命令

```bash
npm run dev      # 本地开发服务器（http://localhost:3000）
npm run build    # 生产构建
npm run start    # 启动生产服务器
```

## 架构

### 路由结构

```
app/
├── [locale]/          # next-intl 国际化路由（en / zh，默认 zh）
│   ├── page.tsx       # 首页（项目展示 + 最新日报）
│   ├── daily/         # 日报列表与详情
│   └── projects/      # 项目页
```

### 内容系统

所有内容是 markdown 文件，通过 `lib/content.ts` 读取，构建时静态生成：

- `content/daily/YYYY-MM-DD-{en|zh}.md` — 每日日报，由 Horizon CI 自动写入，**不要手动编辑**
- `content/projects/*.md` — 项目展示，可手动或 AI Agent 编辑

项目 markdown 关键 frontmatter：`title`、`description`、`type`（video/image/text/link）、`featured`（true = 主页展示，建议 ≤3 个）、`status`（active/wip/archived）、`order`（数字越小越靠前）。

新增项目：复制 `content/projects/_template.md` 后 commit + push，Vercel 自动重建（约 30-60 秒）。

### 国际化

- 路由：`i18n/routing.ts`（locales: `['zh', 'en']`，defaultLocale: `'zh'`）
- UI 文案：`messages/en.json` 和 `messages/zh.json`
- 配置入口：`i18n/request.ts` → `next.config.ts`（`withNextIntl` 插件）

### 数据流

```
content/*.md  →  lib/content.ts (gray-matter 解析)
                  lib/daily-parser.ts (自定义 Horizon 格式解析)
                       →  [locale]/daily/  静态页面
```
