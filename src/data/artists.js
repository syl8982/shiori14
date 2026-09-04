/**
 * 작가 · 작업 페이지 데이터
 *
 * layout         — 갤러리 레이아웃 (portrait | landscape | row)
 * galleryAspect  — row: 프레임 또는 갤러리 전체 비율 (CSS aspect-ratio 값)
 * galleryColumns — row: 열 비율 (예: '4fr 3fr', '7fr 4fr 4fr') — 설정 시 split 레이아웃 (2·3장)
 * galleryImages  — workImages 순서와 1:1, 이미지별 crop 옵션
 *   objectPosition — CSS object-position (기본 center center)
 *   scale          — 확대 배율 (기본 1, overflow hidden으로 프레임 내 clip)
 *
 * work.title      — 작업 제목
 * work.nameEn     — 영문 이름
 * work.contact    — 인스타 / 이메일 (슬래시로 구분, 4열 원문)
 * work.paragraphs — 작업 설명 본문
 *
 * 이미지: public/images/work/{작가폴더}/ — workImages.js 참고
 */

const ARTIST_WORK = {
  kangmingyo: {
    title: '계란에 수염 그린다고 사람이 되랴',
    nameEn: 'Kang Minkyo',
    contact: '@eogeumniii',
    paragraphs: [
      '우리는 콤플렉스를 감추려 뭔가를 뒤집어쓴다. 하지만 이 작품은 그 가림을 어둡게 다루지 않는다. 가릴수록 우스꽝스러워지고, 우스꽝스러움 속에서 사랑스럽다. 콤플렉스는 극복해야 할 문제가 아니라, 나의 일부다.',
    ],
  },
  kimjio: {
    title: '추의 기억은 땅을 지나간다',
    nameEn: 'Kim Zio',
    contact: '@kim210walker',
    paragraphs: [
      '‘듣는다’는 개념을 동작으로 확장하며, 걷는 행위 자체를 하나의 청취로 바라보았다. 발이 땅에 닿고 떨어지는 반복은 단순한 이동이 아니라 땅과 감각을 주고받는 과정이며, 그 순간 땅과 나는 분리된 존재가 아닌 즉흥적인 몸짓의 듀엣을 이룬다. 발에 달린 추처럼 우리는 규칙적인 듯 끊임없이 불규칙한 움직임을 반복하고, 그 움직임 속에서 끊임없이 땅에 말을 건네고, 동시에 그 소리를 듣는다.',
    ],
  },
  kimharang: {
    title: '메아리의 층',
    nameEn: 'Kim Harang',
    contact: 'lanqha@naver.com',
    paragraphs: [
      '하나의 형태는 여러 겹의 윤곽으로 남는다. 서로 다른 재료가 시간과 공간 속에서 겹쳐지며 하나의 메아리를 만든다. 형태는 사라져도 흔적은 축적되고, 남겨진 잔향은 새로운 관계를 형성한다.',
    ],
  },
  parkseoyoung: {
    title: '방귀를 위한 공간은 없다',
    nameEn: 'Park Seoyoung',
    contact: '@ikkiparki / @postural.010',
    paragraphs: [
      '정해진 형태도 크기도 없으며 끊임없이 움직이는 것을 조각으로 만들기. 신경질적이고 가벼우며 스치듯 미지근한 애정을 느끼게 하는 조각.',
    ],
  },
  parkchaeryeong: {
    title: '어긋살기',
    nameEn: 'Park Chaeryeong',
    contact: '@asteriskryeong / sksmsqkrcofud3012@naver.com',
    paragraphs: [
      '대상은 특정되지 않고 뒤틀려 우리에게 인식된다. 그 자연스런 인식 과정 속에서 발생하는 어긋남이 실체화 될 때, 비로소 관계가 형성된다. 듣기는 결국 이 과정을 말한다. 일방적 어긋남 듣기가 이 작품을 말하고 있다.',
    ],
  },
  baejuhee: {
    title: 'breath, echo, align, duet',
    nameEn: 'Bae Juhee',
    contact: '@apckfnsznc',
    paragraphs: [
      '악기와 연주자는 끊임없는 대화를 통해서만 하나의 시를 완성할 수 있다. 서로를 마주하고, 충돌하고, 받아들이며 하나가 되는 합일의 과정에서 우리는 손을 통해서 교차하는 새로운 형태의 언어를 체득한다. 이 책은 무수하게 만들어지는 그들의 고유한 대화들 중 하나를 번역해 실었다.',
    ],
  },
  seoyelim: {
    title: '추측할 수만 있을 뿐',
    nameEn: 'Seo Yelim',
    contact: '@wonkotteg',
    paragraphs: [
      '말할 수 없는 것을 어떻게 전달하고, 들을 수 있을까. 이 작업은 몸짓, 응시, 침묵과 같은 비언어적 표현을 하나의 말하기이자 듣기로 바라본다. 영상과 소리, 텍스트는 각각 불완전한 단서로 존재하며, 관람자는 이를 종합해 의미를 구성한다. 그러나 그 의미는 완전한 이해에 이르지 않고, 각자의 추측으로 남는다.',
    ],
  },
  leegaeun: {
    title: 'Surd',
    nameEn: 'Lee Gaeun',
    contact: 'jennylee05@naver.com / @silvery_avenue',
    paragraphs: [
      '소음은 모든 주파수를 동시에 담아 서로를 상쇄하는, 백색의 상태이다. 아무것도 특정되지 않은 채 모든 것을 받아들이는, 무리수의 상태를 듣기의 조건으로 삼는다. 발화하지 않는 것을 듣는다는 것은 의미로 응결되기 이전, 언어화되지 않는 박동, 액체 상태의 진동에 귀를 대어보는 일이다.',
    ],
  },
  leeseunghyeon: {
    title: '일단 좀 앉아봐',
    nameEn: 'Lee Seunghyeon',
    contact: '@batteryoolalamode',
    paragraphs: [
      '내가 누구게? 모든 것은 쉬지 않고 이야기를 쏟는다. 읽히는 만큼 전부 읽어도 들리는 만큼 전부 들어도 너희는 누군지 모를걸.',
    ],
  },
  imseol: {
    title: '대화;對話',
    nameEn: 'Lim Seol',
    contact: '@someeworks',
    paragraphs: [
      '대화는 몸과 시선의 기류와 같은 감각을 뒤흔든다. 본 작품은 특정 사건의 재현이 아닌 대화가 환경을 오염시키고 다시 정리하는 과정에서 생기는 잔향의 지도이다. 연필은 밑그림이 아닌 결과를 덧씌우는 행위로 작용하며 원인과 결과의 순서가 뒤집힌 기록으로 읽힌다.',
    ],
  },
  jeonsohyeon: {
    title: '기댄 채로',
    nameEn: 'Jeon Sohyun',
    contact: 'sohyun.archivezip/ ssosossos@naver.com',
    paragraphs: [
      '이 조각들은 서로에게 기대어 있을 때에만 형태를 유지한다. 기대는 행위는 돌봄이자 의지가 되고 동시에 부담과 책임이 되기도 한다. 서로를 지탱하는 이유는 애정일 수도 습관이나 의무일 수도 있다. 그 모호한 경계 속에서 관계는 지속되며, 이 작업은 관계를 이루는 보이지 않는 긴장과 균형을 감각하고자 하는 시도이다.',
    ],
  },
  jeongsua: {
    title: '( ( ( 0 ) ) )',
    nameEn: 'Jeong SooA',
    contact: '@jseratiitarai',
    paragraphs: ['그렇게 같아지는 것이다'],
  },
  jeonginu: {
    title: '기-우리기',
    nameEn: 'Jung Inwoo',
    contact: '@wooneunsaram',
    paragraphs: [
      '기-우리기, 기울이기, 마주하기.',
      '안내사항을 따라하세요.',
    ],
  },
  'joyeonu-jeonginu': {
    title: '틈판 틈쇄',
    nameEn: 'Cho Yeonwoo · Jung Inwoo',
    contact: '@whndsud / @wooneunsaram',
    paragraphs: [
      '한 번 낸 책은 내용을 바꿀 수 없기 때문에 판을 바꾸어 재출간하고는 한다. 1판이 나온 뒤 개정판이 나올 때까지, 저자와 읽는 이 모두 오류 지점을 감당해야 한다. 오류를 견디는 시간 동안 우리는 어떤 모습일까. 스스로와 세계에 대한 개정되지 않은 정보를 어떻게 받아들이고 언어화할까.',
    ],
  },
  haneungyeong: {
    title: '뽁뽁뽁뽁뽁뽁뽁뽁뽁',
    nameEn: 'Han Eunkyeong',
    contact: '@2phmrn / heksilverbible@gmail.com',
    paragraphs: [],
  },
  hwangdayeon: {
    title: '선물 받은 온기인 양',
    nameEn: 'Hwang Dayeon',
    contact: '@hwanginso0n',
    paragraphs: [
      '폭력 사건으로 박힌 바늘들과 강압적인 마찰들로 뜨겁게 달궈진 귀를 선물받은 온기인 양 손바닥으로 덮고서는, 바늘이 솜털인 양 날아가지 않게 덮고 간직하려는 바보 같은 미련한 짓거리',
    ],
  },
}

