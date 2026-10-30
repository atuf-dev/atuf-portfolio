import { useState } from 'react'
import flatAvatar from '../assets/avatar/flat.webp'
import {
  BASE,
  CATEGORIES,
  EDUCATION,
  EMAIL,
  EXPERIENCE,
  LOCATION,
  PROJECTS,
  SKILL_GROUPS,
  yearsOfExperience,
} from '../content.js'
import { useTheme } from '../theme.js'
import { Reveal, Tilt } from './Depth.jsx'
import { Icon } from './Icons.jsx'
import { SocialLinks } from './Layout.jsx'
import { useSceneReady } from './Shell.jsx'

function Heading({ eyebrow, children, center = false }) {
  return (
    <div className={`heading ${center ? 'heading-center' : ''}`}>
      <p className="eyebrow">/ {eyebrow}</p>
      <h2 className="section-title">{children}</h2>
    </div>
  )
}

export function Hero() {
  const ready = useSceneReady()
  return (
    <section className="hero">
      {/* The title sits behind the 3D layer, so the figure stands in front of the words */}
      <h1 className="hero-title">
        Hi, I’m Atuf
        <em>Full Stack Developer</em>
      </h1>
      <div className="hero-stage" data-stage="hero">
        <img className={`hero-fallback ${ready ? 'is-hidden' : ''}`} src={flatAvatar} alt="Illustrated portrait of Atuf Shaikh" />
      </div>
      <div className="container hero-panel">
        <div className="hero-side">
          <p className="pill">
            <span className="pill-dot" />
            {yearsOfExperience()}+ years of experience
          </p>
          <SocialLinks />
        </div>
        <div className="hero-side hero-side-right">
          <p className="hero-lead">
            I build reliable web applications for real businesses, from the interface down to the database.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#featured">
              View my work <Icon name="arrow" size={18} />
            </a>
            <a className="btn btn-soft" href={`${BASE}contact.html`}>
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BuiltWith() {
  const tools = ['React.js', 'Node.js', 'Express.js', '.NET', 'MongoDB', 'MSSQL', 'REST', 'GraphQL']
  return (
    <section className="built-with" aria-label="Main technologies">
      <p>Built with</p>
      <ul className="container">
        {tools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </section>
  )
}

export function Featured() {
  const project = PROJECTS[0]
  return (
    <section id="featured" className="section">
      <div className="container feature-grid">
        <Reveal>
          <Heading eyebrow="Featured project">{project.name}</Heading>
          <p className="lead">{project.overview}</p>
          <ul className="chips">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="btn" href={`${BASE}project.html?p=${project.slug}`}>
            View project <Icon name="arrow" size={18} />
          </a>
        </Reveal>
        <a className="device-stage" data-stage="device" href={`${BASE}project.html?p=${project.slug}`} aria-label={`View ${project.name}`} />
      </div>
    </section>
  )
}

export function Work() {
  const [category, setCategory] = useState('All')
  const theme = useTheme()
  const visible = PROJECTS.filter((project) => category === 'All' || project.category === category)

  return (
    <section id="work" className="section">
      <div className="container">
        <Reveal>
          <Heading eyebrow="Selected work" center>
            Systems I’ve <em>built</em>
          </Heading>
          <div className="filters" role="group" aria-label="Filter projects">
            {CATEGORIES.map((name) => (
              <button key={name} type="button" className="filter" aria-pressed={category === name} onClick={() => setCategory(name)}>
                {name}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="projects">
          {visible.map((project) => (
            <Tilt as="a" key={project.slug} href={`${BASE}project.html?p=${project.slug}`} className="clay project-card" max={5}>
              <span className="project-image">
                <img src={project.image[theme]} alt="" width="1200" height="675" loading="lazy" />
              </span>
              <span className="project-body">
                <span className="project-category">{project.category}</span>
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <span className="project-more">
                  View project <Icon name="arrow" size={16} />
                </span>
              </span>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  ['Understand', 'I work through the requirements and workflows with the people who will use the system.'],
  ['Build', 'Front end, APIs and data modelling, delivered in sprints with regular code reviews.'],
  ['Ship', 'I deploy, test performance and keep refining until it runs fast and reliably.'],
]

export function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <Reveal>
          <Heading eyebrow="How I work" center>
            From idea to <em>production</em>
          </Heading>
        </Reveal>
        <ol className="steps">
          {STEPS.map(([title, text], index) => (
            <li key={title}>
              <Reveal delay={index * 120}>
                <Tilt className={`clay step step-${index + 1}`} max={7}>
                  <span className="step-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal className="layered">
          {/* Stacked, cut-paper clay layers */}
          <svg className="layer layer-1" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M40 40C260-10 420 60 620 30s420-40 540 20c40 110 10 240 30 340s-10 130-50 160c-240 20-430-20-640 0S190 570 50 530C-10 400 30 320 10 200S0 70 40 40Z" />
          </svg>
          <svg className="layer layer-2" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M70 70C300 20 430 100 640 60s390-30 490 30c30 110 0 220 20 310s-20 90-60 110c-220 10-420-20-610 0S210 530 90 500C40 390 60 300 40 200S40 100 70 70Z" />
          </svg>
          <svg className="layer layer-3" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M110 100C320 60 460 130 660 90s340-20 440 30c20 100-10 200 10 280s-20 60-60 80c-200 10-400-20-580 0S230 490 130 470C80 370 100 290 80 200S80 130 110 100Z" />
          </svg>
          <div className="layered-content">
            <div>
              <p className="eyebrow">/ About me</p>
              <h2 className="section-title">
                End-to-end <em>ownership</em>
              </h2>
              <p>
                I’m a Full Stack Developer with {yearsOfExperience()} years of experience building and deploying web
                applications: responsive React.js front ends on Node.js/Express and .NET back-end services with MongoDB
                and MSSQL.
              </p>
            </div>
            <dl className="stat-list">
              <div>
                <dt>Years of experience</dt>
                <dd>{yearsOfExperience()}+</dd>
              </div>
              <div>
                <dt>Projects built</dt>
                <dd>{PROJECTS.length}</dd>
              </div>
              <div>
                <dt>Production modules</dt>
                <dd>6+</dd>
              </div>
              <div>
                <dt>Faster load times</dt>
                <dd>20%</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Row({ item }) {
  return (
    <div className="clay row">
      <p className="row-period">{item.period}</p>
      <div>
        <h3>{item.role}</h3>
        {item.org && <p className="row-org">{item.org}</p>}
        {item.score && <p className="row-org">{item.score}</p>}
        {item.points && (
          <ul className="points">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container timeline-grid">
        <Reveal className="timeline-head">
          <Heading eyebrow="Career">
            Where I’ve <em>worked</em>
          </Heading>
        </Reveal>
        <div className="timeline">
          {EXPERIENCE.map((item) => (
            <Reveal key={item.role}>
              <Row item={item} />
            </Reveal>
          ))}
        </div>
        <Reveal className="timeline-head">
          <Heading eyebrow="Education">
            Where I <em>studied</em>
          </Heading>
        </Reveal>
        <div className="timeline">
          {EDUCATION.map((item) => (
            <Reveal key={item.role}>
              <Row item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <Reveal>
          <Heading eyebrow="Skills" center>
            The stack I <em>work with</em>
          </Heading>
        </Reveal>
        <div className="skills">
          {SKILL_GROUPS.map((group, index) => (
            <Reveal key={group.title} delay={index * 70}>
              <Tilt className="clay skill-group" max={5}>
                <h3>{group.title}</h3>
                <ul className="chips">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section id="cta" className="cta">
      <Reveal className="container cta-inner">
        <h2 className="cta-title">
          Let’s make it <em>happen</em>
        </h2>
        <p>Have a project in mind? I’m based in {LOCATION}. Tell me what you’re building.</p>
        <div className="hero-actions">
          <a className="btn" href={`${BASE}contact.html`}>
            Get in touch <Icon name="arrow" size={18} />
          </a>
          <a className="btn btn-soft" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
