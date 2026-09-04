import '../pages/Home.css'
import './PageShell.css'
import SideNav from './SideNav'

function PageShell({ title, children, contentClassName = '', decoration = null }) {
  return (
    <main className="home">
      <section className="home__main home__main--page" aria-label="페이지">
        {decoration}
        <div className="home__main-header">
          <SideNav />
        </div>

        <div className={`page-content ${contentClassName}`.trim()}>
          {children ?? <h1 className="page-content__title">{title}</h1>}
        </div>
      </section>
    </main>
  )
}

export default PageShell
