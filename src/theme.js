import { useSyncExternalStore } from 'react'

const listeners = new Set()

const currentTheme = () => document.documentElement.dataset.theme || 'light'

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Private windows can block storage; the theme still applies for this page.
  }
  listeners.forEach((listener) => listener())
}

export const toggleTheme = () => setTheme(currentTheme() === 'light' ? 'dark' : 'light')

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useTheme = () => useSyncExternalStore(subscribe, currentTheme)
