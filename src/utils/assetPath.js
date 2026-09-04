/** public/ 자산 경로 — Vite base(GitHub Pages 등) 반영 */
export function assetPath(path) {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalized}`
}
