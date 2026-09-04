import PageShell from '../components/PageShell'
import './SubPageLayout.css'

function Prologue() {
  return (
    <PageShell contentClassName="subpage__content">
      <h1 className="page-content__title">서문</h1>

      <div className="subpage__body">
        <p className="subpage__text">
          《네, 피클 듣는 중입니다》는 관계와 듣기에 관한 단체기획전이다. 재료들이 서로 만나 농도를 공유함으로써 완성되는 피클과 같이, 듣기는 타자의 존재를 받아들이고 서로의 영향을 허용하는 과정이다. 전시에 참여하는 작가진은 듣기를 말하기에 후행하는 수동적이고 이차적인 행위가 아니라 세계와 관계 맺기 위한 적극적인 태도로 바라본다.
        </p>
        <p className="subpage__text">
          우리는 들리는 것을 듣기도, 듣고 싶은 걸 듣기도 한다. 이와 같은 듣기의 이중성은 관계의 가능성으로 이어진다. 듣는다는 건 판단 이전에 외부의 존재를 받아들이는 일이기 때문이다.
        </p>
        <p className="subpage__text">
          우리는 들은 적 없지만 이미 관계 맺고 있던 것에 의식적으로 주목하고자 한다. 개별 작업은 무엇을 그들의 목소리로 인식할 것인지에서부터 출발한다. 말하는 이가 있어야만 들을 수 있다는 전제를 잠시 내려놓고, 말 없이도 형성된 고유한 마찰에 귀 기울이려 한다. 우리의 작품 제작 과정은 나의 언어로 소통하지 않는 어떤 세계를 상상하고, 그 세계 속의 발화자를 찾는 여정이다. 전시는 각자의 관계가 이끄는 방향으로 이동하여 듣기를 시작한다.
        </p>
      </div>
    </PageShell>
  )
}

export default Prologue
