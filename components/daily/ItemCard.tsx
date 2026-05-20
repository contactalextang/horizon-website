'use client'

import { useState } from 'react'
import type { DailyItem } from '@/types/daily'

type Props = { item: DailyItem; animDelay?: number }

const SOURCE_EMOJI: Record<string, string> = {
  hackernews: '🟠',
  reddit:     '💬',
  github:     '⭐',
  rss:        '📡',
  ossinsight: '📊',
  telegram:   '✈️',
  twitter:    '🐦',
  openbb:     '📈',
  default:    '🔵',
}

function scoreBadge(score: number) {
  if (score >= 8) return { bg: 'var(--amberbg)', color: '#E89E30', border: 'rgba(212,130,10,.35)', label: score.toFixed(1) }
  if (score >= 7) return { bg: 'var(--goldbg2)', color: 'var(--gold)',  border: 'var(--gold2)',             label: score.toFixed(1) }
  if (score >= 5) return { bg: 'var(--greenbg)', color: '#4DC882',      border: 'rgba(42,157,92,.3)',        label: score.toFixed(1) }
  return              { bg: 'var(--bg4)',     color: 'var(--text3)', border: 'var(--line2)',              label: score.toFixed(1) }
}

function tagStyle(tag: string): React.CSSProperties {
  const t = tag.toLowerCase()
  if (['llm','gpt','gemini','claude','ai','openai','anthropic','deepseek'].some(k => t.includes(k)))
    return { background: 'var(--amberbg)', color: '#E89E30', border: '1px solid rgba(212,130,10,.30)' }
  if (['security','breach','hack','vulnerability','cisa','leak'].some(k => t.includes(k)))
    return { background: 'var(--redbg)', color: '#E05050', border: '1px solid rgba(184,50,50,.25)' }
  if (['github','open','source','star','trending'].some(k => t.includes(k)))
    return { background: 'var(--greenbg)', color: '#4DC882', border: '1px solid rgba(42,157,92,.25)' }
  if (['agent','mcp','tool','sdk','api'].some(k => t.includes(k)))
    return { background: 'var(--bluebg)', color: '#5BA3E0', border: '1px solid rgba(45,125,210,.25)' }
  return { background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }
}

export default function ItemCard({ item, animDelay = 0 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const badge = scoreBadge(item.score)
  const emoji = SOURCE_EMOJI[item.source?.toLowerCase()] ?? SOURCE_EMOJI.default

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg3)' : 'var(--bg2)',
        border: `1px solid ${hovered ? 'var(--line3)' : 'var(--line2)'}`,
        borderRadius: 'var(--r2)',
        padding: '16px',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        animation: `fadeUp .4s ease ${animDelay}s both`,
      }}
    >
      {/* Gold top line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'var(--gold)',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .25s',
      }} />

      {/* Top row: emoji + score badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '22px', lineHeight: 1 }}>{emoji}</span>
        <span style={{
          fontFamily: "'Courier New',monospace",
          fontSize: '10px', fontWeight: 600,
          padding: '2px 8px', borderRadius: '3px',
          background: badge.bg, color: badge.color,
          border: `1px solid ${badge.border}`,
          letterSpacing: '.04em',
        }}>
          {badge.label} ★
        </span>
      </div>

      {/* Title */}
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
        fontFamily: "'EB Garamond',var(--font-garamond),'STSong','SimSun',Georgia,serif",
        fontSize: '14px', fontWeight: 400, lineHeight: 1.38,
        color: 'var(--text)', textDecoration: 'none',
        display: 'block', transition: 'color .15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
      >
        {item.title}
      </a>

      {/* Source line — role style */}
      <div style={{
        fontFamily: "'Courier New',monospace",
        fontSize: '9px', letterSpacing: '.08em',
        color: 'var(--text3)', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span>{item.source}</span>
        {item.publishedAt && <><span style={{ opacity: .3 }}>·</span><span>{item.publishedAt}</span></>}
        {item.discussionUrl && (
          <><span style={{ opacity: .3 }}>·</span>
          <a href={item.discussionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
            Discussion ↗
          </a></>
        )}
      </div>

      {/* Summary */}
      {item.summary && (
        <p style={{ fontSize: '11px', lineHeight: 1.7, color: 'var(--text2)', flex: 1 }}>
          {item.summary.length > 200 ? item.summary.slice(0, 200) + '…' : item.summary}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontFamily: "'Courier New',monospace",
              fontSize: '9px', fontWeight: 500,
              padding: '2px 6px', borderRadius: '3px',
              letterSpacing: '.04em',
              ...tagStyle(tag),
            }}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Expand */}
      {(item.background || item.discussion) && (
        <>
          <button onClick={() => setExpanded(!expanded)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontFamily: "'Courier New',monospace", fontSize: '9px',
            letterSpacing: '.06em', color: 'var(--text3)',
            textTransform: 'uppercase', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'color .15s', alignSelf: 'flex-start',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
          >
            <span>{expanded ? '▾' : '▸'}</span> Background
          </button>
          {expanded && (
            <div style={{
              padding: '10px 12px', background: 'var(--bg)',
              borderRadius: 'var(--r)', border: '1px solid var(--line)',
            }}>
              {item.background && (
                <p style={{ fontSize: '11px', lineHeight: 1.7, color: 'var(--text2)' }}>{item.background}</p>
              )}
              {item.discussion && (
                <p style={{ fontSize: '11px', lineHeight: 1.7, color: 'var(--text2)', marginTop: item.background ? '8px' : 0 }}>{item.discussion}</p>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}
