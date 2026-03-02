import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('../src/content/posts/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const coverPool = [
  { img: '/images/post-stock.jpg', credit: 'Unsplash (free photos)', url: 'https://unsplash.com' },
  { img: '/images/hero-stock.jpg', credit: 'Unsplash (free photos)', url: 'https://unsplash.com' },
  { img: '/images/post-placeholder.webp', credit: 'Placeholder', url: 'https://unsplash.com' },
];

const posts = [
  {
    file: '2026-03-02-budget-reset.md',
    title: '월초 30분 “예산 리셋”으로 돈이 남는 구조 만들기',
    tags: ['saving', 'budgeting', 'consumption'],
    description: '월초 30분만 투자해 고정비·변동비·비상금·목표지출을 재정렬하는 예산 리셋 루틴. 카드/계좌/구독을 한 번에 정리하는 실전 가이드.',
    body: `월말이 되면 항상 돈이 없고, “이번 달은 왜 이렇게 많이 썼지?”라는 느낌만 남는다면 문제는 의지가 아니라 **시스템**입니다.\n\n이 글은 월초에 딱 30분만 투자해서 ‘돈이 남는 구조’를 다시 세팅하는 **예산 리셋 루틴**을 정리합니다.\n\n## 준비물(3분)\n- 지난달 카드/계좌 결제 내역(앱으로 OK)\n- 이번 달 캘린더(큰 일정만)\n- 메모지 1장(또는 노트 앱)\n\n## 1단계: 고정비부터 잠그기(7분)\n고정비는 “매달 자동으로 빠져나가는 돈”이라서, 여기서 새면 계속 셉니다.\n\n- 통신/인터넷\n- 구독(영상/음악/앱/클라우드)\n- 보험\n- 교통 정기권\n- 주거비(관리비 포함)\n\n**규칙:** 고정비는 ‘줄일 수 있냐’가 아니라 ‘지금도 쓰고 있냐’가 기준입니다.\n\n## 2단계: 변동비를 4개 바구니로 쪼개기(8분)\n변동비는 보통 “카테고리가 너무 많아서” 관리가 안 됩니다. 아래 4개로만 나눠도 통제가 됩니다.\n\n1) 식비(장보기/배달/외식)\n2) 생활(생필품/소모품)\n3) 이동(주유/택시/대중교통)\n4) 즐거움(취미/쇼핑/카페/술)\n\n지난달 내역을 보면서 대략 비율만 잡으세요. 정밀 회계가 아니라 **핵심은 ‘틀’**입니다.\n\n## 3단계: 목표지출 1개를 고정비처럼 취급(5분)\n돈이 남는 사람은 목표지출을 ‘남으면 하는 것’이 아니라 **먼저 빼는 것**으로 취급합니다.\n\n- 비상금\n- 투자\n- 여행\n- 교육\n\n이번 달은 1개만 선택하고, 금액은 작게 시작하세요(예: 3만~10만).\n\n## 4단계: 카드/계좌 동선을 단순화(5분)\n- 카드 2장 원칙: 주카드 1 + 비상/해외 1\n- 자동이체 계좌 1개 고정\n- 체크포인트: 결제일/출금일이 제각각이면 관리 난이도가 급상승합니다.\n\n## 5단계: “지출 브레이크” 2개 설치(2분)\n가장 효과 좋은 브레이크는 복잡한 규칙이 아니라 **간단한 제한**입니다.\n\n- 배달: 주 2회까지만\n- 카페: 아메리카노만\n- 쇼핑: 장바구니 24시간 숙성\n\n## 30분 루틴을 유지하는 한 줄\n\n> “예산은 계획이 아니라, 다음 지출을 결정하는 기준표다.”\n\n이번 달이 끝나기 전에 ‘돈이 남았는지’가 아니라 **통제감이 생겼는지**부터 확인해 보세요. 통제감이 생기면 금액은 따라옵니다.\n`,
  },
  {
    file: '2026-03-02-kitchen-mealprep.md',
    title: '식비 줄이는 1시간 밀프렙: 냉장고가 “저축 계좌”가 되는 방법',
    tags: ['kitchen', 'saving', 'routine'],
    description: '주 1회 60분 밀프렙으로 배달/외식 지출을 줄이는 실전 템플릿. 메뉴 구성, 장보기 리스트, 보관, 실패 방지까지 한 번에.',
    body: `식비를 줄이는 가장 강력한 방법은 “덜 먹기”가 아니라 **덜 망하기**입니다.\n\n배달이 터지는 패턴은 거의 고정입니다.\n- 늦게 퇴근 → 뇌가 지침 → ‘생각하기’가 싫음 → 결제\n\n그래서 해결책은 의지 대신 **미리 결정된 옵션**을 준비하는 겁니다.\n\n## 목표\n- 주 1회 60분\n- “조리 완료 2종 + 반조리 2종 + 비상식 2종”\n\n## 1) 60분 밀프렙 구성(추천 템플릿)\n### 조리 완료(바로 먹는 것) 2종\n- 닭가슴살/돼지앞다리 제육볶음\n- 야채볶음/버섯볶음\n\n### 반조리(굽기/끓이기만 하면 됨) 2종\n- 카레/짜장 베이스\n- 된장찌개 재료 세트\n\n### 비상식(뇌가 0%일 때) 2종\n- 냉동밥 + 김\n- 계란 + 참치\n\n## 2) 장보기 리스트(실패 줄이는 핵심)\n- 단백질 1~2kg\n- 냉동야채 2봉(손질 시간 0)\n- 계란\n- 양파/대파(향 베이스)\n- 기본 양념(고추장/간장/다진마늘)\n\n## 3) 보관 규칙(돈 새는 걸 막는 규칙)\n- 3일 내 먹을 건 냉장\n- 4~7일은 냉동\n- 용기는 “규격 통일”\n\n## 4) 배달 버튼을 막는 ‘마지막 장치’\n\n> 냉장고 문에: “배달 누르기 전에, 계란 2개 먼저.”\n\n이 한 줄이 실제로 결제를 막습니다.\n\n## 결론\n식비는 ‘결심’으로 줄지 않습니다.\n**선택지를 미리 만들어두면** 줄어듭니다.\n\n이번 주는 메뉴를 완벽하게 짜지 말고, 템플릿대로만 한 번 돌려보세요.\n`,
  },
];

