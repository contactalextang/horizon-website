'use client'

import { useState } from 'react'
import type { DailyItem } from '@/types/daily'

type Props = { item: DailyItem; animDelay?: number }

function scoreStyle(score: number): { color: string; barColor: string } {
  if (score >= 8) return { color: 'var(--amber)', barColor: 'linear-gradient(180deg,var(--amber),#F0A830)' }
  if (score >= 7) return { color: 'var(--gold)',  barColor: 'linear-gradient(180deg,var(--gold),#E0C060)' }
  if (score >= 5) return { color: 'var(--green)', barColor: 'linear-gradient(180deg,var(--green),#3AB870)' }
  return          { color: 'var(--text3)', barColor: 'var(--bg5)' }
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
  const { color, barColor } = scoreStyle(item.score)
  const barHeight = `${Math.round(item.score * 10)}%`

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
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all .2s',
        animation: `fadeUp .4s ease ${animDelay}s both`,
      }}
    >
      {/* Gold top line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'var(--gold)',
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .25s',
      }} />

      {/* Score column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', paddingTop: '2px' }}>
        <span style={{ fontSize: '12px', color }}>★</span>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: '19px', fontWeight: 400, lineHeight: 1, color }}>
          {item.score.toFixed(1)}
        </span>
        <div style={{ width: '2px', flex: 1, minHeight: '36px', background: 'var(--bg4)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '2px', height: barHeight, background: barColor }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', color: 'var(--text3)', marginTop: '5px', flexShrink: 0, letterSpacing: '.04em' }}>
            #{String(item.index).padStart(2, '0')}
          </span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'EB Garamond',var(--font-garamond),Georgia,serif",
            fontSize: '16px', fontWeight: 400, lineHeight: 1.35,
            color: 'var(--text)', textDecoration: 'none', display: 'block',
            transition: 'color .15s',
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
            fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.05em',
            color: 'var(--text3)', background: 'var(--bg4)',
            border: '1px solid var(--line)', padding: '2px 8px', borderRadius: '3px',
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
              <a href={item.discussionUrl} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'Courier New',monospace", fontSize: '10px',
                color: 'var(--blue)', textDecoration: 'none',
              }}
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
                fontFamily: "'Courier New',monospace", fontSize: '9px',
                fontWeight: 500, letterSpacing: '.05em',
                padding: '2px 7px', borderRadius: '3px',
                ...tagStyle(tag),
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Expand button */}
        {(item.background || item.discussion) && (
          <>
            <button onClick={() => setExpanded(!expanded)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.06em',
              color: 'var(--text3)', textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color .15s', alignSelf: 'flex-start',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
            >
              <span>{expanded ? '▾' : '▸'}</span> Background
            </button>

            {expanded && (
              <div style={{
                padding: '12px 14px', background: 'var(--bg)',
                borderRadius: 'var(--r)', border: '1px solid var(--line)', marginTop: '2px',
              }}>
                {item.background && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: '7px' }}>
                      Background
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'var(--text2)', marginBottom: item.discussion ? '12px' : 0 }}>
                      {item.background}
                    </p>
                  </>
                )}
                {item.discussion && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: '7px', marginTop: item.background ? '12px' : 0 }}>
                      Discussion
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, color: 'var(--text2)' }}>
                      {item.discussion}
                    </p>
                  </>
                )}
                {item.references.length > 0 && (
                  <>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold2)', marginTop: '12px', marginBottom: '6px' }}>
                      References
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
