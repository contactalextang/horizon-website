'use client'

import { useState } from 'react'
import type { DailyItem } from '@/types/daily'

type Props = { item: DailyItem; animDelay?: number }

function scoreColor(score: number) {
  if (score >= 8) return 'var(--amber)'
  if (score >= 7) return 'var(--gold)'
  if (score >= 5) return 'var(--green)'
  return 'var(--text3)'
}

function scoreGradient(score: number) {
  if (score >= 8) return 'linear-gradient(180deg,var(--amber),#F0A830)'
  if (score >= 7) return 'linear-gradient(180deg,var(--gold),#E0C060)'
  if (score >= 5) return 'linear-gradient(180deg,var(--green),#3AB870)'
  return 'var(--bg5)'
}

function tagStyle(tag: string): React.CSSProperties {
  const t = tag.toLowerCase()
  if (['llm','gpt','gemini','claude','ai','openai','anthropic','deepseek'].some(k => t.includes(k)))
    return { background: 'var(--amberbg)', color: '#A06400', border: '1px solid rgba(212,130,10,.30)' }
  if (['security','breach','hack','vulnerability','cisa','leak'].some(k => t.includes(k)))
    return { background: 'var(--redbg)', color: '#C02020', border: '1px solid rgba(184,50,50,.30)' }
  if (['github','open','source','star','trending'].some(k => t.includes(k)))
    return { background: 'var(--greenbg)', color: '#1A7A42', border: '1px solid rgba(42,157,92,.30)' }
  if (['agent','mcp','tool','sdk','api'].some(k => t.includes(k)))
    return { background: 'var(--bluebg)', color: '#1A65B8', border: '1px solid rgba(45,125,210,.30)' }
  return { background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }
}

export default function ItemCard({ item, animDelay = 0 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const barHeight = `${Math.round(item.score * 10)}%`
  const color = scoreColor(item.score)
  const gradient = scoreGradient(item.score)

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr',
        gap: '16px',
        padding: '18px 20px',
        background: hovered ? 'var(--bg3)' : 'var(--bg2)',
        border: `1px solid ${hovered ? 'var(--line3)' : 'var(--line2)'}`,
        borderRadius: 'var(--r2)',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .2s',
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

      {/* Score column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', paddingTop: '2px' }}>
        <span style={{ fontSize: '12px', color }}> ★</span>
        <span style={{
          fontFamily: "'Courier New',monospace",
          fontSize: '19px', fontWeight: 400, lineHeight: 1, color,
        }}>
          {item.score.toFixed(1)}
        </span>
        <div style={{
          width: '2px', flex: 1, minHeight: '36px',
          background: 'var(--bg4)', borderRadius: '2px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            borderRadius: '2px', height: barHeight,
            background: gradient,
          }} />
        </div>
      </div>

      {/* Content column */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: '9px', color: 'var(--text3)',
            marginTop: '5px', flexShrink: 0, letterSpacing: '.04em',
          }}>
            #{String(item.index).padStart(2, '0')}
          </span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'EB Garamond',var(--font-garamond),'STSong','SimSun',Georgia,serif",
            fontSize: '16px', fontWeight: 400, lineHeight: 1.35,
            color: 'var(--text)', textDecoration: 'none',
            display: 'block', transition: 'color .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
          >
            {item.title}
          </a>
        </div>

        {/* Summary */}
        {item.summary && (
          <p style={{ fontSize: '12px', lineHeight: 1.72, color: 'var(--text2)' }}>
            {item.summary}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '7px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontFamily: "'Courier New',monospace", fontSize: '9px',
            letterSpacing: '.05em', color: 'var(--text3)',
            background: 'var(--bg4)', border: '1px solid var(--line)',
            padding: '2px 8px', borderRadius: '3px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', opacity: .6 }} />
            {item.source}
          </span>
          {item.publishedAt && (
            <>
              <span style={{ width: '3px', height: '3px', background: 'var(--text3)', borderRadius: '50%', opacity: .3 }} />
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', color: 'var(--text3)' }}>
                {item.publishedAt}
              </span>
            </>
          )}
          {item.discussionUrl && (
            <>
              <span style={{ width: '3px', height: '3px', background: 'var(--text3)', borderRadius: '50%', opacity: .3 }} />
              <a href={item.discussionUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', color: 'var(--blue)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--blue)')}
              >
                Discussion ↗
              </a>
            </>
          )}
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'Courier New',monospace",
                fontSize: '9px', fontWeight: 500,
                padding: '2px 7px', borderRadius: '3px',
                letterSpacing: '.05em',
                ...tagStyle(tag),
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Expand */}
        {(item.background || item.discussion) && (
          <>
            <button onClick={() => setExpanded(!expanded)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontFamily: "'Courier New',monospace", fontSize: '9px',
              letterSpacing: '.06em', color: 'var(--text3)',
              textTransform: 'uppercase', background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color .15s', alignSelf: 'flex-start',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
            >
              <span>{expanded ? '▾' : '▸'}</span> 更多
            </button>
            {expanded && (
              <div style={{
                padding: '12px 14px', background: 'var(--bg)',
                borderRadius: 'var(--r)', border: '1px solid var(--line)',
              }}>
                {item.background && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: '7px' }}>
                      背景
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'var(--text2)', marginBottom: item.discussion ? '12px' : 0 }}>
                      {item.background}
                    </p>
                  </>
                )}
                {item.discussion && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: '7px', marginTop: item.background ? '12px' : 0 }}>
                      社区讨论
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'var(--text2)' }}>
                      {item.discussion}
                    </p>
                  </>
                )}
                {item.references.length > 0 && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', margin: '12px 0 6px' }}>
                      参考链接
                    </div>
                    <ul style={{ paddingLeft: '14px', fontSize: '11px', lineHeight: 1.6 }}>
                      {item.references.map((ref, i) => (
                        <li key={i}>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                            {ref.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  )
}
