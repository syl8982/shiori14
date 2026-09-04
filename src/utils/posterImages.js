const posterImageModules = import.meta.glob('../../public/images/poster/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const POSTER_IMAGES = Object.entries(posterImageModules)
  .map(([path, url]) => ({
    src: url,
    name: path.split('/').pop() ?? path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  .slice(0, -1)