/**
 * layout — 갤러리 레이아웃
 *   portrait  — 기본 (3장: 세로형 그리드 / 2장: 세로 2열 span)
 *   landscape — 3장: 왼쪽 대형 + 오른쪽 2장 위아래 (가로형)
 *   row       — 2장: 가로 1행
 *
 * galleryAspect — row 레이아웃 등에서 각 프레임 비율 (CSS aspect-ratio 값)
 */
const ARTIST_PROFILES = [
  { slug: 'kangmingyo', name: '강민교', layout: 'portrait' },
  { slug: 'kimjio', name: '김지오', layout: 'row', galleryAspect: '6124 / 4375' },
  { slug: 'kimharang', name: '김하랑', layout: 'portrait' },
  { slug: 'parkseoyoung', name: '박서영', layout: 'portrait' },
  { slug: 'parkchaeryeong', name: '박채령', layout: 'portrait' },
  { slug: 'baejuhee', name: '배주희', layout: 'portrait' },
  { slug: 'seoyelim', name: '서예림', layout: 'portrait', galleryImages: [
    { objectPosition: 'center 60%' },
    {},
    {},
  ] },
  { slug: 'leegaeun', name: '이가은', layout: 'landscape' },
  { slug: 'leeseunghyeon', name: '이승현', layout: 'row', galleryAspect: '3 / 2' },
  { slug: 'imseol', name: '임설', layout: 'row', galleryAspect: '3 / 2' },
  {
    slug: 'jeonsohyeon',
    name: '전소현',
    layout: 'row',
    galleryColumns: '7fr 4fr 4fr',
    galleryAspect: '5 / 2',
    galleryImages: [
      { objectPosition: '60% bottom', scale: 1.01 },
      { objectPosition: 'center bottom' },
      { objectPosition: 'center bottom' },
    ],
  },
  { slug: 'jeongsua', name: '정수아', layout: 'landscape', galleryImages: [
    {},
    { objectPosition: 'center 80%', scale: 1.1 },
    { objectPosition: 'center 50%', scale: 1.1 },
  ] },
  {
    slug: 'joyeonu-jeonginu',
    name: '조연우·정인우',
    layout: 'portrait',
    galleryImages: [
      {},
      { objectPosition: 'center 90%', scale: 1.1 },
      {},
    ],
  },
  { slug: 'jeonginu', name: '정인우', layout: 'portrait' },
  { slug: 'haneungyeong', name: '한은경', layout: 'landscape' },
  { slug: 'hwangdayeon', name: '황다연', layout: 'portrait' },
].map((profile) => ({
  ...profile,
  work: ARTIST_WORK[profile.slug],
}))

