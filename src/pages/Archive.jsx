import PageShell from '../components/PageShell'
import ScatteredGallery from '../components/ScatteredGallery'
import { loadArchiveLayout } from '../utils/archiveImages'
import './SubPageLayout.css'

function Archive() {
  return (
    <PageShell contentClassName="subpage__content subpage__content--page">
      <h1 className="page-content__title">아카이브 사진</h1>
      <ScatteredGallery loadLayout={loadArchiveLayout} ariaLabel="아카이브 사진 갤러리" />
    </PageShell>
  )
}

export default Archive
