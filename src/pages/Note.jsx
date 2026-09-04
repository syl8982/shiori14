import PageShell from '../components/PageShell'
import ScatteredGallery from '../components/ScatteredGallery'
import { loadNoteLayout } from '../utils/noteImages'
import './SubPageLayout.css'

function Note() {
  return (
    <PageShell contentClassName="subpage__content subpage__content--page">
      <h1 className="page-content__title">작가 노트</h1>

      <div className="subpage__body">
        <p className="subpage__text">전시를 준비하는 과정에서 작성된 작가노트 일부</p>
      </div>

      <ScatteredGallery loadLayout={loadNoteLayout} ariaLabel="작가 노트 갤러리" />
    </PageShell>
  )
}

export default Note
