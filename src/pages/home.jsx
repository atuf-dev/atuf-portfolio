import { createRoot } from 'react-dom/client'
import '../styles.js'
import { About, BuiltWith, Cta, Experience, Featured, Hero, Process, Skills, Work } from '../components/Sections.jsx'
import Shell from '../components/Shell.jsx'
import { PROJECTS } from '../content.js'

createRoot(document.getElementById('root')).render(
  <Shell scene="home" images={PROJECTS[0].image}>
    <Hero />
    <BuiltWith />
    <Featured />
    <Work />
    <Process />
    <About />
    <Experience />
    <Skills />
    <Cta />
  </Shell>,
)
