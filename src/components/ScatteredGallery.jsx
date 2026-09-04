import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './ScatteredGallery.css'

const ENTRY_DURATION = 0.95
const ENTRY_OFFSET = 38
const ENTER_DELAY_STEP = 0.045
const SECTION_BAND_CQW = 120

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

function groupIntoSections(items) {
  const sectionMap = new Map()

  items.forEach((item, index) => {
    const sectionKey = Math.floor(item.topCqw / SECTION_BAND_CQW)
    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, [])
    }
    sectionMap.get(sectionKey).push({ ...item, index })
  })

  return [...sectionMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([sectionKey, sectionItems]) => {
      const topCqw = Math.min(...sectionItems.map((item) => item.topCqw))
      const bottomCqw = Math.max(...sectionItems.map((item) => item.topCqw + item.heightCqw))

      return {
        id: sectionKey,
        topCqw,
        heightCqw: Math.max(bottomCqw - topCqw, 1),
        items: sectionItems,
      }
    })
}

function fitGalleryHeight(gallery) {
  const figures = gallery.querySelectorAll('.scattered-gallery__item')
  let maxBottom = 0

  figures.forEach((figure) => {
    maxBottom = Math.max(maxBottom, figure.offsetTop + figure.offsetHeight)
  })

  gallery.style.height = maxBottom > 0 ? `${maxBottom}px` : 'auto'
}

function GalleryItem({ item, entered, enterDelay }) {
  return (
    <figure
      className={`scattered-gallery__item${entered ? ' scattered-gallery__item--entered' : ''}`}
      style={{
        '--gallery-left': `${item.leftPercent}%`,
        '--gallery-top': `${item.topCqw}`,
        '--gallery-width': `${item.widthPercent}%`,
        '--gallery-z': item.index + 1,
        '--entry-offset': `${ENTRY_OFFSET}px`,
        '--entry-duration': `${ENTRY_DURATION}s`,
        '--enter-delay': enterDelay,
      }}
    >
      <img src={item.src} alt="" decoding="async" />
    </figure>
  )
}

function GallerySection({ section, reducedMotion }) {
  const sentinelRef = useRef(null)
  const [entered, setEntered] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) {
      setEntered(true)
      return undefined
    }

    const el = sentinelRef.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setEntered(true)
        observer.disconnect()
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <>
      <div
        ref={sentinelRef}
        className="scattered-gallery__sentinel"
        style={{
          top: `calc(${section.topCqw} * 1cqw)`,
          height: `calc(${section.heightCqw} * 1cqw)`,
        }}
        aria-hidden="true"
      />
      {section.items.map((item, itemIndex) => (
        <GalleryItem
          key={item.src}
          item={item}
          entered={entered}
          enterDelay={`${itemIndex * ENTER_DELAY_STEP}s`}
        />
      ))}
    </>
  )
}

function ScatteredGallery({ loadLayout, ariaLabel }) {
  const [layout, setLayout] = useState(null)
  const galleryRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const sections = useMemo(
    () => (layout ? groupIntoSections(layout.items) : []),
    [layout],
  )

  useLayoutEffect(() => {
    let cancelled = false

    loadLayout().then((result) => {
      if (!cancelled) setLayout(result)
    })

    return () => {
      cancelled = true
    }
  }, [loadLayout])

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!layout || !gallery) return

    const syncHeight = () => fitGalleryHeight(gallery)

    gallery.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', syncHeight, { once: true })
        img.addEventListener('error', syncHeight, { once: true })
      }
    })

    syncHeight()

    const resizeObserver = new ResizeObserver(syncHeight)
    resizeObserver.observe(gallery)

    return () => resizeObserver.disconnect()
  }, [layout])

  if (!layout) return null

  return (
    <div ref={galleryRef} className="scattered-gallery" aria-label={ariaLabel}>
      {sections.map((section) => (
        <GallerySection
          key={section.id}
          section={section}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

export default ScatteredGallery
