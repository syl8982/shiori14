import { ARCHIVE_GALLERY_ENTRIES } from '../data/archiveGalleryEntries'
import { assetPath } from './assetPath'
import { createGalleryLoaderFromEntries } from './scatteredGalleryLayout'

const entries = ARCHIVE_GALLERY_ENTRIES.map(({ name, src, aspectRatio }) => ({
  name,
  src: assetPath(src),
  aspectRatio,
}))

export const loadArchiveLayout = createGalleryLoaderFromEntries(entries, 0)
