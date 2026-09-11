/** 작업 페이지 — picklebg 중심 피클 배치 (Figma 기준 % 좌표·크기) */

import { assetPath } from '../utils/assetPath'

const JAR_CENTER_X = 50
const JAR_CENTER_Y = 50
const JAR_ASPECT = 935 / 892

const RAW_WORK_JAR_PICKLES = [
  { id: 'jar-1', src: '/images/layer4.png', x: 50, y: 14, size: 3.5, z: 2, offsetX: -4, offsetY: 40, gap: 0.35 },
  { id: 'jar-2', src: '/images/layer7.png', x: 64, y: 18, size: 14, z: 3, gap: 1.15 },
  { id: 'jar-3', src: '/images/layer1.png', x: 28, y: 28, size: 15, z: 4, gap: 0.75 },
  { id: 'jar-4', src: '/images/layer3.png', x: 38, y: 22, size: 7, z: 5, gap: 1.35 },
  { id: 'jar-5', src: '/images/layer3.png', x: 52, y: 34, size: 6, z: 3, offsetY: 13, gap: 0.55 },
  { id: 'jar-6', src: '/images/layer7.png', x: 72, y: 44, size: 21, z: 6, offsetX: 12, gap: 0.95 },
  { id: 'jar-7', src: '/images/layer6.png', x: 68, y: 38, size: 4.5, z: 7, gap: 1.45 },
  { id: 'jar-8', src: '/images/layer5.png', x: 32, y: 48, size: 8, z: 5, offsetX: 18, gap: 0.65 },
  { id: 'jar-9', src: '/images/layer5.png', x: 44, y: 56, size: 4.8, z: 4, gap: 1.25 },
  { id: 'jar-10', src: '/images/layer6.png', x: 56, y: 60, size: 5, z: 5, gap: 0.4 },
  { id: 'jar-11', src: '/images/layer4.png', x: 50, y: 52, size: 6.8, z: 6, gap: 1.05 },
  { id: 'jar-12', src: '/images/layer1.png', x: 24, y: 68, size: 19, z: 7, offsetX: -8, gap: 0.85 },
  { id: 'jar-13', src: '/images/layer2.png', x: 35, y: 76, size: 11, z: 8, offsetX: 16, offsetY: 17, gap: 1.35 },
  { id: 'jar-14', src: '/images/layer1.png', x: 68, y: 72, size: 14, z: 6, offsetY: 10, gap: 0.5 },
  { id: 'jar-15', src: '/images/layer3.png', x: 58, y: 42, size: 11.115, z: 4, gap: 1.1 },
  { id: 'jar-17', src: '/images/layer2.png', x: 46, y: 46, size: 9, z: 4, gap: 1.2 },
]

function scalePickleSize(src, size, sizeMultiplier = 1) {
  const isLargeLayer = src.includes('layer1') || src.includes('layer7')
  if (isLargeLayer) return size * 0.85 * sizeMultiplier

  const isMediumSmallLayer = ['layer3', 'layer4', 'layer5', 'layer6'].some(
    (layer) => src.includes(layer),
  )
  if (isMediumSmallLayer) return size * 1.4 * 1.08 * sizeMultiplier

  return size * 1.4 * sizeMultiplier
}

function getBaseCollisionScale(src) {
  if (src.includes('layer2')) return 1.12
  return 1
}

/** PNG 알파 바깥 여백 — 레이어별로 다르게 적용 */
function getVisualCollisionScale(src) {
  if (src.includes('layer2')) return 1.5
  if (src.includes('layer3')) return 1.48
  if (src.includes('layer4')) return 1.46
  if (src.includes('layer5')) return 1.44
  if (src.includes('layer6')) return 1.44
  if (src.includes('layer7')) return 1.42
  if (src.includes('layer1')) return 1.4
  return 1.42
}

