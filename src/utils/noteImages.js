import {
  buildEntriesFromGlob,
  createGalleryLoaderFromEntries,
} from './scatteredGalleryLayout'

const notes1ImageModules = import.meta.glob('../../public/images/notes/notes1/*.{jpg,jpeg,JPG,JPEG,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const notesRootImageModules = import.meta.glob('../../public/images/notes/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const noteEntries = [
  ...buildEntriesFromGlob(notes1ImageModules),
  ...buildEntriesFromGlob(notesRootImageModules),
]

export const loadNoteLayout = createGalleryLoaderFromEntries(noteEntries, 17)
