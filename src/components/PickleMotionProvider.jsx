import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getMousePosition, startMouseTracker } from '../utils/mouseTracker'

const PickleMotionContext = createContext(null)

const ENTRY_DURATION = 1.35
const GRAPHIC_REPEL_STRENGTH = 14
const SETTLE_THRESHOLD = 0.04

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

function usePointerInteractionEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 769px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return enabled
}

function clampMagnitude(x, y, max) {
  const distance = Math.hypot(x, y)
  if (distance <= max || distance === 0) return { x, y }
  const scale = max / distance
  return { x: x * scale, y: y * scale }
}

function computeMouseRepulsion(graphic, centerX, centerY, mouseX, mouseY) {
  const dx = centerX - mouseX
  const dy = centerY - mouseY
  const distance = Math.hypot(dx, dy)
  const radius = graphic.influenceRadius ?? 160

  if (distance >= radius || distance < 0.001) {
    return { fx: 0, fy: 0 }
  }

  const proximity = 1 - distance / radius
  const eased = proximity ** 2.2
  const push = eased * (graphic.pushStrength ?? 28)

  return {
    fx: (dx / distance) * push,
    fy: (dy / distance) * push,
  }
}

function computeGraphicRepulsion(state, other) {
  const dx = state.centerX - other.centerX
  const dy = state.centerY - other.centerY
  const distance = Math.hypot(dx, dy)
  const minSeparation = state.collisionRadius + other.collisionRadius + 10

  if (distance >= minSeparation || distance < 0.001) {
    return { fx: 0, fy: 0 }
  }

  const overlap = (minSeparation - distance) / minSeparation
  const force = overlap * GRAPHIC_REPEL_STRENGTH

  return {
    fx: (dx / distance) * force,
    fy: (dy / distance) * force,
  }
}

function stepPhysics(graphic, forceX, forceY) {
  const motion = graphic.motion
  const mass = graphic.mass ?? 1.5
  const spring = graphic.spring ?? 0.045
  const damping = graphic.damping ?? 0.84
  const maxPush = graphic.maxPush ?? 40

  const springX = -motion.x * spring
  const springY = -motion.y * spring

  motion.vx += (forceX + springX) / mass
  motion.vy += (forceY + springY) / mass
  motion.vx *= damping
  motion.vy *= damping
  motion.x += motion.vx
  motion.y += motion.vy

  const clamped = clampMagnitude(motion.x, motion.y, maxPush)
  motion.x = clamped.x
  motion.y = clamped.y

  if (Math.abs(motion.x) >= maxPush * 0.98) {
    motion.vx *= 0.5
  }
  if (Math.abs(motion.y) >= maxPush * 0.98) {
    motion.vy *= 0.5
  }

  if (
    Math.hypot(forceX + springX, forceY + springY) < SETTLE_THRESHOLD
    && Math.hypot(motion.vx, motion.vy) < SETTLE_THRESHOLD
    && Math.hypot(motion.x, motion.y) < SETTLE_THRESHOLD
  ) {
    motion.x = 0
    motion.y = 0
    motion.vx = 0
    motion.vy = 0
  }
}

export function PickleMotionProvider({ children, className, ...props }) {
  const scopeRef = useRef(null)
  const graphicsRef = useRef(new Map())
  const rafRef = useRef(0)
  const startTimeRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const interactionEnabled = usePointerInteractionEnabled()

  const register = useCallback((id, innerRef, config) => {
    graphicsRef.current.set(id, {
      innerRef,
      motion: { x: 0, y: 0, vx: 0, vy: 0 },
      ...config,
    })

    return () => {
      graphicsRef.current.delete(id)
      const el = innerRef.current
      if (el) {
        el.style.transform = ''
        el.style.opacity = ''
        el.style.willChange = ''
      }
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return undefined

    startTimeRef.current = performance.now()
    if (interactionEnabled) {
      startMouseTracker()
    }

    const tick = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000
      const { x: mouseX, y: mouseY, active: mouseActive } = getMousePosition()
      const effectiveMouseX = mouseActive ? mouseX : -9999
      const effectiveMouseY = mouseActive ? mouseY : -9999

      const activeGraphics = []

      graphicsRef.current.forEach((graphic) => {
        const el = graphic.innerRef.current
        if (!el) return

        const delay = graphic.enterDelay ?? 0
        const entryOffset = graphic.entryOffset ?? 110

        let tx = 0
        let ty = 0
        let opacity = 1
        let isInteractive = false

        if (elapsed < delay) {
          opacity = 0
          ty = -entryOffset
          graphic.motion.x = 0
          graphic.motion.y = 0
          graphic.motion.vx = 0
          graphic.motion.vy = 0
        } else if (elapsed < delay + ENTRY_DURATION) {
          const progress = (elapsed - delay) / ENTRY_DURATION
          const eased = 1 - (1 - progress) ** 3
          ty = -entryOffset * (1 - eased)
          opacity = eased
          graphic.motion.x = 0
          graphic.motion.y = 0
          graphic.motion.vx = 0
          graphic.motion.vy = 0
        } else if (interactionEnabled) {
          isInteractive = true
          tx = graphic.motion.x
          ty = graphic.motion.y
        } else {
          graphic.motion.x = 0
          graphic.motion.y = 0
          graphic.motion.vx = 0
          graphic.motion.vy = 0
        }

        el.style.willChange = 'transform, opacity'
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
        el.style.opacity = String(opacity)

        if (isInteractive) {
          const rect = el.getBoundingClientRect()
          activeGraphics.push({
            graphic,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            collisionRadius: Math.max(rect.width, rect.height) * 0.42,
          })
        }
      })

      if (interactionEnabled && mouseActive) {
        activeGraphics.forEach((state) => {
          const { graphic } = state
          let forceX = 0
          let forceY = 0

          const mouseForce = computeMouseRepulsion(
            graphic,
            state.centerX,
            state.centerY,
            effectiveMouseX,
            effectiveMouseY,
          )
          forceX += mouseForce.fx
          forceY += mouseForce.fy

          activeGraphics.forEach((other) => {
            if (other.graphic === graphic) return
            const repel = computeGraphicRepulsion(state, other)
            forceX += repel.fx
            forceY += repel.fy
          })

          stepPhysics(graphic, forceX, forceY)

          const el = graphic.innerRef.current
          if (el) {
            el.style.transform = `translate3d(${graphic.motion.x}px, ${graphic.motion.y}px, 0)`
          }
        })
      } else if (interactionEnabled) {
        activeGraphics.forEach((state) => {
          stepPhysics(state.graphic, 0, 0)
          const el = state.graphic.innerRef.current
          if (el) {
            el.style.transform = `translate3d(${state.graphic.motion.x}px, ${state.graphic.motion.y}px, 0)`
          }
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      graphicsRef.current.forEach((graphic) => {
        const el = graphic.innerRef.current
        if (el) {
          el.style.transform = ''
          el.style.opacity = ''
          el.style.willChange = ''
        }
      })
    }
  }, [reducedMotion, interactionEnabled])

  const value = { register, reducedMotion }

  return (
    <PickleMotionContext.Provider value={value}>
      <main ref={scopeRef} className={className} {...props}>
        {children}
      </main>
    </PickleMotionContext.Provider>
  )
}

export function usePickleMotion() {
  const context = useContext(PickleMotionContext)
  if (!context) {
    throw new Error('usePickleMotion must be used within PickleMotionProvider')
  }
  return context
}
