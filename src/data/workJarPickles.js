/** 작업 페이지 — picklebg 중심 피클 배치 (Figma 기준 % 좌표·크기) */

const JAR_CENTER_X = 50
const JAR_CENTER_Y = 50
const CLUSTER_FACTOR = 0.76
const JAR_ASPECT = 935 / 892
const BASE_MIN_GAP = 0

const RAW_WORK_JAR_PICKLES = [
  { id: 'jar-1', src: '/images/layer4.png', x: 50, y: 14, size: 3.5, z: 2, offsetX: -12, offsetY: 25, gap: 0.35 },
  { id: 'jar-2', src: '/images/layer7.png', x: 64, y: 18, size: 14, z: 3, gap: 1.15 },
  { id: 'jar-3', src: '/images/layer1.png', x: 28, y: 28, size: 15, z: 4, gap: 0.75 },
  { id: 'jar-4', src: '/images/layer3.png', x: 38, y: 22, size: 7, z: 5, gap: 1.35 },
  { id: 'jar-5', src: '/images/layer3.png', x: 52, y: 34, size: 6, z: 3, gap: 0.55 },
  { id: 'jar-6', src: '/images/layer7.png', x: 72, y: 44, size: 21, z: 6, offsetX: 20, gap: 0.95 },
  { id: 'jar-7', src: '/images/layer3.png', x: 68, y: 38, size: 4.5, z: 7, gap: 1.45 },
  { id: 'jar-8', src: '/images/layer5.png', x: 32, y: 48, size: 8, z: 5, offsetX: 18, gap: 0.65 },
  { id: 'jar-9', src: '/images/layer5.png', x: 44, y: 56, size: 4.8, z: 4, gap: 1.25 },
  { id: 'jar-10', src: '/images/layer6.png', x: 56, y: 60, size: 5, z: 5, gap: 0.4 },
  { id: 'jar-11', src: '/images/layer4.png', x: 50, y: 52, size: 6.8, z: 6, gap: 1.05 },
  { id: 'jar-12', src: '/images/layer1.png', x: 24, y: 68, size: 19, z: 7, gap: 0.85 },
  { id: 'jar-13', src: '/images/layer2.png', x: 35, y: 76, size: 11, z: 8, offsetX: 16, offsetY: -25, gap: 1.35 },
  { id: 'jar-14', src: '/images/layer1.png', x: 68, y: 72, size: 14, z: 6, offsetY: -10, gap: 0.5 },
  { id: 'jar-15', src: '/images/layer3.png', x: 58, y: 42, size: 11.115, z: 4, gap: 1.1 },
  { id: 'jar-17', src: '/images/layer2.png', x: 46, y: 46, size: 9, z: 4, gap: 1.2 },
]

function cluster(value, center) {
  return center + (value - center) * CLUSTER_FACTOR
}

function scalePickleSize(src, size) {
  const isLargeLayer = src.includes('layer1') || src.includes('layer7')
  if (isLargeLayer) return size * 0.85

  const isMediumSmallLayer = ['layer3', 'layer4', 'layer5', 'layer6'].some(
    (layer) => src.includes(layer),
  )
  if (isMediumSmallLayer) return size * 1.4 * 1.08

  return size * 1.4
}

function getCollisionScale(src) {
  if (src.includes('layer2')) return 1.12
  return 1
}

function getRadius(pickle) {
  return (pickle.size / 2) * getCollisionScale(pickle.src)
}

function getPairGap(a, b) {
  return BASE_MIN_GAP + (a.gap + b.gap) / 2
}

function clampToJar(pickle) {
  const radius = getRadius(pickle)
  pickle.x = Math.max(21 + radius, Math.min(79 - radius, pickle.x))
  pickle.y = Math.max(17 + radius, Math.min(87 - radius, pickle.y))
}

function separatePair(a, b) {
  const dx = b.x - a.x
  const dy = (b.y - a.y) * JAR_ASPECT
  const distance = Math.hypot(dx, dy) || 0.001
  const minDistance = getRadius(a) + getRadius(b) + getPairGap(a, b)

  if (distance >= minDistance) return 0

  const push = (minDistance - distance) / 2 + 0.12
  const nx = dx / distance
  const ny = dy / distance

  a.x -= nx * push
  a.y -= (ny / JAR_ASPECT)
  b.x += nx * push
  b.y += (ny / JAR_ASPECT)

  return minDistance - distance
}

function countOverlaps(items) {
  let overlaps = 0
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const dx = items[j].x - items[i].x
      const dy = (items[j].y - items[i].y) * JAR_ASPECT
      const distance = Math.hypot(dx, dy)
      const minDistance = getRadius(items[i]) + getRadius(items[j]) + getPairGap(items[i], items[j])
      if (distance < minDistance - 0.01) overlaps += 1
    }
  }
  return overlaps
}

function resolveOverlaps(pickles) {
  const items = pickles.map((pickle) => ({ ...pickle, gap: pickle.gap ?? 0.8 }))

  for (let iteration = 0; iteration < 500; iteration += 1) {
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        separatePair(items[i], items[j])
      }
    }
    items.forEach(clampToJar)
    if (countOverlaps(items) === 0) break
  }

  return items.map((pickle) => ({
    ...pickle,
    x: +pickle.x.toFixed(2),
    y: +pickle.y.toFixed(2),
    size: +pickle.size.toFixed(2),
  }))
}

const anchoredPickles = RAW_WORK_JAR_PICKLES.map((pickle) => ({
  ...pickle,
  x: cluster(pickle.x, JAR_CENTER_X),
  y: cluster(pickle.y, JAR_CENTER_Y),
  size: scalePickleSize(pickle.src, pickle.size),
  gap: pickle.gap ?? 0.8,
}))

/** PNG 알파 채널 기준 시각적 중심 — bounding box 50% 대비 보정값(%) */
export const PICKLE_LABEL_CENTER = {
  '/images/layer1.png': { x: -0.23, y: -2.33 },
  '/images/layer2.png': { x: -1.9, y: 0.04 },
  '/images/layer3.png': { x: -4.62, y: -3.28 },
  '/images/layer4.png': { x: -1.91, y: -1.09 },
  '/images/layer5.png': { x: -1.91, y: -1.09 },
  '/images/layer6.png': { x: -1.91, y: -1.09 },
  '/images/layer7.png': { x: -0.86, y: -1.75 },
}

export const WORK_JAR_PICKLES = resolveOverlaps(anchoredPickles)
