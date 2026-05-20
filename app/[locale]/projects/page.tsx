import { getTranslations } from 'next-intl/server'
import { getAllProjects } from '@/lib/content'
import type { Project } from '@/types/project'

type Props = { params: Promise<{ locale: 'en' | 'zh' }> }

function statusBadge(status: Project['status']) {
  const map = {
    active:   { bg: 'var(--greenbg)', color: '#4DC882', label: 'Active' },
    wip:      { bg: 'var(--amberbg)', color: '#E89E30', label: 'WIP' },
    archived: { bg: 'var(--bg4)', color: 'var(--text3)', label: 'Archived' },
  }
  return map[status] || map.active
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  const projects = getAllProjects()

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '36px 0 24px', borderBottom: '1px solid var(--line)', marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--gold2)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {locale === 'en' ? 'Portfolio' : '作品集'}
        </div>
        <h1 style={{ fontFamily: "'EB Garamond',var(--font-garamond),Georgia,serif", fontSize: '32px', fontWeight: 400, color: 'var(--text)' }}>
          {t('title')}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '8px' }}>{t('desc')}</p>
      </div>

      {projects.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
          {locale === 'en' ? 'No projects yet.' : '暂无项目。'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
          {projects.map(p => {
            const badge = statusBadge(p.status)
            return (
              <div key={p.slug} style={{
                padding: '18px', background: 'var(--bg2)', border: '1px solid var(--line2)',
                borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column', gap: '10px',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line3)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line2)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}
              >
                {/* Title + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h2 style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: '16px', fontWeight: 400, color: 'var(--text)', lineHeight: 1.3 }}>
                    {p.title}
                  </h2>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: badge.bg, color: badge.color, flexShrink: 0, marginTop: '3px' }}>
                    {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.65, flex: 1 }}>{p.description}</p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--text3)', border: '1px solid var(--line2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                {(p.demoUrl || p.githubUrl) && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)', border: '1px solid var(--gold2)', color: 'var(--gold)', textDecoration: 'none', transition: 'all .15s' }}>
                        Demo ↗
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Courier New',monospace", fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)', border: '1px solid var(--line2)', color: 'var(--text3)', textDecoration: 'none', transition: 'all .15s' }}>
                        GitHub ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
