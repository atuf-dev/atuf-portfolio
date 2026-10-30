import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAIL } from '../content.js'
import { useTheme } from '../theme.js'
import { Icon } from './Icons.jsx'

const EMAILJS_PUBLIC_KEY = '-OJJZ4SrrQn_QxMKr'
const EMAILJS_SERVICE = 'service_ipwel5v'
const EMAILJS_TEMPLATE = 'template_4ohj226'
const RECAPTCHA_SITE_KEY = '6LdRPigrAAAAAFMWvOtoiM1qi3cef5mr9VwT12mU'

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function buildEmailHtml({ name, email, phone, subject, message }) {
  const time = new Date().toLocaleString()
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #2c3e50; line-height: 1.5;">
      <p style="margin: 0 0 16px;">📩 <strong>New Contact Form Submission</strong></p>
      <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: 600;">👤 ${escapeHtml(name)}</div>
        <div style="font-size: 12px; color: #888;">📅 ${escapeHtml(time)}</div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p><strong>📧 Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>📞 Phone:</strong> ${escapeHtml(phone) || 'Not provided'}</p>
        <p><strong>📝 Subject:</strong> ${escapeHtml(subject)}</p>
        <div style="margin-top: 20px;">
          <p style="font-weight: bold;">💬 Message:</p>
          <div style="padding: 12px; background-color: #fff; border: 1px solid #ddd; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
      <p style="font-size: 12px; color: #aaa; margin-top: 24px;">This message was sent from your portfolio contact form.</p>
    </div>`
}

function useRecaptcha(container, onLoadError) {
  const widget = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    const render = () => {
      if (!container.current) return
      // A widget can't change theme once drawn, so a theme change draws a fresh one.
      const slot = document.createElement('div')
      container.current.replaceChildren(slot)
      widget.current = window.grecaptcha.render(slot, { sitekey: RECAPTCHA_SITE_KEY, theme })
    }
    if (window.grecaptcha?.render) {
      render()
      return
    }
    window.onRecaptchaLoad = render
    if (document.getElementById('recaptcha-script')) return
    const script = document.createElement('script')
    script.id = 'recaptcha-script'
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.onerror = onLoadError
    document.head.append(script)
  }, [container, onLoadError, theme])

  return {
    token: () => (widget.current === null ? '' : window.grecaptcha.getResponse(widget.current)),
    reset: () => widget.current !== null && window.grecaptcha.reset(widget.current),
  }
}

const FIELDS = [
  { id: 'name', label: 'Name*', type: 'text', placeholder: 'Your name', required: true, autoComplete: 'name' },
  { id: 'email', label: 'Email*', type: 'email', placeholder: 'Your email', required: true, autoComplete: 'email' },
  { id: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: 'Your number', required: false, autoComplete: 'tel' },
  { id: 'subject', label: 'Subject*', type: 'text', placeholder: 'Your subject', required: true },
]

export default function ContactForm() {
  const captcha = useRef()
  const [status, setStatus] = useState({ tone: '', text: '' })
  const [sending, setSending] = useState(false)
  const onCaptchaError = useRef(() =>
    setStatus({
      tone: 'error',
      text: `The spam check couldn’t load. Please email me directly at ${EMAIL}.`,
    }),
  ).current
  const recaptcha = useRecaptcha(captcha, onCaptchaError)

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const token = recaptcha.token()
    if (!token) {
      setStatus({ tone: 'warn', text: 'Please verify that you are not a robot.' })
      return
    }

    const values = Object.fromEntries(new FormData(form))
    setSending(true)
    setStatus({ tone: '', text: 'Sending…' })
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          name: values.name,
          email: values.email,
          message: buildEmailHtml(values),
          // Lets EmailJS verify the token server-side once its reCAPTCHA setting is on.
          'g-recaptcha-response': token,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      setStatus({ tone: 'ok', text: 'Message sent successfully!' })
      form.reset()
    } catch (error) {
      console.error(error)
      setStatus({ tone: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      recaptcha.reset()
      setSending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      {FIELDS.map(({ id, label, ...input }) => (
        <div key={id} className="field">
          <label htmlFor={id}>{label}</label>
          <input id={id} name={id} {...input} />
        </div>
      ))}
      <div className="field field-full">
        <label htmlFor="message">Message*</label>
        <textarea id="message" name="message" rows="7" placeholder="Type your message" required />
      </div>
      <div className="field-full captcha" ref={captcha} />
      <div className="field-full">
        <button className="btn" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Submit'} <Icon name="arrow" size={18} />
        </button>
        <p className={`form-status ${status.tone}`} role="status">
          {status.text}
        </p>
      </div>
    </form>
  )
}
