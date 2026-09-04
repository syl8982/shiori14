let mouseX = 0
let mouseY = 0
let active = false
let initialized = false
let cleanup = null

function handleMove(event) {
  if (typeof event.clientX !== 'number' || typeof event.clientY !== 'number') return
  mouseX = event.clientX
  mouseY = event.clientY
  active = true
}

function handleLeave() {
  active = false
}

export function startMouseTracker() {
  if (initialized) return cleanup

  const pointerMq = window.matchMedia('(pointer: fine) and (min-width: 769px)')
  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')

  if (!pointerMq.matches || reducedMq.matches) {
    return null
  }

  const capture = { passive: true, capture: true }

  document.addEventListener('mousemove', handleMove, capture)
  document.addEventListener('pointermove', handleMove, capture)
  document.addEventListener('mouseover', handleMove, capture)
  document.documentElement.addEventListener('mouseleave', handleLeave)

  initialized = true

  cleanup = () => {
    document.removeEventListener('mousemove', handleMove, capture)
    document.removeEventListener('pointermove', handleMove, capture)
    document.removeEventListener('mouseover', handleMove, capture)
    document.documentElement.removeEventListener('mouseleave', handleLeave)
    initialized = false
    active = false
    cleanup = null
  }

  return cleanup
}

export function stopMouseTracker() {
  cleanup?.()
}

export function getMousePosition() {
  return { x: mouseX, y: mouseY, active }
}
