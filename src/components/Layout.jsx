import { useRef } from 'react'
import { BASE, EMAIL, GITHUB, LINKEDIN, LOCATION, NAV } from '../content.js'
import { toggleTheme, useTheme } from '../theme.js'
import { Icon } from './Icons.jsx'

export function SocialLinks({ className = '', withEmail = false }) {
  return (
    <ul className={`social ${className}`}>
      <li>
        <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
          <Icon name="linkedin" size={20} />
        </a>
      </li>
      <li>
        <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub profile">
          <Icon name="github" size={20} />
        </a>
      </li>
      {withEmail && (
        <li>
          <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`}>
            <Icon name="mail" size={20} />
          </a>
        </li>
      )}
    </ul>
  )
}

function ThemeToggle() {
  const theme = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button className="theme-toggle" type="button" aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`} onClick={toggleTheme}>
      <Icon name={next === 'dark' ? 'moon' : 'sun'} size={18} />
    </button>
  )
}

export function Header() {
  const menu = useRef()

  return (
    <header className="site-header">
      <div className="header-row">
        <a className="wordmark" href={BASE}>
          Atuf Shaikh
        </a>
        <nav className="desktop-nav" aria-label="Main">
          {NAV.slice(1).map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button className="menu-toggle" type="button" aria-label="Open menu" onClick={() => menu.current.showModal()}>
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Native dialog: traps focus and closes on Escape without extra code */}
      <dialog ref={menu} className="menu" aria-label="Site menu">
        <div className="menu-top">
          <span className="wordmark">Atuf Shaikh</span>
          <button className="menu-close" type="button" aria-label="Close menu" onClick={() => menu.current.close()}>
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Menu">
          <ul className="menu-links">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={() => menu.current.close()}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks withEmail />
      </dialog>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Atuf Shaikh · {LOCATION}
        </p>
        <SocialLinks withEmail />
      </div>
    </footer>
  )
}
