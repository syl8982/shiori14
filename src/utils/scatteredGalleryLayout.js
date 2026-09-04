const GAP_CQW = 3

function pseudo(index, channel = 0, seedOffset = 0) {
  const x = Math.sin((index + 1 + seedOffset) * 127.1 + channel * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function rectsOverlap(leftA, topA, widthA, heightA, leftB, topB, widthB, heightB, gap) {
  return (
    leftA < leftB + widthB + gap &&
    leftA + widthA + gap > leftB &&
    topA < topB + heightB + gap &&
    topA + heightA + gap > topB
  )
}

function findNonOverlappingTop(left, width, height, placed, gap) {
  let top = 0
  let adjusted = true

  while (adjusted) {
    adjusted = false
    for (const item of placed) {
      if (rectsOverlap(left, top, width, height, item.leftPercent, item.topCqw, item.widthPercent, item.heightCqw, gap)) {
        top = item.topCqw + item.heightCqw + gap
        adjusted = true
      }
    }
  }

  return top
}

export function buildEntriesFromGlob(imageModules) {
  return Object.entries(imageModules)
    .map(([path, url]) => ({
      src: url,
      name: path.split('/').pop() ?? path,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

export function buildScatteredLayout(entries, seedOffset = 0) {
  const placed = []

  const items = entries.map((entry, index) => {
    const widthPercent = 50 + pseudo(index, 0, seedOffset) * 38
    const maxLeft = Math.max(0, 100 - widthPercent - 2)
    const leftPercent = pseudo(index, 1, seedOffset) * maxLeft
    const heightCqw = widthPercent * entry.aspectRatio
    const topCqw = findNonOverlappingTop(leftPercent, widthPercent, heightCqw, placed, GAP_CQW)

    const item = {
      ...entry,
      leftPercent,
      topCqw,
      widthPercent,
      heightCqw,
    }

    placed.push(item)
    return item
  })

  return { items }
}

function loadImageAspectRatio(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.naturalHeight / img.naturalWidth)
    img.onerror = () => resolve(1.33)
    img.src = src
  })
}

export function createGalleryLoaderFromEntries(entries, seedOffset = 0) {
  let layoutPromise = null

  return function loadGalleryLayout() {
    if (!layoutPromise) {
      layoutPromise = Promise.all(
        entries.map(async (entry) => ({
          ...entry,
          aspectRatio: await loadImageAspectRatio(entry.src),
        })),
      ).then((entriesWithAspect) => buildScatteredLayout(entriesWithAspect, seedOffset))
    }

    return layoutPromise
  }
}

export function createGalleryLoader(imageModules, seedOffset = 0) {
  return createGalleryLoaderFromEntries(buildEntriesFromGlob(imageModules), seedOffset)
}
