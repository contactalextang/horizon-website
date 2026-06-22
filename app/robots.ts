import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// 显式放行主流 AI 抓取器（GEO：让内容能被 AI 引擎收录/引用）。
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', // OpenAI
  'ClaudeBot', 'Claude-Web', 'anthropic-ai', // Anthropic
  'PerplexityBot', 'Perplexity-User', // Perplexity
  'Google-Extended', // Google AI / Gemini
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl（多数 LLM 训练语料）
  'Amazonbot', 'Bytespider', 'cohere-ai', 'Meta-ExternalAgent', 'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