function createJarPickleLayout({
  clusterFactor,
  baseMinGap,
  gapMultiplier,
  sizeMultiplier = 1,
  perPickleSizeScale = {},
  useVisualPadding = false,
  visualCollisionScale = 1,
  pairPushPadding = 0.12,
  maxIterations = 500,
  gapEscalationPasses = 0,
}) {
  function cluster(value, center) {
    return center + (value - center) * clusterFactor
  }

  function getRadius(pickle) {
    let radius = (pickle.size / 2) * getBaseCollisionScale(pickle.src)
    if (useVisualPadding) {
      radius *= getVisualCollisionScale(pickle.src) * visualCollisionScale
    }
    return radius
  }

  function getPairGap(a, b) {
    return baseMinGap + (a.gap + b.gap) / 2
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

    if (distance >= minDistance) return

    const push = (minDistance - distance) / 2 + pairPushPadding
    const nx = dx / distance
    const ny = dy / distance

    a.x -= nx * push
    a.y -= ny / JAR_ASPECT
    b.x += nx * push
    b.y += ny / JAR_ASPECT
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
    const items = pickles.map((pickle) => ({ ...pickle }))

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          separatePair(items[i], items[j])
        }
      }
      items.forEach(clampToJar)
      if (countOverlaps(items) === 0) break
    }

    return items
  }

  function buildAnchoredPickles(gapScale = 1) {
    return RAW_WORK_JAR_PICKLES.map((pickle) => ({
      ...pickle,
      x: cluster(pickle.x, JAR_CENTER_X),
      y: cluster(pickle.y, JAR_CENTER_Y),
      size: scalePickleSize(
        pickle.src,
        pickle.size * (perPickleSizeScale[pickle.id] ?? 1),
        sizeMultiplier,
      ),
      gap: (pickle.gap ?? 0.8) * gapMultiplier * gapScale,
    }))
  }

  function resolveUntilClear() {
    let gapScale = 1

    for (let pass = 0; pass <= gapEscalationPasses; pass += 1) {
      const resolved = resolveOverlaps(buildAnchoredPickles(gapScale))
      if (countOverlaps(resolved) === 0) return resolved
      gapScale *= 1.1
    }

    return resolveOverlaps(buildAnchoredPickles(gapScale))
  }

  return resolveUntilClear().map((pickle) => ({
    ...pickle,
    x: +pickle.x.toFixed(2),
    y: +pickle.y.toFixed(2),
    size: +pickle.size.toFixed(2),
    src: assetPath(pickle.src),
  }))
}

/** PNG 알파 채널 기준 시각적 중심 — bounding box 50% 대비 보정값(%) */
const RAW_PICKLE_LABEL_CENTER = {
  '/images/layer1.png': { x: -0.23, y: -2.33 },
  '/images/layer2.png': { x: -1.9, y: 0.04 },
  '/images/layer3.png': { x: -4.62, y: -3.28 },
  '/images/layer4.png': { x: -1.91, y: -1.09 },
  '/images/layer5.png': { x: -1.91, y: -1.09 },
  '/images/layer6.png': { x: -1.91, y: -1.09 },
  '/images/layer7.png': { x: -0.86, y: -1.75 },
}

export const PICKLE_LABEL_CENTER = Object.fromEntries(
  Object.entries(RAW_PICKLE_LABEL_CENTER).map(([src, center]) => [assetPath(src), center]),
)

/** 데스크톱 — jar별 크기 보정 */
const DESKTOP_PICKLE_SIZE_SCALE = {
  'jar-5': 0.96,
  'jar-6': 0.96,
  'jar-8': 0.96,
  'jar-9': 0.8748,
  'jar-10': 1.0086,
  'jar-11': 0.9216,
  'jar-12': 0.96,
  'jar-15': 0.8292,
  'jar-17': 0.97,
}

/** 데스크톱 — jar별 위치 보정 (px) */
const DESKTOP_PICKLE_OFFSET_X = {
  'jar-5': 26,
  'jar-7': 10,
  'jar-9': -7,
  'jar-10': -5,
  'jar-14': 7,
  'jar-15': 10,
}

const DESKTOP_PICKLE_OFFSET_Y = {
  'jar-1': 10,
  'jar-4': -15,
  'jar-5': 4,
  'jar-10': 15,
  'jar-11': 10,
}

