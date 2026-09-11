/** slug → public/images/work/{folder} 이미지 (최대 3장)
 *
 * files 항목 — 문자열(파일명) 또는 객체:
 * { file, webFile?, alt?, objectPosition?, scale? }
 * webFile — public/images/work-web/{folder}/ 웹용 이미지 (원본 보존)
 */

import { assetPath } from '../utils/assetPath'

const WORK_IMAGE_MANIFEST = {
  kangmingyo: {
    folder: '강민교',
    files: ['강민교_1.jpg', '강민교_2.jpg', '강민교_3.jpg'],
  },
  kimjio: {
    folder: '김지오',
    files: [
      { file: '김지오_1.png', webFile: '김지오_1.webp' },
      { file: '김지오_2.png', webFile: '김지오_2.webp' },
    ],
  },
  kimharang: {
    folder: '김하랑',
    files: ['김하랑_1.jpg', '김하랑_2.jpg'],
  },
  parkseoyoung: {
    folder: '박서영',
    files: ['박서영_1.JPG', '박서영_2.JPG', '박서영_3.JPG'],
  },
  parkchaeryeong: {
    folder: '박채령',
    files: ['박채령_1.JPG', '박채령_2.JPG', '박채령_3.JPG'],
  },
  baejuhee: {
    folder: '배주희',
    files: ['배주희_1.JPG', '배주희_2.png'],
  },
  seoyelim: {
    folder: '서예림',
    files: ['서예림_1.JPG', '서예림_2.JPG', '서예림_3.JPG'],
  },
  leegaeun: {
    folder: '이가은',
    files: ['이가은_1.JPG', '이가은_2.JPG', '이가은_3.JPG'],
  },
  leeseunghyeon: {
    folder: '이승현',
    files: ['이승현_1.jpg', '이승현_2.jpg'],
  },
  imseol: {
    folder: '임설',
    files: ['임설_2.JPG', '임설_1.JPG'],
  },
  jeonsohyeon: {
    folder: '전소현',
    files: ['전소현_1.JPG', '전소현_2.JPG', '전소현_3.JPG'],
  },
  jeongsua: {
    folder: '정수아',
    files: ['정수아_1.JPG', '정수아_2.JPG', '정수아_3.JPG'],
  },
  jeonginu: {
    folder: '정인우',
    files: ['정인우_1.JPG', '정인우_2.JPG', '정인우_3.JPG'],
  },
  'joyeonu-jeonginu': {
    folder: '정인우조연우',
    files: ['정인우조연우_1.jpg', '정인우조연우_2.jpg', '정인우조연우_3.jpg'],
  },
  haneungyeong: {
    folder: '한은경',
    files: ['한은경_1.JPG', '한은경_2.JPG', '한은경_3.JPG'],
  },
  hwangdayeon: {
    folder: '황다연',
    files: ['황다연_1.JPG', '황다연_2.JPG', '황다연_3.JPG'],
  },
}

function workImagePath(folder, filename) {
  const normalizedFolder = folder.normalize('NFC')
  const normalizedFilename = filename.normalize('NFC')
  return assetPath(
    `/images/work/${encodeURIComponent(normalizedFolder)}/${encodeURIComponent(normalizedFilename)}`,
  )
}

function workWebImagePath(folder, filename) {
  const normalizedFolder = folder.normalize('NFC')
  const normalizedFilename = filename.normalize('NFC')
  return assetPath(
    `/images/work-web/${encodeURIComponent(normalizedFolder)}/${encodeURIComponent(normalizedFilename)}`,
  )
}

function normalizeWorkImageEntry(folder, entry) {
  if (typeof entry === 'string') {
    return { src: workImagePath(folder, entry), alt: '' }
  }

  const {
    file,
    webFile,
    src,
    alt = '',
    objectPosition,
    scale,
  } = entry

  const image = {
    src: src ?? (webFile ? workWebImagePath(folder, webFile) : workImagePath(folder, file)),
    alt,
  }

  if (objectPosition != null) image.objectPosition = objectPosition
  if (scale != null) image.scale = scale

  return image
}

export function getWorkImagesBySlug(slug) {
  const entry = WORK_IMAGE_MANIFEST[slug]
  if (!entry) return []

  return entry.files.map((fileEntry) => normalizeWorkImageEntry(entry.folder, fileEntry))
}

/** artists.js galleryImages 옵션을 workImages 순서에 맞게 병합 */
export function mergeWorkImageOptions(images, options = []) {
  if (!options.length) return images

  return images.map((image, index) => {
    const option = options[index]
    if (!option) return image
    return { ...image, ...option }
  })
}

