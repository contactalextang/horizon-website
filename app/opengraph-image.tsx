import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/lib/site'

// 站点级默认 OG 图（1200×630）。Next 自动把它用作全站页面的 og:image 与 twitter:image，
// 让 X / LinkedIn / Slack / 微信 分享时有品牌预览大图。用英文避免 CJK 字体嵌入问题；
// 配色对齐 globals.css（奶白底 / 墨黑字 / 金色点缀）。
export const alt = 'Alex Tang — Indie builder shipping real products with AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  const host = SITE_URL.replace(/^https?:\/\//, '')
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F7F6F3',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', width: 120, height: 8, background: '#B8922A' }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 700, color: '#11100D', lineHeight: 1.05 }}>
            Alex Tang
          </div>
          <div style={{ marginTop: 20, fontSize: 40, color: '#8A6B1A' }}>
            Indie builder · shipping real products with AI
          </div>
          <div style={{ marginTop: 16, fontSize: 30, color: '#57544C' }}>
            Founder of MakanCloud — Singapore F&B SaaS
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#11100D',
          }}
        >
          <span>{host}</span>
          <span style={{ color: '#B8922A' }}>AI · SaaS · Investing</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
