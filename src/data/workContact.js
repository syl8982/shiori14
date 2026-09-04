export function parseContactLines(contact) {
  if (!contact?.trim()) return []

  return contact
    .split('/')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function getContactLink(line) {
  const value = line.trim()
  if (!value) return null

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`
  }

  if (value.startsWith('@')) {
    return `https://instagram.com/${value.slice(1).replace(/\/$/, '')}`
  }

  if (value.includes('@')) {
    return `mailto:${value}`
  }

  const handle = value.replace(/\/$/, '')
  if (/^[a-zA-Z0-9._]+$/.test(handle)) {
    return `https://instagram.com/${handle}`
  }

  return null
}