/** 16개 피클 → 작가 slug (피클마다 명시적 매핑) */
const JAR_ARTIST_SLUG = {
  'jar-1': 'kangmingyo',
  'jar-2': 'kimjio',
  'jar-3': 'kimharang',
  'jar-4': 'parkseoyoung',
  'jar-5': 'parkchaeryeong',
  'jar-6': 'seoyelim',
  'jar-7': 'baejuhee',
  'jar-8': 'leegaeun',
  'jar-9': 'leeseunghyeon',
  'jar-10': 'imseol',
  'jar-11': 'jeonsohyeon',
  'jar-12': 'jeongsua',
  'jar-13': 'joyeonu-jeonginu',
  'jar-14': 'jeonginu',
  'jar-15': 'haneungyeong',
  'jar-17': 'hwangdayeon',
}

export const ARTISTS = Object.entries(JAR_ARTIST_SLUG).map(([jarId, slug]) => {
  const profile = ARTIST_PROFILES.find((artist) => artist.slug === slug)
  return {
    jarId,
    slug,
    name: profile.name,
    work: profile.work,
  }
})

export const PARTICIPANT_NAMES = [
  '강민교', '김지오', '김하랑', '박서영', '박채령', '배주희', '서예림',
  '이가은', '이승현', '임설', '전소현', '정수아', '정인우', '조연우',
  '한은경', '황다연',
]

const artistBySlug = Object.fromEntries(ARTIST_PROFILES.map((profile) => [profile.slug, profile]))

export function getArtistSlugByJarId(jarId) {
  return JAR_ARTIST_SLUG[jarId]
}

export function getArtistBySlug(slug) {
  return artistBySlug[slug]
}
