import './Home.css'
import SideNav from '../components/SideNav'
import Credits from '../components/Credits'
import PickleGraphic from '../components/PickleGraphic'
import { PickleMotionProvider } from '../components/PickleMotionProvider'
import { PARTICIPANT_NAMES } from '../data/artists'
import { FOOTER_PICKLE_GRAPHIC, MAIN_PICKLE_GRAPHICS } from '../data/pickleGraphics'
import { POSTER_IMAGES } from '../utils/posterImages'

const participants = PARTICIPANT_NAMES

function Home() {
  return (
    <PickleMotionProvider className="home">
      <section className="home__main" aria-label="메인">
        <div className="home__main-bg" aria-hidden="true">
          <img src="/images/backgroundlayer.png" alt="" />
        </div>

        <div className="home__main-center">
          <div className="home__graphic-composition">
            {MAIN_PICKLE_GRAPHICS.map((graphic) => (
              <PickleGraphic key={graphic.id} {...graphic} />
            ))}
            <img
              className="home__main-graphic"
              src="/images/title2.png"
              alt="네, 피클 듣는 중입니다"
            />
          </div>

          <div className="home__posters">
            {POSTER_IMAGES.map((poster) => (
              <div key={poster.src} className="home__poster-frame">
                <img
                  className="home__poster"
                  src={poster.src}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="home__main-header">
          <SideNav />
        </div>

        <Credits className="home__credits" />
      </section>

      <footer className="home__footer">
        <PickleGraphic {...FOOTER_PICKLE_GRAPHIC} />
        <div className="home__footer-body">
          <div className="home__footer-info">
            <p className="home__footer-title">
              홍익대학교 예술전시기획 소모임 시오:리 정기전 &lt;네, 피클 듣는 중입니다&gt; 아카이브 웹사이트
            </p>
            <p className="home__footer-subtitle">
              Archive Website for 14th Exhibition of SHIO:RI, Hongik University Art Exhibition Planning Collective
            </p>
            <p className="home__participants">
              <span className="home__participants-label">14기 참여진</span>
              {' '}
              {participants.join(' ')}
            </p>
          </div>

          <hr className="home__divider" />

          <div className="home__contact">
            <div className="home__contact-group">
              <a href="mailto:shiori2019@gmail.com">shiori2019@gmail.com</a>
              <a href="https://instagram.com/shiori_hgart" target="_blank" rel="noreferrer">
                @shiori_hgart
              </a>
            </div>
            <p className="home__copyright">© 2026 SHIO:RI 14th. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PickleMotionProvider>
  )
}

export default Home
