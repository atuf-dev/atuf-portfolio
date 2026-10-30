import { createRoot } from 'react-dom/client'
import '../styles.js'
import { Reveal } from '../components/Depth.jsx'
import { Icon } from '../components/Icons.jsx'
import Shell from '../components/Shell.jsx'
import { BASE, PROJECTS } from '../content.js'

const slug = new URLSearchParams(window.location.search).get('p')
const index = PROJECTS.findIndex((item) => item.slug === slug)
const project = PROJECTS[index]

function NotFound() {
  return (
    <section className="section page-top contact-top">
      <div className="container">
        <h1 className="page-title">Project not found</h1>
        <p>That project doesn’t exist.</p>
        <a className="btn" href={`${BASE}#work`}>
          See all projects <Icon name="arrow" size={18} />
        </a>
      </div>
    </section>
  )
}

function ProjectPage() {
  const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <>
      <section className="section page-top project-top">
        <div className="container feature-grid">
          <Reveal>
            <a className="back-link" href={`${BASE}#work`}>
              ← All work
            </a>
            <p className="eyebrow">/ {project.category}</p>
            <h1 className="page-title">{project.name}</h1>
            <p className="lead">{project.tagline}</p>
          </Reveal>
          <div className="device-stage" data-stage="device" />
        </div>
      </section>
      <section className="section section-tight">
        <div className="container">
          <Reveal className="clay case">
            <div className="prose">
              <h2>Overview</h2>
              <p>{project.overview}</p>
              <h2>Key features</h2>
              <ul className="points">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <dl className="case-meta">
              <div>
                <dt>Role</dt>
                <dd>Full Stack Developer</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{project.category}</dd>
              </div>
              {project.stack && (
                <div>
                  <dt>Built with</dt>
                  <dd>{project.stack.join(', ')}</dd>
                </div>
              )}
            </dl>
          </Reveal>
          <nav className="project-nav" aria-label="More projects">
            <a className="clay" href={`${BASE}project.html?p=${previous.slug}`}>
              <small>Previous</small>
              {previous.name}
            </a>
            <a className="clay" href={`${BASE}project.html?p=${next.slug}`}>
              <small>Next</small>
              {next.name}
            </a>
          </nav>
        </div>
      </section>
    </>
  )
}

if (project) document.title = `${project.name} | Atuf Shaikh`

createRoot(document.getElementById('root')).render(
  <Shell scene={project ? 'project' : 'contact'} images={project?.image}>
    {project ? <ProjectPage /> : <NotFound />}
  </Shell>,
)
