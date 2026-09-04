import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { getArtistBySlug, getArtistSlugByJarId } from '../data/artists'
import { PICKLE_LABEL_CENTER, WORK_JAR_PICKLES, WORK_JAR_PICKLES_MOBILE } from '../data/workJarPickles'
import { assetPath } from '../utils/assetPath'
import './SubPageLayout.css'
import './Work.css'

const PICKLE_LABEL_OFFSET_X = {
  parkseoyoung: 1,
  parkchaeryeong: 1,
  baejuhee: 1,
  hwangdayeon: -8,
  leegaeun: 2,
  leeseunghyeon: 2,
  jeonsohyeon: 2,
  haneungyeong: 2,
  'joyeonu-jeonginu': -10,
}

const PICKLE_LABEL_OFFSET_Y = {
  hwangdayeon: -8,
  'joyeonu-jeonginu': -8,
}

function useMobileJarPickles() {
  const [pickles, setPickles] = useState(WORK_JAR_PICKLES)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => {
      setPickles(mq.matches ? WORK_JAR_PICKLES_MOBILE : WORK_JAR_PICKLES)
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return pickles
}

function Work() {
  const jarPickles = useMobileJarPickles()

  return (
    <PageShell
      decoration={(
        <div className="work__pickle-bg">
          <div className="work__jar-composition">
            <img className="work__jar-bg" src={assetPath('/images/picklebg.png')} alt="" aria-hidden="true" />
            {jarPickles.map((pickle) => {
              const slug = getArtistSlugByJarId(pickle.id)
              const artist = slug ? getArtistBySlug(slug) : null
              const labelCenter = PICKLE_LABEL_CENTER[pickle.src] ?? { x: 0, y: 0 }

              return (
                <Link
                  key={pickle.id}
                  to={slug ? `/work/${slug}` : '/work'}
                  className="work__jar-pickle-link"
                  aria-label={artist ? `${artist.name} 작업 보기` : '작업'}
                  style={{
                    '--pickle-x': `${pickle.x}%`,
                    '--pickle-y': `${pickle.y}%`,
                    '--pickle-size': `${pickle.size}%`,
                    '--pickle-offset-x': pickle.offsetX ? `${pickle.offsetX}px` : '0px',
                    '--pickle-offset-y': pickle.offsetY ? `${pickle.offsetY}px` : '0px',
                    '--pickle-mask': `url(${pickle.src})`,
                    '--pickle-label-x': `${labelCenter.x}%`,
                    '--pickle-label-y': `${labelCenter.y}%`,
                    '--pickle-label-offset-x': slug && PICKLE_LABEL_OFFSET_X[slug]
                      ? `${PICKLE_LABEL_OFFSET_X[slug]}px`
                      : '0px',
                    '--pickle-label-offset-y': slug && PICKLE_LABEL_OFFSET_Y[slug]
                      ? `${PICKLE_LABEL_OFFSET_Y[slug]}px`
                      : '0px',
                    zIndex: pickle.z,
                  }}
                >
                  <span className="work__jar-pickle-visual">
                    <img
                      className="work__jar-pickle"
                      src={pickle.src}
                      alt=""
                    />
                    {artist ? (
                      <>
                        <span className="work__jar-pickle-overlay" aria-hidden="true">
                          <span className="work__jar-pickle-overlay-fill" />
                        </span>
                        <span className="work__jar-pickle-label" aria-hidden="true">
                          {artist.name}
                        </span>
                      </>
                    ) : null}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
      contentClassName="subpage__content subpage__content--page subpage__content--work"
    >
      <h1 className="page-content__title">작업</h1>
    </PageShell>
  )
}

export default Work
