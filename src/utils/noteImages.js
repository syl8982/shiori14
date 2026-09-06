import { NOTE_GALLERY_ENTRIES } from '../data/noteGalleryEntries'
import { assetPath } from './assetPath'
import { createGalleryLoaderFromEntries } from './scatteredGalleryLayout'

const entries = NOTE_GALLERY_ENTRIES.map(({ name, src, aspectRatio }) => ({
  name,
  src: assetPath(src),
  aspectRatio,
}))

export const loadNoteLayout = createGalleryLoaderFromEntries(entries, 17)