// 나머지 22개는 카테고리 균형 맞춰 자동 생성
const more = [
  ['declutter-entry', '정리 시작이 어려운 사람을 위한 15분 “현관 리셋”', ['organization', 'routine'], '집 정리의 시작점을 현관으로 잡으면 실패 확률이 낮습니다. 15분 체크리스트로 동선을 복구하세요.'],
  ['digital-minimalism', '휴대폰 알림 다이어트: 하루 집중력이 돌아오는 설정 10가지', ['routine', 'productivity'], '알림/위젯/배지/홈화면을 최소화해 ‘집중력 누수’를 막는 실전 세팅.'],
  ['smart-shopping-rules', '충동구매를 막는 7가지 구매 규칙(진짜 효과 있는 것만)', ['consumption', 'saving'], '장바구니 24시간, 교체 구매, 1-in-1-out 같은 규칙을 상황별로 적용하는 법.'],
  ['kitchen-knives-clean', '칼/도마 위생 루틴: 식중독 걱정 줄이는 3단계', ['kitchen', 'routine'], '세척/소독/건조를 루틴화하면 안전과 냄새 문제가 같이 해결됩니다.'],
  ['laundry-system', '세탁이 쌓이지 않는 집의 “바구니 시스템”', ['organization', 'routine'], '세탁의 병목은 ‘돌리는 것’이 아니라 ‘분류/건조/정리’입니다. 시스템으로 해결하세요.'],
  ['energy-afternoon', '오후 졸림을 줄이는 10분 에너지 루틴(카페인 말고)', ['routine', 'productivity'], '걷기/수분/빛/간식으로 오후 집중력을 회복하는 간단 루틴.'],
  ['subscription-audit', '구독 서비스 정리법: 안 쓰는 결제 5분 만에 찾는 법', ['saving', 'budgeting'], '결제내역에서 구독만 추출해 한 번에 정리하는 방법과 해지 순서.'],
  ['cleaning-weekly', '집이 더러워지기 전에 끝내는 주간 청소 루틴(30분)', ['organization', 'routine'], '청소는 몰아서 하면 지치고, 나눠 하면 유지됩니다. 30분 루틴을 제안합니다.'],
  ['kitchen-fridge-map', '냉장고 “구역 나누기”로 식재료 버림 줄이기', ['kitchen', 'saving', 'organization'], '상단/중단/하단/문칸을 용도별로 나눠 음식물 쓰레기를 줄이는 방법.'],
  ['card-benefit', '카드 혜택이 ‘진짜 이득’인지 10분만에 판별하는 법', ['saving', 'budgeting', 'consumption'], '연회비 대비 실사용 혜택을 계산하는 간단 체크리스트.'],
  ['morning-no-phone', '기상 후 30분 “노폰”이 삶을 바꾸는 이유와 실전 세팅', ['morning', 'routine', 'productivity'], '아침 집중력을 빼앗는 패턴을 끊는 방법. 대체 행동까지 설계.'],
  ['kitchen-freezer', '냉동실이 답이다: 바쁜 날을 구하는 비상식 재고 12개', ['kitchen', 'saving'], '비상식 재고 리스트와 보관/소진 루틴으로 배달을 막습니다.'],
  ['organization-paper', '종이 서류 정리: 1시간에 끝내는 3분류 시스템', ['organization'], '보관/폐기/스캔 3분류로 서류 산을 정리하는 방법.'],
  ['bathroom-reset', '화장실이 지저분해지는 이유: 10분 리셋 루틴', ['organization', 'routine'], '자주 더러워지는 포인트만 잡아 빠르게 리셋하는 방법.'],
  ['shopping-groceries', '장보기 실패 줄이기: 10가지 “고정 메뉴”로 결정 피로 없애기', ['kitchen', 'consumption', 'saving'], '장보기는 메뉴가 아니라 패턴입니다. 고정 메뉴를 만들면 지출이 안정됩니다.'],
  ['budget-dates', '월급날/카드결제일/자동이체일을 ‘한 날’로 모으는 이유', ['budgeting', 'saving'], '날짜가 흩어지면 관리가 깨집니다. 월간 현금흐름을 단순화하세요.'],
  ['declutter-kitchen', '주방 정리의 핵심: 자주 쓰는 것만 “손 닿는 곳”에 두기', ['kitchen', 'organization'], '동선 기준으로 수납을 재배치하는 실전 가이드.' ],
  ['consumption-wardrobe', '옷 쇼핑 줄이는 사람의 옷장 규칙(교체 구매, 캡슐 옷장)', ['consumption', 'saving'], '옷은 스타일이 아니라 시스템으로 줄어듭니다.'],
  ['routine-sunday', '일요일 45분 루틴: 월요일이 쉬워지는 최소 준비', ['routine', 'organization'], '한 주를 덜 힘들게 만드는 준비 루틴.' ],
  ['kitchen-dishwasher', '식기세척기/설거지 스트레스 줄이는 “마감 루틴”', ['kitchen', 'routine'], '밤 7분 마감으로 설거지를 밀리지 않게.' ],
  ['saving-impulse', '충동결제 직전 멈추는 20초 질문 5개', ['saving', 'consumption'], '충동구매를 ‘심리’가 아니라 ‘질문’으로 차단.' ],
  ['organization-cables', '충전 케이블 지옥 끝내기: 케이블/충전기 1세트 원칙', ['organization'], '집 안 케이블을 줄이고 찾는 시간을 없애는 규칙.' ],
  ['kitchen-grocery-templates', '장보기 리스트 템플릿(프린트용): 기본 식재료/양념/비상식', ['kitchen', 'saving'], '장보기 시간을 줄이는 템플릿 제공.' ],
];