export const WORK_JAR_PICKLES = createJarPickleLayout({
  clusterFactor: 0.76,
  baseMinGap: 0,
  gapMultiplier: 1,
  sizeMultiplier: 0.98,
  perPickleSizeScale: DESKTOP_PICKLE_SIZE_SCALE,
  visualCollisionScale: 1,
}).map((pickle) => {
  const offsetXDelta = DESKTOP_PICKLE_OFFSET_X[pickle.id]
  const offsetYDelta = DESKTOP_PICKLE_OFFSET_Y[pickle.id]
  if (!offsetXDelta && !offsetYDelta) return pickle

  return {
    ...pickle,
    ...(offsetXDelta ? { offsetX: (pickle.offsetX ?? 0) + offsetXDelta } : {}),
    ...(offsetYDelta ? { offsetY: (pickle.offsetY ?? 0) + offsetYDelta } : {}),
  }
})

/** 모바일 — Figma cluster(0.76) + 중심 기준 15% 간격 확대 */
const MOBILE_PICKLE_POSITIONS = {
  'jar-1': { x: 52.0, y: 17.5 },
  'jar-2': { x: 61.0, y: 20.8 },
  'jar-3': { x: 27.9, y: 29.1 },
  'jar-4': { x: 39.9, y: 18.0 },
  'jar-5': { x: 46.8, y: 35.4 },
  'jar-6': { x: 63.0, y: 51.7 },
  'jar-7': { x: 67.0, y: 31.9 },
  'jar-8': { x: 29.1, y: 56.9 },
  'jar-9': { x: 40.5, y: 69.7 },
  'jar-10': { x: 55.2, y: 69.7 },
  'jar-11': { x: 49.3, y: 60.2 },
  'jar-12': { x: 26.3, y: 69.0 },
  'jar-13': { x: 40.5, y: 90.3 },
  'jar-14': { x: 67.6, y: 74.6 },
  'jar-15': { x: 57.2, y: 40.9 },
  'jar-17': { x: 36.9, y: 42.6 },
}

const MOBILE_SIZE_MULTIPLIER = 1.089

/** 모바일 — jar별 크기 보정 */
const MOBILE_PICKLE_SIZE_SCALE = {
  'jar-1': 1.3652,
  'jar-2': 0.95,
  'jar-4': 1.1328,
  'jar-5': 0.8983,
  'jar-6': 0.8846,
  'jar-7': 1.25,
  'jar-9': 0.9643,
  'jar-10': 1.015,
  'jar-11': 0.95,
  'jar-12': 0.9215,
  'jar-14': 0.97,
  'jar-13': 1.026,
  'jar-15': 0.95,
}

/** 모바일 — jar별 위치 보정 (px) */
const MOBILE_PICKLE_OFFSET_X = {
  'jar-6': 4,
  'jar-12': 3,
}

const MOBILE_PICKLE_OFFSET_Y = {
  'jar-1': -20,
  'jar-3': 3,
  'jar-5': -15,
  'jar-14': -10,
}

export const WORK_JAR_PICKLES_MOBILE = RAW_WORK_JAR_PICKLES.map((pickle) => {
  const pos = MOBILE_PICKLE_POSITIONS[pickle.id]
  const sizeScale = MOBILE_PICKLE_SIZE_SCALE[pickle.id] ?? 1
  const offsetXDelta = MOBILE_PICKLE_OFFSET_X[pickle.id]
  const offsetYDelta = MOBILE_PICKLE_OFFSET_Y[pickle.id]
  const offsetY = pickle.id === 'jar-13'
    ? -25
    : offsetYDelta
      ? (pickle.offsetY ?? 0) + offsetYDelta
      : pickle.offsetY
  const offsetX = offsetXDelta
    ? (pickle.offsetX ?? 0) + offsetXDelta
    : pickle.offsetX

  return {
    ...pickle,
    x: pos.x,
    y: pos.y,
    ...(offsetX != null ? { offsetX } : {}),
    ...(offsetY != null ? { offsetY } : {}),
    size: +scalePickleSize(
      pickle.src,
      pickle.size,
      MOBILE_SIZE_MULTIPLIER * sizeScale,
    ).toFixed(2),
    src: assetPath(pickle.src),
  }
})
