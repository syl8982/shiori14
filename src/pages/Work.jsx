import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { getArtistBySlug, getArtistSlugByJarId } from '../data/artists'
import { PICKLE_LABEL_CENTER, WORK_JAR_PICKLES, WORK_JAR_PICKLES_MOBILE } from '../data/workJarPickles'
import { assetPath } from '../utils/assetPath'
import './SubPageLayout.css'
import './Work.css'

const PICKLE_LABEL_OFFSET_X = {
  parkseoyoung: 0,
  parkchaeryeong: 0.5,
  baejuhee: 0.5,
  hwangdayeon: -8,
  leegaeun: 2,
  leeseunghyeon: 2,
  jeonsohyeon: 2,
  haneungyeong: 2,
  'joyeonu-jeonginu': -10,
}

const MOBILE_PICKLE_LABEL_OFFSET_X = {
  parkseoyoung: -1,
  parkchaeryeong: -0.5,
  baejuhee: -0.5,
  hwangdayeon: -1,
  haneungyeong: -1,
}

const PICKLE_LABEL_OFFSET_Y = {
  hwangdayeon: -8,
  'joyeonu-jeonginu': -8,
}

const MOBILE_PICKLE_LABEL_OFFSET_Y = {
  haneungyeong: -1,
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
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
  const isMobile = useIsMobile()

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
                    '--pickle-label-offset-x': slug
                      ? `${(isMobile ? MOBILE_PICKLE_LABEL_OFFSET_X[slug] : PICKLE_LABEL_OFFSET_X[slug]) ?? 0}px`
                      : '0px',
                    '--pickle-label-offset-y': slug
                      ? `${(isMobile ? MOBILE_PICKLE_LABEL_OFFSET_Y[slug] : PICKLE_LABEL_OFFSET_Y[slug]) ?? 0}px`
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
    />
  )
}

export default Work