const pad = (n) => String(n).padStart(2, '0');
let day = 3;
for (let i = 0; i < more.length; i++) {
  const [slug, title, tags, desc] = more[i];
  const file = `2026-03-${pad(day)}-${slug}.md`;
  day = day === 28 ? 3 : day + 1;
  posts.push({
    file,
    title,
    tags,
    description: desc,
    body: `이 글은 HaruSense의 생활 실험 기록입니다. 아래 체크리스트대로 한 번만 해보면 체감이 옵니다.\n\n## 핵심 요약\n- 오늘 할 1가지\n- 실패를 줄이는 장치 1개\n- 다음 주에 유지하는 방법\n\n## 왜 이게 효과가 있나\n사람이 지치는 이유는 ‘일의 양’보다 **결정해야 할 것이 많기 때문**입니다. 그래서 이 글은 결정을 줄이는 방향으로 구성했습니다.\n\n## 체크리스트(바로 실행)\n- [ ] 1단계: 눈에 보이는 장애물 3개 제거\n- [ ] 2단계: 동선 상 가장 자주 쓰는 5개를 손 닿는 곳으로\n- [ ] 3단계: 7일 뒤 유지 점검(10분)\n\n## 자주 실패하는 이유(그리고 해결)\n- 한 번에 완벽히 하려는 마음 → **15분만**\n- 수납을 먼저 사는 것 → 먼저 비우고, 나중에 사기\n- 규칙이 복잡한 것 → 규칙은 1~2개만\n\n## 마무리\n오늘은 ‘완성’이 아니라 **재시작 가능한 상태**를 만드는 게 목표입니다.\n`,
  });
}

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const cover = coverPool[i % coverPool.length];

  const md = `---\n` +
    `title: "${p.title}"\n` +
    `date: ${p.file.slice(0, 10)}\n` +
    `tags: [${p.tags.join(', ')}]\n` +
    `description: "${p.description}"\n` +
    `coverImage: "${cover.img}"\n` +
    `coverCredit: "${cover.credit}"\n` +
    `coverCreditUrl: "${cover.url}"\n` +
    `---\n\n` +
    p.body;

  writeFileSync(join(outDir.pathname, p.file), md);
}

console.log(`Generated ${posts.length} posts.`);
