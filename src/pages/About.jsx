import PageShell from '../components/PageShell'
import './SubPageLayout.css'
import './About.css'

function About() {
  return (
    <PageShell contentClassName="subpage__content">
      <h1 className="page-content__title">소개</h1>

      <div className="about__intro">
        <p className="about__text">
          시오리는 홍익대학교 미술대학 소속 공식 예술전시 기획 소모임입니다. 미술대학 내 다양한 전공을 가진 작가들과의 활발한 커뮤니케이션을 통해 시너지를 일으키고, 개개인의 작업 세계 구축에 있어 효과적인 발전을 도모합니다.
        </p>
        <p className="about__text about__text--en">
          SHIO:RI is an official art exhibition planning collective affiliated with the College of Fine Arts at Hongik University. Through active exchange with artists from diverse disciplines within the college, the group cultivates synergy and encourages the development of each artist&apos;s individual practice.
        </p>
      </div>

      <div className="about__history">
        <p className="about__text">
          2019년에 창설된 시오:리는 현재까지 총 14번의 전시를 개최하였습니다.
        </p>
        <p className="about__text about__text--en">
          Founded in 2019, SHIO:RI has presented fourteen exhibitions to date.
        </p>
      </div>

      <div className="about__name-section">
        <div className="about__name-labels">
          <p>시오리</p>
          <p>SHIO:RI</p>
          <p>15.ri</p>
        </div>

        <div className="about__name-icon" aria-hidden="true" />

        <div className="about__name-detail">
          <p className="about__text">: &apos;십 오리&apos;의 순 우리말</p>
          <p className="about__text">
            : 부원 개개인이 구축해 온, 그리고 함께 확장해나갈 작업 세계 상징
          </p>
          <p className="about__name-heading">십리에 오리를 더한 거리</p>
          <p className="about__text">
            짧다고 보면 짧을 수 있는 거리인 십리. 우리들의 길을 걸어가는 중 쉬었다가 가는 중간 지점인 시오리에서 자신만의 작업을 해나가자라는 의미입니다.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

export default About
