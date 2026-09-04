import { useEffect, useRef } from 'react'
import './CustomCursor.css'

const LERP = 1
const INTERACTIVE_SELECTOR =
  'a, button, [role="link"], input, textarea, select, label, summary'

function isInteractiveTarget(target) {
  return target instanceof Element &&
    Boolean(target.closest(INTERACTIVE_SELECTOR))
}

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const imgRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const hasMovedRef = useRef(false)
  const hoveringRef = useRef(false)
  const pressingRef = useRef(false)

  useEffect(() => {
    const pointerMq = window.matchMedia('(pointer: fine) and (min-width: 769px)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateCursorClass = () => {
      const hideNative = pointerMq.matches && !reducedMq.matches
      document.documentElement.classList.toggle('custom-cursor-active', hideNative)
    }

    updateCursorClass()
    pointerMq.addEventListener('change', updateCursorClass)
    reducedMq.addEventListener('change', updateCursorClass)

    return () => {
      pointerMq.removeEventListener('change', updateCursorClass)
      reducedMq.removeEventListener('change', updateCursorClass)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY

      if (!hasMovedRef.current) {
        hasMovedRef.current = true
        currentRef.current.x = event.clientX
        currentRef.current.y = event.clientY
        cursorRef.current?.classList.add('custom-cursor--visible')
      }
    }

    const handlePointerOver = (event) => {
      hoveringRef.current = isInteractiveTarget(event.target)
    }

    const handlePointerDown = () => {
      pressingRef.current = true
    }

    const handlePointerUp = () => {
      pressingRef.current = false
    }

    const moveOptions = { passive: true, capture: true }

    window.addEventListener('mousemove', handleMouseMove, moveOptions)
    document.addEventListener('mousemove', handleMouseMove, moveOptions)

    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })

    const tick = () => {
      if (hasMovedRef.current) {
        const mouse = mouseRef.current
        const current = currentRef.current

        current.x += (mouse.x - current.x) * LERP
        current.y += (mouse.y - current.y) * LERP

        const el = cursorRef.current
        if (el) {
          el.style.transform =
            `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
        }

        const scale = pressingRef.current ? 0.9 : hoveringRef.current ? 1.12 : 1
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(${scale})`
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, moveOptions)
      document.removeEventListener('mousemove', handleMouseMove, moveOptions)
      document.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <img
        ref={imgRef}
        className="custom-cursor__img"
        src="/images/layer3.png"
        alt=""
      />
    </div>
  )
}
