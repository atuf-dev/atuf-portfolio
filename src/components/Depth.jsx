import { useEffect, useRef, useState } from 'react'
import { hasFinePointer, prefersReducedMotion } from '../motion.js'

// A card that leans slightly towards the pointer. Touch screens and reduced-motion users get a flat card.
export function Tilt({ as: Tag = 'div', max = 3, className = '', children, ...rest }) {
  const node = useRef()

  const onPointerMove = (event) => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const box = node.current.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    node.current.style.setProperty('--tilt-x', `${(-y * max * 2).toFixed(2)}deg`)
    node.current.style.setProperty('--tilt-y', `${(x * max * 2).toFixed(2)}deg`)
  }

  const onPointerLeave = () => {
    node.current.style.setProperty('--tilt-x', '0deg')
    node.current.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <Tag ref={node} className={`tilt ${className}`} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} {...rest}>
      {children}
    </Tag>
  )
}

// Fades a block up into place the first time it scrolls into view.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const node = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={node} className={`reveal ${visible ? 'is-in' : ''} ${className}`} style={{ '--delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
