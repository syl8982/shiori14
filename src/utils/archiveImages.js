import { createGalleryLoader } from './scatteredGalleryLayout'

const archiveImageModules = import.meta.glob('../../public/images/archive/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const loadArchiveLayout = createGalleryLoader(archiveImageModules, 0)
