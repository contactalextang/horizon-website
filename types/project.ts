export type ProjectType = 'video' | 'image' | 'text' | 'link'
export type ProjectStatus = 'active' | 'wip' | 'archived'

export interface Project {
  slug: string
  title: string
  description: string
  type: ProjectType
  lang: 'zh' | 'en' | 'both'
  tags: string[]
  cover?: string
  videoUrl?: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  date: string
  status: ProjectStatus
  order: number
  content: string       // rendered HTML
}
