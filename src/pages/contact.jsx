import { createRoot } from 'react-dom/client'
import '../styles.js'
import ContactForm from '../components/ContactForm.jsx'
import { Reveal } from '../components/Depth.jsx'
import { SocialLinks } from '../components/Layout.jsx'
import Shell from '../components/Shell.jsx'
import { EMAIL, LOCATION } from '../content.js'

createRoot(document.getElementById('root')).render(
  <Shell scene="contact">
    <section className="section page-top contact-top">
      <div className="container contact-grid">
        <Reveal>
          <p className="eyebrow">/ Contact</p>
          <h1 className="page-title">
            Let’s talk about what you’re <em>building</em>
          </h1>
          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{LOCATION}</dd>
            </div>
            <div>
              <dt>Elsewhere</dt>
              <dd>
                <SocialLinks />
              </dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={100}>
          <div className="clay form-panel">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  </Shell>,
)
